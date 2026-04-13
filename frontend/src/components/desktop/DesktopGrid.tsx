'use client';

import React, { useState, useEffect } from 'react';
import { useWindowManager, AppId } from '@/context/WindowContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const DESKTOP_ITEMS: { id: AppId; title: string; icon: string }[] = [
  { id: 'bio', title: 'Identity.bio', icon: '👤' },
  { id: 'projects', title: 'Archives', icon: '📁' },
  { id: 'terminal', title: 'Terminal', icon: '⌨️' },
  { id: 'ai-chat', title: 'Concierge.AI', icon: '🧠' },
  { id: 'socials', title: 'Neural.Links', icon: '🔗' },
  { id: 'settings', title: 'Settings', icon: '⚙️' },
];

export function DesktopGrid() {
  const { openWindow } = useWindowManager();
  const [selectedId, setSelectedId] = useState<AppId | null>(null);

  // Clear selection when clicking the desktop background
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="absolute inset-0 p-8 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-4 select-none"
    >
      {DESKTOP_ITEMS.map((item, index) => (
        <DesktopIcon
          key={item.id}
          {...item}
          index={index}
          isSelected={selectedId === item.id}
          onSelect={() => setSelectedId(item.id)}
          onOpen={() => {
            setSelectedId(item.id);
            openWindow(item.id, item.title);
          }}
        />
      ))}
    </div>
  );
}

interface DesktopIconProps {
  id: AppId;
  title: string;
  icon: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

function DesktopIcon({ id, title, icon, index, isSelected, onSelect, onOpen }: DesktopIconProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.5 }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      className={cn(
        "w-20 flex flex-col items-center gap-1 group p-2 rounded-lg transition-all border outline-none cursor-pointer pointer-events-auto",
        isSelected
          ? "bg-[var(--nexus-accent)]/20 border-[var(--nexus-accent)]/40 shadow-[0_0_15px_rgba(0,212,255,0.1)]"
          : "border-transparent hover:bg-white/5"
      )}
    >
      <div className="relative w-12 h-12 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
        {/* Selection/Hover Glow */}
        <div className={cn(
          "absolute inset-0 bg-[var(--nexus-accent)]/20 rounded-xl blur-lg transition-opacity",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} />

        <div className={cn(
          "relative z-10 w-full h-full bg-[#1A2E4A]/30 border rounded-xl flex items-center justify-center backdrop-blur-sm transition-all",
          isSelected ? "border-[var(--nexus-accent)] bg-[var(--nexus-accent)]/10" : "border-[#1A2E4A] group-hover:border-[var(--nexus-accent)]/50"
        )}>
          {icon}
        </div>
      </div>
      <span className={cn(
        "text-[10px] font-mono text-center leading-tight tracking-tighter drop-shadow-lg transition-colors",
        isSelected ? "text-[var(--nexus-accent)]" : "text-[var(--nexus-text)] group-hover:text-[var(--nexus-accent)]"
      )}>
        {title}
      </span>
    </motion.button>
  );
}
