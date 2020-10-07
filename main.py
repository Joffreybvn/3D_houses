
import os
from src.api import create_api

# Init the API
port = int(os.environ.get("PORT", 5000))
api = create_api()


# Run the program
if __name__ == '__main__':

    # Start the API
    api.run('0.0.0.0', port=port, debug=False, threaded=True)