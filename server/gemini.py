import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os
from dotenv import load_dotenv
import uuid
import time

load_dotenv()

genai.configure(api_key=os.getenv('GOOGLE_GEN_KEY'))


# ----------- Fine tuning a model to get names of shows and movies ------------

# base_model = "models/gemini-1.5-flash-001-tuning"

# training_data = [
#   {
#     "text_input": 'What are some long TV series similar to game of thrones? i also liked vikings but the world building wasnt as cool as game of thrones. i really like worldbuilding, for example the lord of the rings and hobbit series. I also really liked mushoku tensei bc it had good world building. SAO was cool for that reason as well. find me recommendations pls',
#     "output": "Game of Thrones\nVikings\nLord of the Rings\nThe Hobbit\nMushoku Tensei\nSword Art Online"}
# ]

# operation = genai.create_tuned_model(
#   display_name="increment",
#   source_model=base_model,
#   epoch_count=10,
#   batch_size=1,
#   learning_rate=0.003,
#   training_data=training_data,
# )

# for status in operation.wait_bar():
#   time.sleep(10)

# result = operation.result()
# print(result)

# --------------------- End of fine tuning ---------------------



# --------------------- Models ---------------------

model = genai.GenerativeModel('gemini-1.5-flash')
title_extraction_model = genai.GenerativeModel('gemini-1.5-flash')
# title_extraction_model = genai.GenerativeModel(model_name=result.name)

# --------------------- End of Models ---------------------



# Shows and movies may contain sexually explicit or dangerous content, thus these categories are loosened 
safety_settings = [
  {
    'category': HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    'threshold': HarmBlockThreshold.BLOCK_ONLY_HIGH, 

  },
  {
    'category': HarmCategory.HARM_CATEGORY_HARASSMENT,
    'threshold': HarmBlockThreshold.BLOCK_ONLY_HIGH,

  },
  {
    'category': HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    'threshold': HarmBlockThreshold.BLOCK_ONLY_HIGH,
  }
]


# sessions stores the active chat sessions
sessions = {}

def gemini_generate(prompt):
  result = title_extraction_model.generate_content(prompt, safety_settings = safety_settings)
  return result.text

def gemini_chat_generate(prompt, session_id):
  result = sessions[session_id].send_message(prompt)
  return result.text

def gemini_new_chat():
  chatSession = model.start_chat()
  session_id = str(uuid.uuid4())
  sessions[session_id] = chatSession
  return session_id


