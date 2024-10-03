import praw
import os 
from dotenv import load_dotenv
from typing import List
import requests

load_dotenv()

reddit = praw.Reddit(
  user_agent='Reddit comment scraper for show recommendations (by Dear-Conclusion-5816)',
  client_id=os.getenv('REDDIT_CLIENT_ID'),
  client_secret=os.getenv('REDDIT_SECRET'),
  username='Dear-Conclusion-5816',
  password=os.getenv('REDDIT_PASSWORD'),
)

def googleSearch(query: str):
    api_key = os.getenv('GOOGLE_API_KEY')
    cse_id = os.getenv('GOOGLE_SEARCH_ENGINE_ID')
    url = f'https://customsearch.googleapis.com/customsearch/v1?q={query}&key={api_key}&cx={cse_id}'
    response = requests.get(url)
    return response.json()


def get_recommendation_data(shows: List[str]):

  query = f'shows similar to {",".join(shows)}'

  # Search reddit for submissions that recommend similar shows

  # search_results = list(reddit.subreddit('all').search(query, limit=500))
  # search_results.sort(key=lambda s: s.score, reverse=True)
  # top_search_results = search_results[:30] if len(search_results) > 30 else search_results

  # search_results = reddit.subreddit('all').search(f'shows similar to {','.join(shows)}', limit=5)
  
  # Search Google for reddit posts that recommend similar shows
  search_results = googleSearch(query)['items']
  print('number of search results:', len(search_results))

  recommendation_data = ''

  for result in search_results:
    submission = reddit.submission(url=result['link'])
    print(submission.title)

    # Flattens all of the comments from "MoreComments" object which is a placeholder for comments not loaded yet
    submission.comments.replace_more(limit=None)

    # Get all comments 
    comments = []
    for comment in submission.comments:
      comments += [comment] + comment.replies.list()

    # Get top 20 comments
    # comments.sort(key=lambda c: c.score, reverse=True)
    # top_comments = comments[:20] if len(comments) > 20 else comments

    # Get all comments with more than 5 upvotes
    top_comments = filter(lambda c: c.score > 5, comments) # this is an iterable btw

    recommendation_data += '\n'.join(map(lambda c: c.body, top_comments))

  print(recommendation_data)
  
  return recommendation_data

    
get_recommendation_data(['Game of Thrones'])
