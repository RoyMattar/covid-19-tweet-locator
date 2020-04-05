from flask import Flask, request, jsonify
import json

with open('service/sample.json', 'r') as f:
    sample_response = json.load(f)

app = Flask(__name__)

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
