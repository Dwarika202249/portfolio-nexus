'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { useWindowManager, AppId } from '@/context/WindowContext';
import { useMobile } from '@/hooks/useMobile';

interface WindowFrameProps {
  id: AppId;
  title: string;
  zIndex: number;
  isFocused: boolean;
  children: React.ReactNode;
}

export const WindowFrame = React.forwardRef<HTMLDivElement, WindowFrameProps>(
  ({ id, title, children, zIndex, isFocused }, ref) => {
    const { closeWindow, minimizeWindow, focusWindow } = useWindowManager();
    const isMobile = useMobile();

    const mobileStyles = isMobile ? {
      width: '100vw',
      height: 'calc(100vh - 48px)', // Adjust for taskbar
      top: 0,
      left: 0,
      margin: 0,
      borderRadius: 0,
    } : {};

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        style={{ zIndex, ...mobileStyles }}
        onClick={() => focusWindow(id)}
        className={cn(
          "absolute inset-0 m-auto w-[80%] h-[80%] bg-[#0A1628]/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col",
          isFocused ? "ring-1 ring-[var(--nexus-accent)] shadow-[0_0_30px_rgba(0,212,255,0.15)]" : "opacity-90",
          isMobile && "border-none shadow-none ring-0"
        )}
      >
        {/* Title Bar */}
        <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 cursor-default select-none">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isFocused ? "bg-[var(--nexus-accent)]" : "bg-white/20")} />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--nexus-text-muted)]">{title}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} className="hover:text-white transition-colors">
              <span className="text-lg leading-none opacity-50 hover:opacity-100">−</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }} className="hover:text-red-400 transition-colors">
              <span className="text-lg leading-none opacity-50 hover:opacity-100">×</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {children}
          
          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] z-50" />
        </div>

        {/* Status Bar */}
        <div className="h-6 px-3 flex items-center justify-between bg-white/5 border-t border-white/5 text-[9px] font-mono text-[var(--nexus-text-muted)]">
            <span>STATUS: NOMINAL</span>
            <div className="flex items-center gap-4">
                <span>LNG: TS/JSX</span>
                <span>LATENCY: 4MS</span>
            </div>
        </div>
      </motion.div>
    );
  }
);

WindowFrame.displayName = 'WindowFrame';
