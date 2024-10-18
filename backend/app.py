from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

API_KEY = os.environ.get("GEMINI_API_KEY")  # Get API key from environment variable

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        text = data.get('message', '')

        if not text:
            return jsonify({'error': 'No message provided'}), 400

        headers = {
            'Content-Type': 'application/json'
        }
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": f"As an AI therapist, respond to the following user input: {text}\n\n"
                                    "Provide a compassionate and supportive response."
                        }
                    ]
                }
            ]
        }

        response = requests.post(
            f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}',
            headers=headers,
            json=payload
        )

        if response.status_code == 200:
            result = response.json()
            print("Gemini Model Output:", result)  # Print the raw Gemini output to console

            # Parsing the model output
            if 'candidates' in result:
                model_output = result['candidates'][0]['content']['parts'][0]['text']
                return jsonify({'response': model_output})
            else:
                return jsonify({'error': 'Unexpected response structure'}), 500
        else:
            return jsonify({'error': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)