
import pandas as pd


class Geocoder:
    """
    Transform the geo_localisation values sent to this API,
    into clean and usables values for the prediction models.
    """

    def __init__(self):
        self.geo: pd.DataFrame = self.__load_geo_localization_dataset()
        self.postal_codes: pd.Series = self.geo['postal_code']

    @staticmethod
    def __load_geo_localization_dataset() -> pd.DataFrame:
        """
        Load the geo-localisation dataset and return
        the subset needed for this class.
        """

        # Load the CSV
        df = pd.read_csv('./assets/localisation_data.csv')

        # Take only the useful values
        return df[['postal_code',
                   'district_int',
                   'province_int',
                   'region_int',
                   'ratio_free_build']]

    def __fallback_existing_postal_code(self, postal_code: int) -> int:
        """
        Check and return existing postal codes.

        :param postal_code: The postal code tp check.
        :type postal_code: int

        :return: The corrected postal code.
        :rtype: int
        """

        # If the postal code exist, return it
        if self.postal_codes.isin([postal_code]).sum():
            return postal_code

        # If not, return a. existing postal code. Ex: 6999 -> 6000
        else:
            return int(round(postal_code / 1000, 0) * 1000)

    def geocode(self, postal_code: int) -> list:
        """
        From a given postal code, return the corresponding
        district, region, province and land occupation ratio.

        :param postal_code: The postal code to geo-code
        :type postal_code: int

        :return: A list with the ['district_int', 'province_int',
            'region_int', 'ratio_free_build'] values.
        :rtype: list
        """

        # Check if the postal code exists
        postal_code = self.__fallback_existing_postal_code(postal_code)

        # Get the localization data from the self.geo dataframe
        localization = self.geo[self.geo['postal_code'] == postal_code]\
            [['district_int',
              'province_int',
              'region_int',
              'ratio_free_build']].iloc[0]

        # Convert to list and return it
        return localization.T.to_numpy().tolist()
