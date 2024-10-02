import os 
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from gemini import gemini_generate

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/generate": {"origins": "*"}})

app.config['CORS_HEADERS'] = 'Content-Type' # Allows CORS for JSON resources
app.config.from_mapping(SECRET_KEY=os.getenv('FLASK_SECRET_KEY'))


@app.route('/generate', methods=['POST'])
def generate():  
  data = request.json
  prompt = data['prompt']
  history = data['history']
  response = gemini_generate(prompt, history)
  return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)