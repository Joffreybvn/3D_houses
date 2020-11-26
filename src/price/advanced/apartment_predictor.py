
from src.price.advanced import AdvancedPredictor


class ApartmentPredictor(AdvancedPredictor):

    def __init__(self):
        super().__init__("model_advanced_apartment.p")

    def __sanitize(self, apt_data: dict) -> list:
        """
        Sanitize the given apartment data: Geocode the postal code,
        convert boolean to int and fill in the missing values.

        :param apt_data: Apartment data to predict price from.
        :type apt_data: dict

        :return: The sanitize apartment data in a vector.
        :rtype: list
        """

        # Sanitize the data
        sanitized = [apt_data.get('bedrooms_number', 1),  # bedrooms_number
                     apt_data.get('house_area', 90),  # house_area

                     # Boolean parameters
                     int(apt_data.get('open_fire', 1)),  # open_fire
                     int(apt_data.get('terrace', 1))]  # terrace

        # Append the geo-localization data
        postal_code = apt_data.get('postal_code', 2000)
        sanitized += self._retrieve_geo_localization_data(postal_code)

        return [sanitized]

    def get_prediction(self, property_data: dict) -> float:
        """
        Predict the price for a given house.

        :param property_data: Apartment data to predict price from.
        :type property_data: dict

        :return: The predicted price of the apartment.
        :rtype: float
        """

        # Sanitize the data
        sanitized_data = self.__sanitize(property_data)

        # Predict and return the price
        return self._predict(sanitized_data)
