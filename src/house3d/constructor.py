
import tempfile
import zipfile
import os
import io

from src.house3d.utils import FileFetcher, LZMAExtractor
from src.config import config
from src.house3d import JSONOffsets
from src.house3d.modelers import LandModeler, VegetationModeler, HouseModeler


class Constructor:

    def __init__(self, house_id: int):
        """
        Create a 3D house from a given LZMA-compressed pickle.
        """
        self.data = self.__retrieve_data(house_id)

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
                    zip_file.write(os.path.join(root, file), arcname=file)

        archive.seek(0)
        return archive

    def build(self) -> io.BytesIO:
        """
        Build the land, vegetation and house from self.data.
        :return: A buffer with a compressed zip archive, with 3d files inside.
        """

        # Create a temporary directory
        with tempfile.TemporaryDirectory() as directory:

            # Create the land, vegetation and house.
            LandModeler(self.data['dtm_land_bounded'], self.data['dtm_land_bbox']).save(directory)
            VegetationModeler(self.data['dsm_vegetation']).save(directory)
            HouseModeler(self.data['dtm_house'], self.data['dsm_house']).save(directory)
            JSONOffsets(self.data['translation_land'], self.data['translation_house']).save(directory)

            # Return all files into a compressed zip buffer
            return self.__create_zip(directory)
