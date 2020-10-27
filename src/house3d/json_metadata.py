
import json


class JSONMetadata:

    def __init__(self, offset_land, house_metadata, metadata, details):
        """
        Create and return a JSON with the offset of the land and the house.
        :param offset_land: A (x, y, z) offset of the land, relative to 0, 0.
        :param house_metadata: A list of offsets and index of each house's part.
        :param metadata: Metadata dictionary of the house.
        :param details: Details of the house (terrain area and house area).
        """

        self.offset_land = offset_land
        self.house_metadata = house_metadata
        self.metadata = metadata
        self.details = details

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
                'house': self.house_metadata
            },
            'meta': self.metadata,
            'details': self.details
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
