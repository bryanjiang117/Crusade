import os
from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask
import logging

logging.basicConfig(level=logging.WARNING)

load_dotenv()

def create_app():
  static_folder_path = '../dist' if os.path.exists('../dist') else '../client/dist' #../client/dist is for dev environment
  app = Flask(__name__, static_folder=static_folder_path)

  CORS(app, resources={r"/*": {"origins": "*"}})
  app.config['CORS_HEADERS'] = 'Content-Type'
  app.config.from_mapping(SECRET_KEY=os.getenv('FLASK_SECRET_KEY'))

  with app.app_context():
    from .routes import init_routes
    init_routes(app)
    
  logging.debug("App is initialized")

  return app
