'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type AppId = 'terminal' | 'bio' | 'projects' | 'settings' | 'ai-chat' | 'socials';

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface WindowContextType {
  windows: Record<AppId, WindowState>;
  activeWindowId: AppId | null;
  openWindow: (id: AppId, title: string) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  maxZIndex: number;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

const INITIAL_WINDOWS: Record<AppId, WindowState> = {
  terminal: { id: 'terminal', title: 'NEXUS Terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
  bio: { id: 'bio', title: 'Identity: Dwarika Kumar', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
  projects: { id: 'projects', title: 'Project Archives', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
  settings: { id: 'settings', title: 'System Settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
  'ai-chat': { id: 'ai-chat', title: 'Concierge AI', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
  socials: { id: 'socials', title: 'Neural Links', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
};

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);

  const focusWindow = useCallback((id: AppId) => {
    setActiveWindowId(id);
    setMaxZIndex(prev => {
      const newZ = prev + 1;
      setWindows(prevWindows => ({
        ...prevWindows,
        [id]: { ...prevWindows[id], zIndex: newZ, isMinimized: false }
      }));
      return newZ;
    });
  }, []);

  const openWindow = useCallback((id: AppId, title: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], title, isOpen: true, isMinimized: false }
    }));
    focusWindow(id);
  }, [focusWindow]);

  const closeWindow = useCallback((id: AppId) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: AppId) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  return (
    <WindowContext.Provider value={{
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      focusWindow,
      maxZIndex
    }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error('useWindowManager must be used within a WindowProvider');
  }
  return context;
}
