'use client';

import React, { useState } from 'react';
import { useWindowManager, AppId } from '@/context/WindowContext';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export function Taskbar() {
  const { windows, activeWindowId, focusWindow, closeWindow } = useWindowManager();
  const [isStartOpen, setIsStartOpen] = useState(false);

  const activeWindows = Object.values(windows).filter(w => w.isOpen);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000]">
      {/* Start Menu Overlay */}
      <AnimatePresence>
        {isStartOpen && (
          <>
            {/* Global backdrop to close menu - explicitly set to cover viewport */}
            <div 
              className="fixed inset-0 bg-transparent cursor-default" 
              onClick={() => setIsStartOpen(false)} 
            />
            <StartMenu onClose={() => setIsStartOpen(false)} />
          </>
        )}
      </AnimatePresence>

      {/* Taskbar Bar */}
      <div className="h-12 bg-[#0A1628]/80 backdrop-blur-md border-t border-[#1A2E4A] flex items-center px-4 gap-2 relative z-10">
        {/* Start Button */}
        <button
          onClick={() => setIsStartOpen(!isStartOpen)}
          className={cn(
            "h-full px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors group",
            isStartOpen && "bg-white/10"
          )}
        >
          <div className="w-5 h-5 relative">
            <div className="absolute inset-0 bg-[var(--nexus-accent)] rounded-sm group-hover:rotate-45 transition-transform duration-500" />
            <div className="absolute inset-0 border border-white/20 rounded-sm" />
          </div>
          <span className="text-[12px] font-bold tracking-widest text-[var(--nexus-text)]">NEXUS</span>
        </button>

        <div className="w-[1px] h-6 bg-[#1A2E4A] mx-2" />

        {/* Active Windows */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {activeWindows.map(win => (
            <div
              key={win.id}
              className={cn(
                "group relative h-9 px-3 min-w-[120px] flex items-center gap-2 rounded transition-all text-left cursor-pointer",
                activeWindowId === win.id
                  ? "bg-[var(--nexus-accent)]/20 border-b-2 border-[var(--nexus-accent)]"
                  : "hover:bg-white/5 text-[var(--nexus-text-muted)]"
              )}
              onClick={() => focusWindow(win.id)}
            >
              <div className={cn(
                "w-2 h-2 rounded-full",
                activeWindowId === win.id ? "bg-[var(--nexus-accent)]" : "bg-[#1A2E4A]"
              )} />
              <span className="text-[11px] truncate font-medium uppercase tracking-tighter flex-1">
                {win.title}
              </span>

              {/* Quick Close Button */}
              <button
                title='Close'
                onClick={(e) => {
                  e.stopPropagation();
                  closeWindow(win.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-sm transition-opacity"
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Sys Tray */}
        <div className="flex items-center gap-4 px-4 text-[11px] font-mono text-[var(--nexus-text-muted)]">
          <div className="flex flex-col items-end">
            <span className="text-[var(--nexus-text)]">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[9px] uppercase tracking-tighter">{new Date().toLocaleDateString([], { month: 'short', day: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useWindowManager();

  const handleLaunch = (id: AppId, title: string) => {
    openWindow(id, title);
    onClose();
  };

  const menuItems: { id: AppId; title: string; category: string }[] = [
    { id: 'terminal', title: 'System Terminal', category: 'CORE' },
    { id: 'bio', title: 'Identity.bio', category: 'USER' },
    { id: 'projects', title: 'Project Archives', category: 'USER' },
    { id: 'ai-chat', title: 'Concierge AI', category: 'AI' },
    { id: 'contact', title: 'Trans-Comm Protocol', category: 'PROTO' },
    { id: 'socials', title: 'Neural Links', category: 'EXTERNAL' },
    { id: 'settings', title: 'System Settings', category: 'SYSTEM' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      // Prevent click propagation to backdrop
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-14 left-4 w-72 bg-[#0A1628]/95 backdrop-blur-xl border border-[#1A2E4A] rounded-lg shadow-2xl overflow-hidden shadow-[var(--nexus-accent)]/5"
    >
      <div className="p-4 bg-white/5 border-b border-[#1A2E4A] flex items-center justify-between">
        <span className="text-[10px] font-bold text-[var(--nexus-accent)] tracking-widest uppercase">NEXUS_OS // APPLICATIONS</span>
        <div className="w-2 h-2 bg-[var(--nexus-success)] rounded-full animate-pulse" />
      </div>

      <div className="p-2 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleLaunch(item.id, item.title)}
            className="w-full h-10 px-3 flex items-center justify-between hover:bg-[var(--nexus-accent)]/10 group transition-all rounded"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/5 rounded flex items-center justify-center text-[10px] group-hover:bg-[var(--nexus-accent)]/20 transition-colors">
                {item.id.charAt(0).toUpperCase()}
              </div>
              <span className="text-[12px] font-medium text-[var(--nexus-text)]">{item.title}</span>
            </div>
            <span className="text-[8px] text-[var(--nexus-text-muted)] group-hover:text-[var(--nexus-accent)]">{item.category}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 p-4 bg-white/5 border-t border-[#1A2E4A] flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[var(--nexus-accent)] to-[var(--nexus-accent-2)]" />
        <div className="flex flex-col">
          <span className="text-[11px] font-bold">DWARIKA KUMAR</span>
          <span className="text-[9px] text-[var(--nexus-text-muted)] uppercase tracking-tighter">AUTHENTICATED USER</span>
        </div>
      </div>
    </motion.div>
  );
}
