
# Imports
from flask import Response
from flask_restx import Namespace, Resource

from src.api.utils import JSONResponse
from src.geocoder import Geocoder

# API documentation init
api = Namespace('model', description='3D model interactions')


@api.route('/<int:postal_code>/<string:street_name>/<string:house_number>')
class Status(Resource):

    @api.doc(responses={
        200: 'Success',
        400: 'Invalid address provided'
    })
    def get(self, postal_code: int, street_name: str, house_number: str):
        """
        Return the API server status.
        Return "Alive!" if this API server is online.
        """

        # Geocode the address
        geocoder = Geocoder(postal_code, street_name, house_number)

        # If the geocoding is a success, return tje coordinates.
        if coordinates := geocoder.get_coordinates():
            return JSONResponse(
                status_code=200,
                message=str(coordinates),
                data=None
            ).get_response()

        # If the geocoding failed, return an error message.
        else:
            return JSONResponse(
                status_code=400,
                message="Invalid address provided.",
                data=None
            ).get_response()
