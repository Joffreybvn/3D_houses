
from random import randint
from flask import Response, request
from flask_restx import Namespace, Resource, fields

# API documentation init
api = Namespace('price', description='3D price prediction')

model = api.model('Model', {
    'price': fields.Integer,
})


@api.route('/')
class Price(Resource):

    @api.marshal_with(model)
    def post(self):

        json_data = request.get_json(force=True)
        un = json_data['postal_code']
        pw = json_data['house_m2']

        print(un)

        return {'price': randint(50_000, 200_000)}
