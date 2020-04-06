from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from service.tweet_scraper import TweetScraper
from service.formality import score_user
import pandas as pd

twitter_search = TweetScraper().search

name_data = pd.read_csv('data/name_data.csv', keep_default_na = False)
name_words = set(name_data[name_data.is_name]['word'])
non_name_words = set(name_data[~name_data.is_name]['word'])

# Cors

config = {
  'ORIGINS': [
    'http://localhost:3000',  # React
    'http://127.0.0.1:3000',  # React
    '*'                       # React dev
  ],
}

with open('service/sample.json', 'r') as f:
    sample_response = json.load(f)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": config['ORIGINS']}})

print("Starting API...")

@app.route("/search", methods = ["POST"])
def root():
    print("Processing POST request")
    request_json = request.get_json()
    print("Request JSON:", str(request_json))

    search_text = request_json.get('free', '')
    filters = request.json.get('filters', {})

    kwargs = {}
    for key in [
        'geocode',  # e.g. 37.781157,-122.398720,1mi
        'pages' # e.g. 5
    ]:
        if key in request_json:
            kwargs[key] = request_json[key]
    # if filters.get('popular'):
    #     kwargs['result_type'] = 'popular'

    res = twitter_search(search_text, **kwargs)
    res_list = list(res.T.to_dict().values())

    for obj in res_list:
        user_name = obj.get('user_name', '')
        user_description = obj.get('user_description', '')
        user_created_at = obj.get('user_created_at', '')

        uid_words = set(user_name.lower().split())
        titles = {w.replace('.', '') for w in uid_words} & {'dr', 'mr', 'ms', 'mrs', 'phd'}

        score = score_user(user_name, user_description, user_created_at)
        is_org =  (
            (score > 0.6)
            and (len(uid_words & non_name_words) > 0)
            and (len(uid_words & name_words) == 0)
            and not any(len(word) == 1 for word in uid_words)
            and (len(titles) == 0)
        )

        obj['user_score'] = score
        obj['user_type'] = 'org' if is_org else 'person'

    if filters.get('account') == 'personal':
        res_list = [x for x in res_list if x['user_type'] == 'person']
    if filters.get('account') == 'organizational':
        res_list = [x for x in res_list if x['user_type'] == 'org']
    if filters.get('topic') == 'casual':
        res_list = [x for x in res_list if x['user_score'] < 0.5]
    if filters.get('topic') == 'formal':
        res_list = [x for x in res_list if x['user_score'] > 0.5]

    return jsonify({
        'results': res_list
    })


@app.route("/test")
def test():
    return "Hello world!"
