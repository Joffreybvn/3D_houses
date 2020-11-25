
from src.price.advanced import AdvancedPredictor


class HousePredictor(AdvancedPredictor):

    def __init__(self):
        super().__init__("model_advanced_house.p")

    def __sanitize(self, house_data: dict) -> list:
        """
        Sanitize the given house data: Geocode the postal code,
        convert boolean to int and fill in the missing values.

        :param house_data: House data to predict price from.
        :type house_data: dict

        :return: The sanitize house data in a vector.
        :rtype: list
        """

        # Sanitize the data
        sanitized = [house_data.get('facades_number', 2),  # facades_number
                     house_data.get('bedrooms_number', 1),  # bedrooms_number
                     house_data.get('house_area', 90),  # house_area
                     house_data.get('property_m2', 250),  # property_m2

                     # Boolean parameters
                     int(house_data.get('open_fire', 1)),  # open_fire
                     int(house_data.get('terrace', 1)),  # terrace
                     int(house_data.get('garden', 1))]  # garden

        # Append the geo-localization data
        postal_code = house_data.get('postal_code', 2000)
        sanitized += self._retrieve_geo_localization_data(postal_code)

        return [sanitized]

    def get_prediction(self, property_data: dict) -> float:
        """
        Predict the price for a given house.

        :param property_data: House data to predict price from.
        :type property_data: dict

        :return: The predicted price of the house.
        :rtype: float
        """

        # Sanitize the data
        sanitized_data = self.__sanitize(property_data)

        # Predict and return the price
        return self._predict(sanitized_data)
