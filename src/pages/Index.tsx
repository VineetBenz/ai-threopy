import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Mic, User } from "lucide-react";
import TherapySession from '@/components/TherapySession';

const Index = () => {
  const [sessionStarted, setSessionStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">AI Therapy Session</h1>
      {!sessionStarted ? (
        <div className="text-center">
          <p className="text-xl mb-6 text-gray-700">Welcome to your AI-powered therapy session. Click below to begin.</p>
          <Button onClick={() => setSessionStarted(true)} className="bg-purple-600 hover:bg-purple-700">
            Start Session
          </Button>
        </div>
      ) : (
        <TherapySession />
      )}
    </div>
  );
};

export default Index;