
import os


class Config:

    def __init__(self):
        self.user_agent = "Wallonia.ml - 3D House application"

        # Database
        self.db_user = os.environ.get("MONGO_USER", 'dbUser')
        self.db_password = os.environ.get("MONGO_PASSWORD", 'XtMmEYnThCYyJHkP')
        self.db_name = "db_address"


config = Config()
