
import tempfile
import zipfile
import os
import io

from src.house3d.utils import FileFetcher, LZMAExtractor
from src.config import config
from src.house3d import JSONMetadata
from src.house3d.modelers import LandModeler, VegetationModeler, HouseModeler
from src.price.simple import HousePredictor


class Constructor:

    def __init__(self, house_id: int):
        """
        Create a 3D house from a given LZMA-compressed pickle.
        """
        self.data = self.__retrieve_data(house_id)
        self.house_predictor = HousePredictor()

    @staticmethod
    def __retrieve_data(house_id) -> dict:
        """
        Retrieve and return the house's data fetched from the data API.
        :return: A dictionary with the house's data.
        """

        # Download the file
        file = FileFetcher(config.house_url % house_id).download()

        # Unzip and return its content
        return LZMAExtractor(file).extract()

    def create_all_house_parts(self, directory):
        """
        Create a 3D house by instantiating a HouseModeler for
        each house part.
        :param directory:
        :return:
        """

        houses_meta = []
        index = 0

        for house in self.data['houses']:
            HouseModeler(index, house['dtm'], house['dsm']).save(directory)
            houses_meta.append({
                'x': house['translation'][0],
                'y': house['translation'][1],
                'z': house['translation'][2]
            })

            index += 1

        return houses_meta

    @staticmethod
    def __create_zip(directory) -> io.BytesIO:
        """
        Create a zip deflated archive with all file in a given directory.
        :param directory: The directory to compress files in.
        :return: A buffer with a compressed zip archive.
        """

        # Create a zip_file buffer to write content in.
        archive = io.BytesIO()
        with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as zip_file:

            # Loop through each element of the directory
            for root, dirs, files in os.walk(directory):

                # Append each file within this directory, to the zip_file buffer.
                for file in files:

                    # Rename land.ply
                    file_rename = file
                    if file == "land.ply":
                        file_rename = "land._ply"

                    zip_file.write(os.path.join(root, file), arcname=file_rename)

        archive.seek(0)
        return archive

    def build(self) -> io.BytesIO:
        """
        Build the land, vegetation and house from self.data.
        :return: A buffer with a compressed zip archive, with 3d files inside.
        """

        # Create a temporary directory
        with tempfile.TemporaryDirectory() as directory:

            # Create the land and vegetation
            LandModeler(self.data['dtm_land_bounded'], self.data['dtm_land_bbox']).save(directory)
            VegetationModeler(self.data['dsm_vegetation']).save(directory)

            # Create the house
            house_metadata = self.create_all_house_parts(directory)

            # Predict and append the price
            self.data['meta']['price'] = self.house_predictor\
                .get_prediction(self.data['meta']['postal_code'],
                                self.data['details']['area_property'],
                                self.data['details']['area_building'])

            # Create the JSON file
            JSONMetadata(self.data['translation_land'], house_metadata, self.data['meta'], self.data['details']).save(directory)

            # Return all files into a compressed zip buffer
            return self.__create_zip(directory)
