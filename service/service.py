from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from service.tweet_scraper import TweetScraper
from service.formality import score_user

twitter_search = TweetScraper().search

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

    keyword = request_json.get('q', '')
    geocode = request_json.get('geocode') # e.g. 37.781157,-122.398720,1mi

    res = twitter_search(keyword) if geocode is None else twitter_search(keyword, geocode = geocode)
    res_list = list(res.T.to_dict().values())

    for obj in res_list:
        obj['user_score'] = score_user(
            obj.get('user_name', ''),
            obj.get('user_description', ''),
            obj.get('user_created_at', '')
        )

    return jsonify({
        'results': res_list
    })


@app.route("/test")
def test():
    return "Hello world!"
