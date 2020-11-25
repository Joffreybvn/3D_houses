
import pickle
from typing import Tuple
import xgboost as xgb
from src.price import Geocoder


class BasePredictor:

    def __init__(self, model_file: str):
        self.model, self.scaler = self.__load_model(model_file)
        self.geocoder = Geocoder()

    @staticmethod
    def __load_model(model_file: str) -> Tuple[xgb.XGBRegressor, any]:
        """Load the basic house model."""

        # Load the pickle file
        binary = pickle.load(open(f"./assets/{model_file}", "rb"))

        # Return a tuple of the model and the scaler
        return binary['model'], binary['scaler']

    def _retrieve_geo_localization_data(self, postal_code: int) -> list:

        # Retrieve and return the geo-localization data
        return self.geocoder.geocode(postal_code)

    def _predict(self, property_data: list) -> float:
        """
        Take sanitized house/apartment data and return the predicted price.

        :param property_data: House data to predict price from.
        :type property_data: list

        :return: The predicted price.
        :rtype: float
        """

        # Scale the inputs
        scaled_data = self.scaler.transform(property_data)

        # Predict and return the price
        return int(self.model.predict(scaled_data)[0])
