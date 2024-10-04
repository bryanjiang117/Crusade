import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

genai.configure(api_key=os.getenv('GOOGLE_GEN_KEY'))

model = genai.GenerativeModel('gemini-1.5-flash')

# Shows and movies may contain sexually explicit or dangerous content, thus these categories are loosened 
# safetySettings = [
#   {
#     'category': HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
#     'threshold': HarmBlockThreshold.BLOCK_ONLY_HIGH, 

#   },
#   {
#     'category': HarmCategory.HARM_CATEGORY_HATE_SPEECH,
#     'threshold': HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,

#   },
#   {
#     'category': HarmCategory.HARM_CATEGORY_HARASSMENT,
#     'threshold': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,

#   },
#   {
#     'category': HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
#     'threshold': HarmBlockThreshold.BLOCK_ONLY_HIGH,

#   }
# ]

sessions = {}

def gemini_generate(prompt, session_id):
  result = sessions[session_id].send_message(prompt)
  return result.text

def gemini_new_chat():
  chatSession = model.start_chat()
  session_id = str(uuid.uuid4())
  sessions[session_id] = chatSession
  return session_id


