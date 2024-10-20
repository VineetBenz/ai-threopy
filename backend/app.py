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
    print("Chat endpoint hit")  # Log that the endpoint is reached
    try:
        data = request.json
        print(f"Request data: {data}")  # Log incoming request data

        # Extract conversation history and new message from the request data
        conversation_history = data.get('conversation_history', '')  # Retrieve history
        new_message = data.get('message', '')  # Retrieve new message

        if not new_message:
            print("No message provided")  # Log missing message
            return jsonify({'error': 'No message provided'}), 400

        # Append the new user input to the existing conversation history
        conversation_history_text = f"{conversation_history}\nUser: {new_message}\n"

        # Payload for the Gemini API
        headers = {'Content-Type': 'application/json'}
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": f"Here is the ongoing conversation:\n\n"
                                    f"{conversation_history_text}\n\n"
                                    "As a therapist, please respond with compassion and guidance, considering what has been discussed."
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

        print(f"Gemini API Response status code: {response.status_code}")  # Log the status code
        print(f"Gemini API Response content: {response.text}")  # Log the response content

        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result:
                # Extract model response
                model_output = result['candidates'][0]['content']['parts'][0]['text']

                # Update conversation with the assistant's latest response
                updated_conversation = f"{conversation_history_text}\nAssistant: {model_output}\n"
                
                # Print the full conversation history in the terminal
                print(f"Full conversation history:\n{updated_conversation}")

                return jsonify({'response': model_output, 'updated_conversation': updated_conversation})
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
