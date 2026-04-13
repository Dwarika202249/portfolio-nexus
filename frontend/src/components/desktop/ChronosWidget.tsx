'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export function ChronosWidget({ onClose }: { onClose: () => void }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  // Calendar logic
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const currentDay = now.getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
      // Prevent clicks inside from closing the widget
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-14 right-4 w-80 bg-[#0A1628]/95 backdrop-blur-2xl border border-[#1A2E4A] rounded-xl shadow-2xl overflow-hidden shadow-[var(--nexus-accent)]/10 flex flex-col"
    >
      {/* Header / Status Bar */}
      <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[var(--nexus-accent)] rounded-full animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--nexus-text-muted)] uppercase">NEURAL_CHRONOS_V1</span>
        </div>
        <span className="text-[9px] text-[var(--nexus-accent)] font-mono uppercase tracking-tighter">Sync: Nominal</span>
      </div>

      <div className="p-6 space-y-8">
        {/* Futuristic Orbital Clock */}
        <div className="flex justify-center relative py-4">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Hour Ring (Inner) */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="80" cy="80" r="45"
                fill="transparent"
                stroke="var(--nexus-accent)"
                strokeWidth="2"
                strokeDasharray={`${(hours % 12 / 12) * 283} 283`}
                className="opacity-20 translate-x-[-12px] translate-y-[-10px]"
              />
              <motion.circle
                cx="80" cy="80" r="50"
                fill="transparent"
                stroke="var(--nexus-accent)"
                strokeWidth="4"
                strokeDasharray="1 30"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="opacity-10 translate-x-[-15px] translate-y-[-10px]"
              />
            </svg>

            {/* Minute Ring (Middle) */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
               <motion.circle
                cx="80" cy="80" r="65"
                fill="transparent"
                stroke="var(--nexus-accent)"
                strokeWidth="1"
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="opacity-5 translate-x-[-22px] translate-y-[-10px]"
              />
            </svg>

            {/* Digital Readout */}
            <div className="text-center space-y-0 relative z-10">
              <div className="text-3xl font-bold tracking-tighter tabular-nums text-white">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
              <div className="text-[var(--nexus-accent)] text-[10px] font-mono tracking-widest uppercase mt-[-4px]">
                Sec: {seconds.toString().padStart(2, '0')}
              </div>
            </div>

            {/* Glitchy pulses */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,var(--nexus-accent)_0%,transparent_70%)] opacity-5 animate-pulse" />
          </div>
        </div>

        {/* Neural Calendar Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-white/50">
            <span>{now.toLocaleDateString([], { month: 'long', year: 'numeric' })}</span>
            <div className="flex gap-2">
              <span className="w-1 h-1 bg-[var(--nexus-accent)]" />
              <span className="w-1 h-1 bg-white/20" />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-[9px] font-mono text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <span key={d} className="text-white/20 mb-2">{d}</span>
            ))}
            {blanks.map(i => <div key={`b-${i}`} />)}
            {days.map(d => (
              <div
                key={d}
                className={cn(
                  "h-7 flex items-center justify-center rounded transition-all",
                  d === currentDay 
                    ? "bg-[var(--nexus-accent)] text-[#050A14] font-bold shadow-[0_0_10px_rgba(0,212,255,0.4)]"
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                )}
              >
                {d.toString().padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Acquisition Text */}
      <div className="p-3 bg-white/20 border-t border-white/5 flex items-center justify-between px-4">
        <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 truncate">Target_Acquisition_Mode: ACTIVE</span>
        <div className="flex gap-1">
          <div className="w-1 h-3 bg-[var(--nexus-accent)]/40" />
          <div className="w-1 h-3 bg-[var(--nexus-accent)]" />
        </div>
      </div>
    </motion.div>
  );
}
