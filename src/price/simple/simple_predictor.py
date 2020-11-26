
from src.price import BasePredictor


class SimplePredictor(BasePredictor):

    def __init__(self, model_file: str):
        super().__init__(model_file)

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

        # Predict and return the price - CatBoostRegressor
        return int(self.model.predict(scaled_data)[0])
