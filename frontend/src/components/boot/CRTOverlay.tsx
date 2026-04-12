'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { BootPhase } from '@/context/BootContext';

interface CRTOverlayProps {
  phase: BootPhase;
}

export function CRTOverlay({ phase }: CRTOverlayProps) {
  const isScanning = phase === 'SCANNING';
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,4px_100%]" />
      
      {/* Moving scanline */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-[100px] bg-white/[0.03] -bottom-full animate-[scanline_8s_linear_infinite]" />
      </div>

      {/* Screen flicker (active during scanning) */}
      {isScanning && (
        <div className="absolute inset-0 bg-white/[0.01] flicker-overlay" />
      )}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_100%)]" />

      {/* Static / Noise (subtle) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
