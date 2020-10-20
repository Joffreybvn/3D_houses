
import lzma
import _pickle as c_pickle  # Import the C version of pickle


class LZMAExtractor:

    def __init__(self, file: bytes):
        """
        Open a LZMA-compressed pickle and return its content.
        :type file: And object-like LZMA archive.
        """
        self.file: bytes = file

    def extract(self) -> dict:
        """
        Extract the LZMA file given to this class, and return its content.
        :return: The content of the compressed pickle file.
        """

        binaries = lzma.decompress(self.file)
        return c_pickle.loads(binaries)
