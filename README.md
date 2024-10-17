# AI Therapy Session

This project consists of a React frontend and a Python Flask backend for an AI-powered therapy session application.

## Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required Python packages:
   ```
   pip install flask flask-cors google-generativeai
   ```

5. Set up your Gemini API key:
   - Create a `.env` file in the `backend` directory
   - Add your API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

6. Run the Flask server:
   ```
   python app.py
   ```

The backend will be available at `http://localhost:5000`.

## Usage

With both the frontend and backend running, you can now use the AI Therapy Session application. The frontend will communicate with the backend to process user input and generate AI responses.