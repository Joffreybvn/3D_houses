
from src.config import config
import pymongo


class Database:

    def __init__(self):
        self.client = pymongo.MongoClient(f'mongodb+srv://{config.db_user}:{config.db_password}@cluster-geocoding.kd4tx.mongodb.net/')

        print(self.client.db_address)
