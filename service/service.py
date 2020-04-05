from flask import Flask, request

app = Flask(__name__)

print("Starting API...")

@app.route("/", methods = ["POST"])
def root():
    print("Processing POST request")
    request_json = request.get_json()
    print("Request JSON:", str(request_json))


@app.route("/test")
def test():
    return "Hello world!"
