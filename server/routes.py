from flask import jsonify, request, send_from_directory
from .gemini import gemini_chat_generate, gemini_new_chat
import os
import logging
from .webscrape import get_reddit_data
from .keyword_extraction import get_titles


def init_routes(app):
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

    titles = get_titles(prompt)
    reddit_data = get_reddit_data(titles)
    gemini_input = reddit_data + prompt

    response = gemini_chat_generate(gemini_input, session_id)

    # print('RESPONSE', response)

    return jsonify({'response': response}), 200
