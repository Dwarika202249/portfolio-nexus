'use client';

import React, { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { useWindowManager, AppId } from '@/context/WindowContext';

interface WindowFrameProps {
  id: AppId;
  title: string;
  zIndex: number;
  isFocused: boolean;
  children: React.ReactNode;
}

export function WindowFrame({ id, title, zIndex, isFocused, children }: WindowFrameProps) {
  const { closeWindow, minimizeWindow, focusWindow } = useWindowManager();
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onPointerDown={() => focusWindow(id)}
      style={{ zIndex }}
      className={cn(
        "absolute top-20 left-40 w-[800px] h-[500px] bg-[#0A1628]/90 backdrop-blur-xl border rounded-lg shadow-2xl flex flex-col overflow-hidden",
        isFocused ? "border-[#1A2E4A] shadow-[var(--nexus-accent)]/10" : "border-white/5 opacity-80"
      )}
    >
      {/* Title Bar */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="h-9 px-4 flex items-center justify-between bg-white/5 border-b border-white/5 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <button
              title='close'
              onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
              className="w-3 h-3 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors"
            />
            <button
              title='minimize'
              onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
              className="w-3 h-3 rounded-full bg-yellow-500/50 hover:bg-yellow-500 transition-colors"
            />
            <button title='maximize' className="w-3 h-3 rounded-full bg-green-500/50 hover:bg-green-500 transition-colors" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--nexus-text-muted)] uppercase">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-white/20">
          <span>{id.toUpperCase()}</span>
          <div className="w-1 h-3 bg-white/10" />
          <span>V1.0</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-[var(--nexus-bg)]/50 relative">
        {children}

        {/* CRT Overlay inside window (optional, for vibes) */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_2px,2px_100%]" />
      </div>

      {/* Footer / Status Bar */}
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
