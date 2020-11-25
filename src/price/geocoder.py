
import pandas as pd


class Geocoder:
    """
    Transform the values send to this API,
    into clean and usables values for the prediction models.
    """

    def __init__(self):
        self.geo = self.__load_geo_localization_dataset()

    @staticmethod
    def __load_geo_localization_dataset() -> pd.DataFrame:
        """
        Load the geo-localisation dataset and return
        the subset needed for this class.
        """

        df = pd.read_csv('./assets/localisation_data.csv')

        return df[['postal_code',
                   'district_int',
                   'province_int',
                   'region_int',
                   'ratio_free_build']]

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

        # Get the localization data from the self.geo dataframe
        localization: pd.DataFrame = self.geo[self.geo['postal_code'] == postal_code]\
            [['district_int', 'province_int', 'region_int', 'ratio_free_build']].iloc[0]

        # Transform the data and return it
        return localization.T.to_numpy().tolist()