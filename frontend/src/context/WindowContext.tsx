'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type AppId = 'terminal' | 'bio' | 'projects' | 'settings' | 'ai-chat' | 'socials' | 'contact';

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WindowContextType {
  windows: Record<AppId, WindowState>;
  activeWindowId: AppId | null;
  openWindow: (id: AppId, title: string) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updateWindowSpatial: (id: AppId, spatial: Partial<{ x: number; y: number; width: number; height: number }>) => void;
  maxZIndex: number;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

const INITIAL_WINDOWS: Record<AppId, WindowState> = {
  terminal: { id: 'terminal', title: 'NEXUS Terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 50, y: 50, width: 800, height: 500 },
  bio: { id: 'bio', title: 'Identity: Dwarika Kumar', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 100, y: 100, width: 850, height: 600 },
  projects: { id: 'projects', title: 'Project Archives', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 80, y: 80, width: 900, height: 650 },
  settings: { id: 'settings', title: 'System Settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 120, y: 120, width: 600, height: 500 },
  'ai-chat': { id: 'ai-chat', title: 'Concierge AI', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 150, y: 150, width: 500, height: 600 },
  socials: { id: 'socials', title: 'Neural Links', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 180, y: 180, width: 700, height: 500 },
  contact: { id: 'contact', title: 'Trans-Comm Protocol', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 200, y: 200, width: 600, height: 600 },
};

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [cascadeOffset, setCascadeOffset] = useState(0);

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
    setWindows(prev => {
      const alreadyOpen = prev[id].isOpen;
      const newOffset = alreadyOpen ? cascadeOffset : (cascadeOffset + 30) % 300;
      if (!alreadyOpen) setCascadeOffset(newOffset);

      return {
        ...prev,
        [id]: { 
          ...prev[id], 
          title, 
          isOpen: true, 
          isMinimized: false,
          // Apply cascading only on new opens
          x: alreadyOpen ? prev[id].x : 100 + newOffset,
          y: alreadyOpen ? prev[id].y : 100 + newOffset,
        }
      };
    });
    focusWindow(id);
  }, [focusWindow, cascadeOffset]);

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

  const updateWindowSpatial = useCallback((id: AppId, spatial: Partial<{ x: number; y: number; width: number; height: number }>) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], ...spatial }
    }));
  }, []);

  return (
    <WindowContext.Provider value={{
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      focusWindow,
      updateWindowSpatial,
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
