
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

# App blueprint imports
from src.api.v1 import blueprint


def create_api():

    # Initialize the Flask server
    api = Flask(__name__, static_url_path='')

    # Fix the Swagger UI https
    api.wsgi_app = ProxyFix(api.wsgi_app, x_proto=1, x_host=1)

    # Load the blueprints
    api.register_blueprint(blueprint, url_prefix='/v1')

    return api
