
from geopy.geocoders import Nominatim
from typing import Tuple, Union
from src.config import config


class Geocoder:

    def __init__(self, postal_code: int, street_name: str, house_number: str):
        """
        Geocode an address from the free service: OpenStreetMap Nominatim.
        Get the full address with get_address().
        Get the coordinates (latitude, longitude) with get_coordinates().

        :param postal_code: The postal code of the city.
        :param street_name: The street name, without "Rue".
        :param house_number: The house number (eg: 126, 36A).
        """

        # Set the user agent
        self.locator = Nominatim(user_agent=config.user_agent)

        # Geocode the address
        self.location = self.locator.geocode(f"Rue {street_name}, {house_number} {postal_code}")

    def get_address(self) -> Union[str, None]:
        """Return the full address of the location, or None."""

        # If the location exists, return the address.
        if self.location:
            return self.location.address

        return None

    def get_coordinates(self) -> Union[Tuple, None]:
        """Return the coordinates (latitude, longitude) of the location, or None."""

        # If the location exists, return the coordinates.
        if self.location:
            return self.location.latitude, self.location.longitude

        return None
