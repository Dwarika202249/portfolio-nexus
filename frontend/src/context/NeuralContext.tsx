'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface NeuralContextType {
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearHistory: () => void;
}

const NeuralContext = createContext<NeuralContextType | undefined>(undefined);

export function NeuralProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'SYSTEM: Identity confirmed. Synchronizing neural knowledge base... Welcome. I am the NEXUS Core, Dwarika\'s Digital Proxy. How can I assist you in navigating the archives?' }
  ]);

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const clearHistory = () => {
    setMessages([{ role: 'assistant', content: 'Neural history purged. Re-initializing link...' }]);
  };

  return (
    <NeuralContext.Provider value={{ messages, addMessage, clearHistory }}>
      {children}
    </NeuralContext.Provider>
  );
}

export function useNeuralCore() {
  const context = useContext(NeuralContext);
  if (context === undefined) {
    throw new Error('useNeuralCore must be used within a NeuralProvider');
  }
  return context;
}
