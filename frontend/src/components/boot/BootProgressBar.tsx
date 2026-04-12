'use client';

import React from 'react';
import { useBoot } from '@/context/BootContext';

export function BootProgressBar() {
  const { progress, phase } = useBoot();
  const isVisible = phase === 'LOADING' || phase === 'IDENTITY' || phase === 'MOUNTING';
  
  if (!isVisible) return null;

  // Render a block-style terminal progress bar
  const totalBlocks = 20;
  const activeBlocks = Math.floor((progress / 100) * totalBlocks);
  const bar = '█'.repeat(activeBlocks) + '░'.repeat(totalBlocks - activeBlocks);

  return (
    <div className="mt-8 px-8 font-mono text-[14px]">
      <div className="flex items-center gap-4 text-[var(--nexus-success)]">
        <span>[{bar}]</span>
        <span className="min-w-[4ch]">{progress}%</span>
      </div>
      <div className="text-[var(--nexus-text-muted)] mt-1 text-[12px]">
        {progress < 100 ? 'SYS.LOAD_ASSETS...' : 'SYSTEM READY'}
      </div>
    </div>
  );
}
