# see documentation:

# https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets

# https://developer.twitter.com/en/docs/tweets/tweet-updates

# search operators: https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators

# pagination (cursoring): https://developer.twitter.com/en/docs/tweets/timelines/guides/working-with-timelines

import requests
import pandas as pd
from collections import namedtuple
from urllib.parse import quote, parse_qs
from functools import lru_cache
from tqdm import tqdm_notebook as tqdm

class TweetScraper:
    
    SEARCH_FIELDS = [
        'coordinates',
        'created_at',
        'entities',
        'full_text',
        'geo',
        'id',
        'metadata',
        'place',
        'retweet_count',
        'favorite_count',
        'user'
    ]
    
    def __init__(self):
        
        TOKEN = input('Twitter API token:')
        
        self.AUTH_HEADER = {'Authorization': f'Bearer {TOKEN}'}
        self.TWEETS_URL = 'https://api.twitter.com/1.1/search/tweets.json'

    @lru_cache(maxsize = None)
    def raw_search(self, **kwargs):
        res = requests.get(self.TWEETS_URL, params = kwargs, headers = self.AUTH_HEADER)
        if res.status_code == 200:
            return res.json()
        else:
            print('Warning: Status code', res.status_code, res.text)

    def search_page(self, q, escape = True, **kwargs):
        obj = self.raw_search(**{
            'q': quote(q) if escape else q,
            'lang': 'en',
            'tweet_mode': 'extended',
            'count': 100,
            **kwargs
        })
        if obj is not None:
            assert 'statuses' in obj
            assert 'search_metadata' in obj

            metadata = obj['search_metadata']

            tweet_df = pd.DataFrame([
                [status[field] for field in self.SEARCH_FIELDS]
                for status in obj['statuses']
            ], columns = self.SEARCH_FIELDS)
            tweet_df['url'] = 'https://twitter.com/user/status/' + tweet_df.id.astype(str)
            tweet_df['result_type'] = tweet_df.metadata.apply(lambda x: x['result_type'])
            tweet_df['hashtags'] = tweet_df.entities.apply(lambda x: x['hashtags'])
            tweet_df['user_name'] = tweet_df.user.apply(lambda x: x['name'])
            tweet_df['user_screen_name'] = tweet_df.user.apply(lambda x: x['screen_name'])
            tweet_df['user_id'] = tweet_df.user.apply(lambda x: x['id'])
            tweet_df['user_url'] = 'https://twitter.com/' + tweet_df.user_screen_name
            tweet_df['user_statuses_count'] = tweet_df.user.apply(lambda x: x['statuses_count'])
            tweet_df['user_followers_count'] = tweet_df.user.apply(lambda x: x['followers_count'])
            tweet_df['user_description'] = tweet_df.user.apply(lambda x: x['description'])
            tweet_df['user_location'] = tweet_df.user.apply(lambda x: x['location'])
            tweet_df['user_geo_enabled'] = tweet_df.user.apply(lambda x: x['geo_enabled'])
            tweet_df['user_created_at'] = tweet_df.user.apply(lambda x: x['created_at'])

            tweet_df['query_used'] = metadata['refresh_url'].lstrip('?')

            tweet_df['q'] = q


            n_results = tweet_df.shape[0]

            if 'next_results' in metadata:
                next_qs = metadata['next_results'].lstrip('?')
                next_qs_parsed = parse_qs(next_qs)
                next_result_params = {k: next_qs_parsed[k][0] for k in next_qs_parsed}
                continuation = lambda: self.search_page(**{
                    k: next_result_params[k] for k in next_result_params
                }, escape = False)
            else:
                continuation = None

            return tweet_df.drop(columns = ['metadata', 'entities', 'user']), continuation

    def search_gen(self, q, show_pbar = True, pages = 1, **kwargs):
        c = lambda: self.search_page(q, **kwargs)
        for i in tqdm(range(pages)) if show_pbar else range(pages):
            if c is not None:
                df, c = c()
                yield df

    def search(self, q, show_pbar = True, pages = 1, **kwargs):
        return pd.concat([
            df
            for df in self.search_gen(q, show_pbar = show_pbar, pages = pages, **kwargs)
        ], sort = False)