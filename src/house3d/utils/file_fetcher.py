
from requests import get


class FileFetcher:

    def __init__(self, url: str):
        """
        Fetch a given url and save the file returned by this URL.
        """
        self.url = url

    def download(self) -> bytes:
        """
        Download and return the file linked to this class self.url.
        """

        # Fetch the given URL
        response = get(self.url)

        # Stop the execution if the file was not found.
        if response.status_code != 200:
            raise FetchError

        # Return the file
        return response.content


class FetchError(Exception):
    """Base class for exceptions in this module."""
    pass
