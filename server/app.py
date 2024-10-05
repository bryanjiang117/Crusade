import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from .gemini import gemini_generate, gemini_new_chat

load_dotenv()

app = Flask(__name__, static_folder='../client/dist')

CORS(app, resources={r"/*": {"origins": "*"}})

app.config['CORS_HEADERS'] = 'Content-Type'
app.config.from_mapping(SECRET_KEY=os.getenv('FLASK_SECRET_KEY'))

# Logging for debugging purposes
import logging
logging.basicConfig(level=logging.DEBUG)

logging.debug("App is initialized")

@app.route('/')
def serve_frontend():
    try:
        # Log the static folder path and check if the file exists
        index_path = os.path.join(app.static_folder, 'index.html')
        logging.debug(f"Trying to serve index.html from: {index_path}")

        if os.path.exists(index_path):
            logging.debug("index.html found")
        else:
            logging.error("index.html not found")
        
        # Serve the file if found
        return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
        logging.error(f"Error serving index.html: {e}")
        return "Error serving file", 500

# Serve static assets
@app.route('/<path:path>')
def serve_static_files(path):
   logging.debug(f"Serving static file: {path}")
   return send_from_directory(app.static_folder, path)

# API routes
@app.route('/new_chat', methods=['POST'])
def new_chat():
   session_id = gemini_new_chat()
   return jsonify({'session_id': session_id}), 200

@app.route('/generate', methods=['POST'])
def generate():
   data = request.json
   prompt = data['prompt']
   session_id = data['session_id']
   response = gemini_generate(prompt, session_id)
   return jsonify({'response': response}), 200

if __name__ == "__main__":
    logging.debug("Starting app")
    app.run(host='0.0.0.0', port=8080)
