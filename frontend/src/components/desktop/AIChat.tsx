'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { useNeuralCore } from '@/context/NeuralContext';

const SUGGESTIONS = [
  "Why should I hire Dwarika?",
  "Tell me about CodeWeavers RBAC.",
  "Tell me your skills and projects that you have made",
  "what did you worked in your previous company?",
  "Professional achievements?",
  "Contact coordinates?"
];

export function AIChat() {
  const { messages, addMessage } = useNeuralCore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault();
    const userMessage = overrideInput || input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    addMessage({ role: 'user', content: userMessage });
    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();

      if (data.answer) {
        addMessage({ role: 'assistant', content: data.answer });
      } else {
        addMessage({ role: 'assistant', content: "ERROR: Signal lost. Could not retrieve archive data." });
      }
    } catch (error) {
      addMessage({ role: 'assistant', content: "CRITICAL_ERROR: Backend neural engine unreachable." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050A14] font-mono text-[12px] relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,212,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Header Info */}
      <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--nexus-accent)] animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--nexus-accent)] font-bold">NEXUS Core // PROXY_V1.0</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[8px] text-white/20 uppercase tracking-widest">Neural Link: ACTIVE</span>
          <span className="text-[8px] text-white/20 uppercase tracking-widest">LATENCY: 4MS</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-6 no-scrollbar z-10">
        {messages?.map((m, i) => (
          <div key={i} className={cn(
            "flex flex-col gap-2 max-w-[85%]",
            m.role === 'user' ? "ml-auto items-end" : "items-start"
          )}>
            <span className="text-[8px] uppercase tracking-tighter text-white/30 font-bold">
              {m.role === 'user' ? 'LOCAL_INTERROGATOR' : 'NEXUS_CORE'}
            </span>
            <div className={cn(
              "p-4 rounded-xl leading-relaxed text-[11px] transition-all duration-300",
              m.role === 'user'
                ? "bg-[var(--nexus-accent)] text-[#050A14] rounded-tr-none font-bold shadow-[0_4px_15px_rgba(0,212,255,0.1)]"
                : "bg-white/5 border border-white/10 text-[var(--nexus-text)] rounded-tl-none whitespace-pre-wrap backdrop-blur-sm"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col gap-2 items-start">
            <span className="text-[8px] uppercase tracking-tighter text-white/30">NEXUS_CORE</span>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl rounded-tl-none">
              <div className="flex gap-1.5 items-center">
                <span className="text-[9px] text-[var(--nexus-accent)] animate-pulse">DECRYPTING ARCHIVES</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-[var(--nexus-accent)] animate-bounce" />
                  <div className="w-1 h-1 bg-[var(--nexus-accent)] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-[var(--nexus-accent)] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Footer Area with Suggestions and Input */}
      <div className="mt-auto p-4 space-y-4 border-t border-white/5 bg-white/[0.02] z-10 backdrop-blur-md">
        {/* Chips / Suggestions */}
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSubmit(undefined, s)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] text-[var(--nexus-text-muted)] hover:border-[var(--nexus-accent)] hover:text-[var(--nexus-accent)] hover:bg-[var(--nexus-accent)]/5 transition-all uppercase tracking-tighter"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSubmit} className="relative group">
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg overflow-hidden px-4 ring-1 ring-white/5 group-focus-within:ring-[var(--nexus-accent)]/50 group-focus-within:border-[var(--nexus-accent)]/30 transition-all duration-300">
            <span className="text-[10px] text-[var(--nexus-accent)] font-bold animate-pulse">»</span>
            <input
              autoFocus
              className="flex-1 bg-transparent border-none outline-none py-4 text-[11px] text-[var(--nexus-text)] placeholder:text-white/10 font-mono tracking-wide"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Interrogate neural knowledge base..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "text-[9px] font-bold uppercase tracking-widest transition-all px-3 py-1 rounded",
                input.trim() ? "text-[var(--nexus-accent)] opacity-100" : "text-white/10 opacity-50"
              )}
            >
              EXEC_STMT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
