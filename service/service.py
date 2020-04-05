from flask import Flask, request, jsonify
from flask_cors import CORS
import json

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
CORS(app, resources={r"/*": {"origins": config['ORIGINS']}}, , supports_credentials=True)

print("Starting API...")

@app.route("/search", methods = ["POST"])
def root():
    print("Processing POST request")
    request_json = request.get_json()
    print("Request JSON:", str(request_json))
    return jsonify(sample_response)


@app.route("/test")
def test():
    return "Hello world!"
