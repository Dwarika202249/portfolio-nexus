'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'SYSTEM: Identity confirmed. Synchronizing neural knowledge base... Welcome. I am the NEXUS Concierge. How can I assist you in navigating the archives?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();
      
      if (data.answer) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "ERROR: Signal lost. Could not retrieve archive data." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "CRITICAL_ERROR: Backend neural engine unreachable." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050A14] font-mono text-[12px]">
      {/* Header Info */}
      <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--nexus-accent)] animate-pulse" />
          <span className="text-[9px] uppercase tracking-widest text-[var(--nexus-text-muted)]">Matrix // AI_CONCIERGE</span>
        </div>
        <span className="text-[9px] text-white/20">Llama-3.1 // 70B</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-6 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "flex flex-col gap-2 max-w-[85%]",
            m.role === 'user' ? "ml-auto items-end" : "items-start"
          )}>
            <span className="text-[8px] uppercase tracking-tighter text-white/40">
              {m.role === 'user' ? 'Local_User' : 'Nexus_Core'}
            </span>
            <div className={cn(
              "p-3 rounded-lg leading-relaxed",
              m.role === 'user' 
                ? "bg-[var(--nexus-accent)] text-[#050A14] rounded-tr-none font-bold" 
                : "bg-white/5 border border-white/10 text-[var(--nexus-text)] rounded-tl-none whitespace-pre-wrap"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col gap-2 items-start">
            <span className="text-[8px] uppercase tracking-tighter text-white/40">Nexus_Core</span>
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg rounded-tl-none">
              <div className="flex gap-1.5">
                <div className="w-1 h-1 bg-[var(--nexus-accent)] animate-bounce" />
                <div className="w-1 h-1 bg-[var(--nexus-accent)] animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-[var(--nexus-accent)] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-2 bg-[#0A1628] border border-white/10 rounded overflow-hidden px-3 ring-1 ring-[var(--nexus-accent)]/20 focus-within:ring-[var(--nexus-accent)]/50 transition-all">
          <span className="text-[10px] text-[var(--nexus-accent)] font-bold">»</span>
          <input 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none py-3 text-[var(--nexus-text)] placeholder:text-white/20"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Interrogate neural knowledge base..."
            disabled={isLoading}
          />
          {input.length > 0 && (
            <button type="submit" className="text-[var(--nexus-accent)] text-[10px] font-bold">SEND</button>
          )}
        </div>
      </form>
    </div>
  );
}
