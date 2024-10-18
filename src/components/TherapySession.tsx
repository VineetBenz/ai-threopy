import React, { useState } from 'react';

function ChatComponent() {
  const [inputText, setInputText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    setIsLoading(true);
    setAiResponse(''); // Clear previous response

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
      console.log('AI API response:', data);  // Debugging line to inspect the response

      if (data.response) {
        setAiResponse(data.response);  // Set the AI response
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
    }
  };

  return (
    <div>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your message here..."
        rows={4}
        className="p-2 border rounded w-full"
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
      <p className="text-gray-800 mt-4">
        {isLoading ? "Generating response..." : (aiResponse || "AI response will appear here...")}
      </p> 
    </div>
  );
}

export default ChatComponent;
 