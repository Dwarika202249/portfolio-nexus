'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { BootPhase } from '@/context/BootContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

const BOOT_LOG_MESSAGES = [
  { text: 'NEXUS OS v1.0.0 — Quantum Interface Layer', color: 'var(--nexus-accent)', delay: 0 },
  { text: 'Copyright © 2026 Dwarika Kumar. All rights reserved.', color: 'var(--nexus-text-muted)', delay: 0.2 },
  { text: '', color: '', delay: 0.1 },
  { text: 'Initializing cognitive architecture...', color: 'var(--nexus-text)', delay: 0.3 },
  { text: 'Loading React.js module................ [OK]', color: 'var(--nexus-success)', delay: 0.4 },
  { text: 'Loading GenAI engine................... [OK]', color: 'var(--nexus-success)', delay: 0.3 },
  { text: 'Loading Node.js runtime................ [OK]', color: 'var(--nexus-success)', delay: 0.2 },
  { text: 'Loading AI Knowledge Base.............. [OK]', color: 'var(--nexus-success)', delay: 0.4 },
  { text: 'Mounting cloud infrastructure.......... [OK]', color: 'var(--nexus-success)', delay: 0.5 },
  { text: '', color: '', delay: 0.2 },
  { text: 'Identity verified: DWARIKA KUMAR', color: 'var(--nexus-accent)', delay: 0.5 },
  { text: 'Role: Elite Full-Stack Architect', color: 'var(--nexus-text)', delay: 0.3 },
  { text: 'Status: AVAILABLE FOR HIRE', color: 'var(--nexus-accent-2)', delay: 0.4 },
  { text: '', color: '', delay: 0.2 },
  { text: 'All systems nominal. Launching NEXUS...', color: 'var(--nexus-success)', delay: 0.6 },
];

export function TerminalLines({ phase }: { phase: BootPhase }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (phase === 'LOADING' || phase === 'IDENTITY') {
      const tl = gsap.timeline();
      timelineRef.current = tl;

      BOOT_LOG_MESSAGES.forEach((msg, index) => {
        if (!msg.text) {
          tl.to({}, { duration: 0.1, onStart: () => setVisibleLines(index + 1) });
          return;
        }

        tl.to(`.boot-line-${index}`, {
          duration: msg.text.length * 0.015,
          text: msg.text,
          ease: 'none',
          onStart: () => setVisibleLines(index + 1),
          delay: msg.delay
        });
      });
    }

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [phase]);

  return (
    <div ref={containerRef} className="font-mono text-[14px] leading-relaxed max-w-2xl px-8">
      {BOOT_LOG_MESSAGES.map((msg, i) => (
        <div 
          key={i} 
          className={i < visibleLines ? 'block' : 'hidden'}
          style={{ color: msg.color || 'inherit', minHeight: '1.5em' }}
        >
          <span className={`boot-line-${i}`}></span>
          {i === visibleLines - 1 && phase !== 'COMPLETE' && (
            <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse align-middle" />
          )}
        </div>
      ))}
    </div>
  );
}
