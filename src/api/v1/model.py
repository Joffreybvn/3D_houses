
# Imports
import lzma
import os
import tempfile
from pickle import PickleError, UnpicklingError
from flask import Response
from flask_restx import Namespace, Resource

from src.house3d import Constructor
from src.house3d.utils import FetchError
from src.api.utils import JSONResponse

# API documentation init
api = Namespace('model', description='3D model creation.')


@api.route('/<int:house_id>/')
class Status(Resource):

    @api.doc(responses={
        200: 'Request has succeeded',
        404: 'The server can not find the requested resource',
        500: 'The server encountered an unexpected error and could not perform the request'
    })
    def get(self, house_id: int):
        """
        Return the 3D model of a house.
        Return a 'application/zip' file with the files needed to render a house.
        """

        # Try to create a constructor Object with the given house id.
        try:
            constructor = Constructor(house_id)

        # Error: No file was returned from the data API with this house id.
        except FetchError:
            return JSONResponse(
                status_code=404,
                message='No house was found with the given house id.')

        # Error: The retrieved file could not be decompressed.
        # https://docs.python.org/3/library/lzma.html#lzma.LZMADecompressor
        except (lzma.LZMAError, EOFError):
            return JSONResponse(
                status_code=500,
                message='An server error occurred during the decompression of '
                        'the house data. Please contact an administrator.')

        # Error: The retrieved and decompressed file could not be unpickled.
        # https://docs.python.org/3.8/library/pickle.html#pickle.PickleError
        except (PickleError, UnpicklingError, ImportError, AttributeError, IndexError):
            return JSONResponse(
                status_code=500,
                message='An server error occurred during the reading of the '
                        'house data. Please contact an administrator.')

        # If the constructor creation succeeded, try to build the 3D objects
        else:
            try:
                zip_file = constructor.build()

            # Error: The temporary folder could not be created.
            except tempfile.mkdtemp:
                return JSONResponse(
                    status_code=500,
                    message='The temporary folder could not be created. '
                            'Please contact an administrator.')

            # Error: The buffer was handled incorrectly.
            except (OSError, IOError):
                return JSONResponse(
                    status_code=500,
                    message='The buffer was handled incorrectly. '
                            'Please contact an administrator.')

            # Error: The files could not be recovered after their creation.
            except os.walk:
                return JSONResponse(
                    status_code=500,
                    message='The files could not be recovered after their creation. '
                            'Please contact an administrator.')

            # Error: The files could not be compressed to a zip buffer.
            except (ValueError, RuntimeError):
                return JSONResponse(
                    status_code=500,
                    message='The files could not be compressed to a zip buffer. '
                            'Please contact an administrator.')

            else:
                return Response(
                    zip_file.read(),
                    mimetype='application/zip',
                    headers={'Content-Disposition': 'attachment; filename=data.zip'})

