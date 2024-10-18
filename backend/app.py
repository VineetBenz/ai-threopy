from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_KEY = 'AIzaSyDziEiGEEHrNnwdbh9db9veEH-aBQfjj-g'  # Your API key

@app.route('/')
def home():
    return 'Welcome to the AI Therapy API!'

@app.route('/api/chat', methods=['POST'])
def chat():
    print("Chat endpoint hit")  # Check if the endpoint is reached
    try:
        data = request.json
        print(f"Request data: {data}")  # Print incoming request data

        text = data.get('message', '')
        if not text:
            print("No message provided")  # Log missing message
            return jsonify({'error': 'No message provided'}), 400

        headers = {'Content-Type': 'application/json'}
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
        
        print(f"Sending payload to Gemini API: {payload}")  # Log the payload
        response = requests.post(
            f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}',
            headers=headers,
            json=payload
        )
        
        print(f"Gemini API Response status code: {response.status_code}")  # Log status code
        print(f"Gemini API Response content: {response.text}")  # Print the entire response content

        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result:
                model_output = result['candidates'][0]['content']['parts'][0]['text']
                return jsonify({'response': model_output})
            else:
                print("Unexpected response structure")  # Log unexpected structure
                return jsonify({'error': 'Unexpected response structure'}), 500
        else:
            print(f"Error from API: {response.text}")  # Log API error
            return jsonify({'error': response.text}), response.status_code

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log any exceptions
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
