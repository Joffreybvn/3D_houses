

import unittest
from src.geocoder import Geocoder


class GeocoderTest(unittest.TestCase):

    def test_address(self):

        # Normal address
        self.assertEqual(self.get_coordinates(6110, "Vandervelde", "21"), (50.38137845, 4.383413155434782))
        self.assertEqual(self.get_coordinates(6110, "Vanderveelde", "21"), None)  # Bad street name
        self.assertEqual(self.get_coordinates(76110, "Vandervelde", "21"), None)  # Bad postal code

    @staticmethod
    def get_coordinates(postal_code, street, house_number):
        geocoder = Geocoder(postal_code, street, house_number)
        return geocoder.get_coordinates()


if __name__ == '__main__':
    unittest.main()
