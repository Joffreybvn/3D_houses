
class JSONResponse:

    def __init__(self, status_code: int, message=None, data=None):
        """
        Generate a Dictionary response to send with Flask, which will
        automatically convert is into a JSON.

        :param status_code: HTTP status of the response.
        :param data: The data to send.
        """
        self.status_code = status_code

        # Generate an outcome and a status message from the status code.
        self.outcome = self.__create_outcome(status_code)
        self.status_message = self.__create_status_message(message, status_code)

        self.data = data

    @staticmethod
    def __create_outcome(status_code) -> bool:
        """
        Create a outcome value: True if the status code is 200,
        False if the status code is anything else.
        """

        # Return True if the status code is 200.
        if status_code == 200:
            return True

        return False

    @staticmethod
    def __create_status_message(message, status_code) -> str:
        """Create and return a status message from a given status code."""

        if message is not None:
            return message

        else:
            return ''

    def get_response(self):
        """
        Generate a Dictionary response to be send with Flask.
        Flask will automatically transform it into JSON.
        """

        return {
            'status': self.outcome,
            'message': self.status_message,
            'data': self.data
        }, self.status_code
