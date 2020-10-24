
import json


class JSONMetadata:

    def __init__(self, offset_land, offset_house, metadata):
        """
        Create and return a JSON with the offset of the land and the house.
        :param offset_land: A (x, y, z) offset of the land, relative to 0, 0.
        :param offset_house: A (x, y) offset of the house, relative to land 0, 0.
        :param metadata: Metadata dictionary of the house.
        """

        self.offset_land = offset_land
        self.offset_house = offset_house
        self.metadata = metadata

    def create(self):
        """
        Create a dictionary with the house and land offsets.
        :return: The dictionary with the offsets.
        """

        return {
            'offsets': {
                'land': {
                    'x': self.offset_land[0],
                    'y': self.offset_land[1],
                    'z': self.offset_land[2]
                },
                'house': {
                    'x': self.offset_house[0],
                    'y': self.offset_house[1],
                }
            },
            'meta': self.metadata
        }

    def save(self, directory):
        """
        Save the dictionary to a JSON file.
        :param directory: The dictionary to save.
        """

        # Create the offsets.
        offsets = self.create()

        # Save the dictionary to the JSON file.
        with open(f'{directory}/metadata.json', 'w') as fp:
            json.dump(offsets, fp)
