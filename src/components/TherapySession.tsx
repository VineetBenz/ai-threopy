import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Mic, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TherapySession = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: "Error",
          description: "There was an error with speech recognition. Please try again.",
          variant: "destructive",
        });
      };
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    setTranscript('');
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.start();
    }
  };

  const stopListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.stop();
      // Here you would typically send the transcript to the Gemini API
      // and get a response. For now, we'll simulate it:
      simulateAIResponse();
    }
  };

  const simulateAIResponse = () => {
    // This is where you'd integrate with the Gemini API
    // For now, we'll just set a mock response
    setAiResponse("I understand you're feeling that way. Let's explore those thoughts further...");
    speakAIResponse("I understand you're feeling that way. Let's explore those thoughts further...");
  };

  const speakAIResponse = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center mb-6">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarFallback><Bot /></AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">AI Therapist</h2>
          <p className="text-sm text-gray-600">Here to listen and help</p>
        </div>
      </div>
      
      <div className="mb-6 bg-gray-100 p-4 rounded-lg min-h-[100px]">
        <p className="text-gray-800">{transcript || "Your speech will appear here..."}</p>
      </div>
      
      <div className="mb-6 bg-blue-100 p-4 rounded-lg min-h-[100px]">
        <p className="text-gray-800">{aiResponse || "AI response will appear here..."}</p>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={toggleListening} 
          className={`flex items-center ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          <Mic className="mr-2" />
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>
      </div>
    </div>
  );
};

export default TherapySession;