
class JSONResponse:

    def __init__(self, status_code: int, message: str):
        """
        Generate a Dictionary response to send with Flask, which will
        automatically convert is into a JSON.

        :param status_code: HTTP status of the response.
        """
        self.status_code = status_code

        # Generate an outcome and a status message from the status code.
        self.outcome = self.__create_outcome(status_code)
        self.status_message = message

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

    def response(self):
        """
        Generate a Dictionary response to be send with Flask.
        Flask will automatically transform it into JSON.
        """

        return {
            'status': self.outcome,
            'message': self.status_message,
        }, self.status_code
