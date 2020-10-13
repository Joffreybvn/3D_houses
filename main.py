
import os
from src.api import create_api

from src.geocoder.db import Database

# Init the API
port = int(os.environ.get("PORT", 3000))
api = create_api()


# Run the program
if __name__ == '__main__':

    # Start the API
    #api.run('0.0.0.0', port=port, debug=False)

    Database()
