import os
from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask
import logging

logging.basicConfig(level=logging.DEBUG)

load_dotenv()

def create_app():
  app = Flask(__name__, static_folder='../dist')

  CORS(app, resources={r"/*": {"origins": "*"}})
  app.config['CORS_HEADERS'] = 'Content-Type'
  app.config.from_mapping(SECRET_KEY=os.getenv('FLASK_SECRET_KEY'))

  with app.app_context():
    from .routes import init_routes
    init_routes(app)
    
  logging.debug("App is initialized")

  return app
