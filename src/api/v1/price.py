
from random import randint
from flask import request
from flask_restx import Namespace, Resource, fields
from src.price.advanced import HousePredictor, ApartmentPredictor

# API documentation init
api = Namespace('price', description='Property price prediction')

model = api.model('Model', {
    'price': fields.Integer,
})


@api.route('/')
class Price(Resource):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Initialize the predictors
        self.house_predictor = HousePredictor()
        self.apartment_predictor = ApartmentPredictor()

    @api.marshal_with(model)
    def post(self):

        try:
            # Get the JSON data as dict
            json_data = request.get_json(force=True)

            # Predict the price of a house
            if json_data.get('property_type', 'house') == 'house':
                price = self.house_predictor.get_prediction(json_data)

            # Predict the price of an apartment
            else:
                price = self.apartment_predictor.get_prediction(json_data)

            # Send a response
            return {
                'price': price,
                'status': True,
                'message': "The prediction was handled correctly."
            }

        except:

            return {
                'price': 0,
                'status': False,
                'message': "An unknown error occurred during the price prediction"
            }

