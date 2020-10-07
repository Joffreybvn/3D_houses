
# Imports
from flask import Response
from flask_restx import Namespace, Resource

# API documentation init
api = Namespace('model', description='3D model interactions')


@api.route('<int:postal_code>/<string:street_name>/<string:house_number>')
class Status(Resource):

    @api.response(200, "Success")
    def get(self, postal_code: int, street_name: str, house_number: str):
        """
        Return the API server status.
        Return "Alive!" if this API server is online.
        """

        # Return a plain text response
        return Response("Alive!", 200)
