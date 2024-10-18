import React, { useState, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

function ChatComponent() {
  const [inputText, setInputText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setSpeechRecognition(recognition);
    } else {
      console.warn('Speech Recognition not supported in this browser.');
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputText) return;

    setIsLoading(true);
    setAiResponse('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('AI API response:', data);

      if (data.response) {
        setAiResponse(data.response);
      } else if (data.error) {
        setAiResponse(`Error: ${data.error}`);
      } else {
        setAiResponse("No valid response from AI API.");
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      setAiResponse("I'm sorry, I couldn't generate a response at this time. Please try again.");
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  const handleButtonClick = () => {
    if (isListening) {
      stopListening();
      handleSendMessage();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (speechRecognition) {
      speechRecognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (speechRecognition) {
      speechRecognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="space-y-4">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message here..."
          className="w-full p-3 text-lg border rounded resize-none h-40 overflow-y-auto"
        />
        <div className="flex space-x-2">
          <Button
            onClick={handleButtonClick}
            className={`flex-1 py-3 text-lg ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            disabled={isLoading}
          >
            {isListening ? (
              <>
                <Mic className="mr-2" size={24} /> Stop Listening
              </>
            ) : (
              <>
                <Send className="mr-2" size={24} /> {inputText ? 'Send' : 'Start Listening'}
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <p className="text-gray-800 text-lg">
          {isLoading ? "Generating response..." : (aiResponse || "AI response will appear here...")}
        </p>
      </div>
    </div>
  );
}

export default ChatComponent;