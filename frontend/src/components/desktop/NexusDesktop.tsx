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
import { IdentityBio } from './IdentityBio';
import { SocialLinks } from './SocialLinks';
import { SettingsApp } from './SettingsApp';
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
      <div className="relative z-10 w-full h-[calc(100%-48px)] pointer-events-none">
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
                {win.id === 'bio' && <IdentityBio />}
                {win.id === 'socials' && <SocialLinks />}
                {win.id === 'settings' && <SettingsApp />}
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
