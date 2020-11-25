
from src.price import BasePredictor


class HousePredictor(BasePredictor):

    def __init__(self):
        super().__init__("model_basic_house.p")

    def __sanitize(self, postal_code, property_m2, house_ground_m2) -> list:
        """
        Sanitize the given apartment data: Geocode the postal code,
        convert boolean to int and fill in the missing values.

        :return: The sanitize apartment data in a vector.
        :rtype: list
        """

        # Sanitize the data
        sanitized = [house_ground_m2,  # house_area
                     property_m2]  # property_m2

        # Append the geo-localization data
        sanitized += self._retrieve_geo_localization_data(postal_code)

        return [sanitized]

    def get_prediction(self, postal_code: int, property_m2: float, house_ground_m2: float) -> float:
        """
        Predict the price for a given house.

        :return: The predicted price of the apartment.
        :rtype: float
        """

        # Sanitize the data
        sanitized_data = self.__sanitize(postal_code, property_m2, house_ground_m2)

        # Predict and return the price
        return self._predict(sanitized_data)
