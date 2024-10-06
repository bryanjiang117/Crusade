import yake 
import os
from dotenv import load_dotenv
import requests
import urllib.parse
import logging 
from .gemini import gemini_generate

load_dotenv()


# CURRENTLY UNUSED

# Function to search for TV shows on TMDB
# def query_title(title):
#     base_url = 'https://api.themoviedb.org/3/search/tv'
#     api_key = os.getenv('TMDB_API_KEY')
    
#     encoded_title = urllib.parse.quote(title)
    
#     query_params = {
#         'api_key': api_key,
#         'query': encoded_title,
#         'language': 'en-US',
#         'include_adult': 'false',
#         'page': 1
#     }

#     headers = {
#       "accept": "application/json",
#       "Authorization": f"Bearer {os.getenv('TMDB_API_KEY')}"
#     }

#     response = requests.get(base_url, params=query_params, headers=headers)
    
#     if response.status_code == 200:
#         data = response.json()
        
#         # Print the total results found and the first result if available
#         if data['total_results'] > 0:
#             first_result = data['results'][0]
#             title_found = first_result['name']
#             print('title "', title_found, '" found from searching "', title, '"')
#             return title_found

#     else:
#         logging.error(f"Failed to fetch data. Status code: {response.status_code}")


# def get_titles(text):
#     # note that a keyword can be multiple words
#     keyword_extractor = yake.KeywordExtractor()
#     keywords = keyword_extractor.extract_keywords(text)

#     print('\n-------------------title matches found--------------------')
#     titles = []
#     for kw in keywords:
#         keyword = urllib.parse.quote(kw[0])
#         title = query_title(keyword)
#         if title:
#             titles.append(title)
#     print('----------------end of title matches found----------------\n')
#     return titles


def get_titles(text):
    prompt_prefix = '''
    For the following text, find the names of movies or shows and put print their unabbreviated name separated by a new line. 
    Do not output any other text. 
    The text begins now:
    '''
    prompt = prompt_prefix + text
    gemini_response = gemini_generate(prompt)
    titles = gemini_response.split('\n')
    print('-------------------title matches found--------------------')
    for title in titles:
        print(title)
    print('----------------end of title matches found----------------\n')
    return titles