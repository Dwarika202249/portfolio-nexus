'use client';

import React from 'react';
import { useWindowManager, AppId } from '@/context/WindowContext';
import { motion } from 'framer-motion';

const DESKTOP_ITEMS: { id: AppId; title: string; icon: string }[] = [
  { id: 'bio', title: 'Identity.bio', icon: '👤' },
  { id: 'projects', title: 'Archives', icon: '📁' },
  { id: 'terminal', title: 'Terminal', icon: '⌨️' },
  { id: 'ai-chat', title: 'Concierge.AI', icon: '🧠' },
];

export function DesktopGrid() {
  return (
    <div className="absolute inset-0 p-8 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-4 select-none">
      {DESKTOP_ITEMS.map((item, index) => (
        <DesktopIcon 
          key={item.id} 
          {...item} 
          index={index}
        />
      ))}
    </div>
  );
}

function DesktopIcon({ id, title, icon, index }: { id: AppId; title: string; icon: string; index: number }) {
  const { openWindow } = useWindowManager();

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.5 }}
      onDoubleClick={() => openWindow(id, title)}
      className="w-20 flex flex-col items-center gap-1 group p-2 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors"
    >
      <div className="relative w-12 h-12 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[var(--nexus-accent)]/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10 w-full h-full bg-[#1A2E4A]/30 border border-[#1A2E4A] rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:border-[var(--nexus-accent)]/50 transition-colors">
          {icon}
        </div>
      </div>
      <span className="text-[10px] font-mono text-center text-[var(--nexus-text)] leading-tight tracking-tighter drop-shadow-lg group-hover:text-[var(--nexus-accent)] transition-colors">
        {title}
      </span>
    </motion.button>
  );
}
