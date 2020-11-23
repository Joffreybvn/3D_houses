
# Initialize this package as a Flask blueprint
from flask import Blueprint
from flask_restx import Api

# Import the routes
from src.api.v1 import api_model, api_price

blueprint = Blueprint('v1', __name__)

# Merge the blueprints with the doc
api = Api(blueprint,
          title='Wallonia.ml API',
          version='1.0',
          description="Wallonia's properties prices and 3D models.")

api.add_namespace(api_model)
api.add_namespace(api_price)
