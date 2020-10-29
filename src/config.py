

class Config:

    def __init__(self):
        self.user_agent = "Wallonia.ml - 3D House application"

        # Data API
        self.house_url = "https://static.wallonia.ml/file/wallonia-lidar/houses/house_%d.xz"


config = Config()
