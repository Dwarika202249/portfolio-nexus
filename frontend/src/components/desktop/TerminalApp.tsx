'use client';

import React, { useState, useEffect, useRef } from 'react';

export function TerminalApp() {
  const [lines, setLines] = useState<string[]>([
    'NEXUS OS [Version 1.0.0.42]',
    '(c) Dwarika Systems. All rights reserved.',
    '',
    'Type "help" to see available commands.',
    ''
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newLines = [...lines, `> ${input}`];
    const cmd = input.toLowerCase().trim();

    if (cmd === 'help') {
      newLines.push('Available commands:', '  about      - Display system author info', '  clear      - Clear terminal', '  contact    - Reveal neural links', '  ls         - List files');
    } else if (cmd === 'clear') {
      setLines([]);
      setInput('');
      return;
    } else if (cmd === 'about') {
      newLines.push('Dwarika Kumar: Elite Full-Stack Architect specialized in GenAI & Immersive Web.');
    } else {
      newLines.push(`Command not found: ${cmd}`);
    }

    setLines(newLines);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-black/40 p-4 font-mono text-[13px] text-[var(--nexus-success)]">
      <div className="flex-1 overflow-auto space-y-1">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="mt-2 flex gap-2">
        <span className="text-[var(--nexus-accent)]">$</span>
        <input
          title='terminal'
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-[var(--nexus-success)]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </form>
    </div>
  );
}
