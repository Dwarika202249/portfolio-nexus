'use client';

import React, { useEffect, useRef } from 'react';
import { useBootSequence } from '@/hooks/useBootSequence';
import { CRTOverlay } from './CRTOverlay';
import { TerminalLines } from './TerminalLines';
import { BootProgressBar } from './BootProgressBar';
import { gsap } from 'gsap';

export function BootSequence() {
  const { phase, progress, skip } = useBootSequence();
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Explosive implosion transition when complete
    if (phase === 'COMPLETE') {
      const tl = gsap.timeline();
      tl.to(screenRef.current, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power2.in'
      })
      .to(screenRef.current, {
        scale: 1.1,
        opacity: 0,
        filter: 'brightness(5) blur(10px)',
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, [phase]);

  useEffect(() => {
    const handleKeyPress = () => {
      skip();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleKeyPress);
    };
  }, [skip]);

  if (phase === 'SKIPPED') return null;

  return (
    <div 
      ref={screenRef}
      className="fixed inset-0 bg-[#050A14] flex flex-col items-center justify-center overflow-hidden z-[999]"
      style={{ visibility: phase === 'COMPLETE' ? 'hidden' : 'visible' }}
    >
      {/* Background scanlines and noise */}
      <CRTOverlay phase={phase} />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col">
        <TerminalLines phase={phase} />
        <BootProgressBar />
      </div>

      {/* Skip Hint */}
      <div className="absolute bottom-8 right-8 text-[var(--nexus-text-muted)] font-mono text-[10px] animate-pulse">
        [ PRESS ANY KEY TO SKIP_ ]
      </div>

      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-4 h-[1px] bg-[var(--nexus-accent)] opacity-30" />
      <div className="absolute top-4 left-4 h-4 w-[1px] bg-[var(--nexus-accent)] opacity-30" />
      <div className="absolute top-4 right-4 w-4 h-[1px] bg-[var(--nexus-accent)] opacity-30" />
      <div className="absolute top-4 right-4 h-4 w-[1px] bg-[var(--nexus-accent)] opacity-30" />
      <div className="absolute bottom-4 left-4 w-4 h-[1px] bg-[var(--nexus-accent)] opacity-30" />
      <div className="absolute bottom-4 left-4 h-4 w-[1px] bg-[var(--nexus-accent)] opacity-30" />
      <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-[var(--nexus-accent)] opacity-30" />
      <div className="absolute bottom-4 right-4 h-4 w-[1px] bg-[var(--nexus-accent)] opacity-30" />
    </div>
  );
}
