from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from google.generativeai import GenerativeModel, configure

app = Flask(__name__)
CORS(app)

# Configure the Gemini API
configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = GenerativeModel("gemini-pro")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '')
    
    prompt = f"Respond as a therapist to the following user input: {user_input}"
    response = model.generate_content(prompt)
    
    return jsonify({"response": response.text})

if __name__ == '__main__':
    app.run(debug=True)