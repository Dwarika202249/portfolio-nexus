'use client';

import React from 'react';
import { WindowProvider, useWindowManager } from '@/context/WindowContext';
import { Taskbar } from './Taskbar';
import { DesktopGrid } from './DesktopGrid';
import { WindowFrame } from './WindowFrame';
import { TerminalApp } from './TerminalApp';
import { ProjectVault } from './ProjectVault';
import { AIChat } from './AIChat';
import { ContactApp } from './ContactApp';
import { AnimatePresence } from 'framer-motion';
import { useMobile } from '@/hooks/useMobile';

export function NexusDesktop() {
  return (
    <WindowProvider>
      <DesktopShell />
    </WindowProvider>
  );
}

function DesktopShell() {
  const { windows, activeWindowId } = useWindowManager();
  const isMobile = useMobile();

  return (
    <div className="relative w-full h-full bg-[#050A14] overflow-hidden">
      {/* Dynamic Background / Wallpaper */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      </div>

      {/* Desktop Content Grid */}
      <DesktopGrid />

      {/* Active Windows */}
      <div className="relative z-10 w-full h-[calc(100%-48px)]">
        <AnimatePresence mode='popLayout'>
          {Object.values(windows).map(win => (
            win.isOpen && !win.isMinimized && (
              <WindowFrame 
                key={win.id} 
                id={win.id} 
                title={win.title} 
                zIndex={win.zIndex}
                isFocused={activeWindowId === win.id}
              >
                {/* Render specific app content based on ID */}
                {win.id === 'terminal' && <TerminalApp />}
                {win.id === 'ai-chat' && <AIChat />}
                {win.id === 'projects' && <ProjectVault />}
                {win.id === 'contact' && <ContactApp />}
                {win.id === 'bio' && (
                  <div className="p-8 text-[var(--nexus-text)] overflow-auto h-full">
                    <h2 className="text-3xl font-bold mb-6 tracking-tighter">DWARIKA KUMAR</h2>
                    <div className="space-y-6 max-w-2xl">
                        <section>
                            <h3 className="text-[10px] uppercase tracking-widest text-[var(--nexus-accent)] mb-2">Primary_Directives</h3>
                            <p className="text-[var(--nexus-text-muted)] font-mono leading-relaxed">
                            Elite Full-Stack Architect & AI Specialist. My mission is to build software that bridges the gap between raw hardware constraints and human imagination.
                            </p>
                        </section>
                        <section>
                            <h3 className="text-[10px] uppercase tracking-widest text-[var(--nexus-accent)] mb-2">Neural_Core_Skills</h3>
                            <ul className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[var(--nexus-text-muted)]">
                                <li>» MERN Stack (Advanced)</li>
                                <li>» LLM Orchestration (LangChain)</li>
                                <li>» 3D Web Graphics (Three.js)</li>
                                <li>» System Scalability & RBAC</li>
                            </ul>
                        </section>
                    </div>
                  </div>
                )}
                {/* Fallback for other apps */}
                {win.id !== 'terminal' && win.id !== 'bio' && win.id !== 'ai-chat' && win.id !== 'projects' && (
                  <div className="h-full flex flex-col items-center justify-center grayscale opacity-50">
                    <span className="text-4xl mb-2">🚧</span>
                    <span className="text-[10px] font-mono tracking-widest uppercase">MODULE_UNDER_CONSTRUCTION</span>
                  </div>
                )}
              </WindowFrame>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Global Taskbar */}
      <Taskbar />

      {/* Screen Effects (CRT overlay slightly more subtle for desktop) */}
      <div className="absolute inset-0 pointer-events-none z-[2000] opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
      </div>
    </div>
  );
}
