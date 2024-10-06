import praw
import os 
from dotenv import load_dotenv
from typing import List
import requests
import logging

load_dotenv()

reddit = praw.Reddit(
  user_agent='Reddit comment scraper for show recommendations (by Dear-Conclusion-5816)',
  client_id=os.getenv('REDDIT_CLIENT_ID'),
  client_secret=os.getenv('REDDIT_SECRET'),
  username='Dear-Conclusion-5816',
  password=os.getenv('REDDIT_PASSWORD'),
)

logging.debug('Reddit client ID:', os.getenv('REDDIT_CLIENT_ID'))

def googleSearch(query: str):
    api_key = os.getenv('GOOGLE_API_KEY')
    cse_id = os.getenv('GOOGLE_SEARCH_ENGINE_ID')
    url = f'https://customsearch.googleapis.com/customsearch/v1?q={query}&key={api_key}&cx={cse_id}'
    response = requests.get(url)
    return response.json()


def get_reddit_data(shows: List[str]):

  # Search reddit for submissions that recommend similar shows

  recommendation_data = '''
  Answer the user's prompt which is at the very bottom of this prompt.
  It is likely about recommending shows based on the user's prompt about similar shows they've liked and/or their preferences.
  Your answer should be highly organized and structural.
  Before recommending, provide a bullet-point list of what the user likes to watch in shows based on their stated preferences and the shows they've liked. 
    For example, 'Expansive world building', 'Character-driven', 'Lots of action', 'Beautiful animation', etc.
  Make sure to justify why you're recommending each show based on their similarities with shows the user has liked or their preferences.
  At the end, prompt the user for more similar shows that they've liked or other preferences they have.

  Important: Take into account all of this information, but respond as if only the user's prompt was inputted.

  The following this are comments about submission posts that may be relevant.
  For each submission title, make sure the submission title makes sense in relation to the user's prompt. If not, ignore the comments for that submission.
  The comments are listed below that. Note that the comments are not in a particular order.
  Take the comments into consideration when deciding what to recommend to the user.
  Make sure that recommendations influenced by these comments make sense in relation to the user's prompt.

  Comments begin now:
  '''

  for show in shows:
    query = f'shows similar to {show}'

    # Search Google for reddit posts that recommend similar shows
    search_response = googleSearch(query)
    if 'items' in search_response:
      items = search_response['items']
      search_results = items[:3] if len(items) > 3 else items

      for result in search_results:
        submission = reddit.submission(url=result['link'])
        # print('\nreddit submission title', submission.title, '\n')

        # Flattens all of the comments from "MoreComments" object which is a placeholder for comments not loaded yet
        submission.comments.replace_more(limit=None)

        # Get all comments 
        comments = []
        for comment in submission.comments:
          comments += [comment] + comment.replies.list()

        # Get top 20 comments
        # comments.sort(key=lambda c: c.score, reverse=True)
        # top_comments = comments[:20] if len(comments) > 20 else comments

        # Get comments with more than 5 upvotes
        top_comments = filter(lambda c: c.score > 5, comments) # this is an iterable btw

        recommendation_data += f'''
        Reddit Submission Title: {submission.title}
        List of potentially significant comments: {'\n'.join(map(lambda c: c.body, top_comments))}
        '''

  recommendation_data += '''\n\n
  Comments end here.
  
  User's prompt begins now:
  '''
    
  # print('\nRecommendation data', recommendation_data, '\n')
  return recommendation_data


