import os 
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from gemini import gemini_generate, gemini_new_chat

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

app.config['CORS_HEADERS'] = 'Content-Type' # Allows CORS for JSON resources
app.config.from_mapping(SECRET_KEY=os.getenv('FLASK_SECRET_KEY'))

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

if __name__ == '__main__':
    app.run(debug=True)