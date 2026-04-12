'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type BootPhase = 
  | 'INIT' 
  | 'SCANNING' 
  | 'LOADING' 
  | 'IDENTITY' 
  | 'MOUNTING' 
  | 'COMPLETE' 
  | 'SKIPPED';

interface BootContextType {
  phase: BootPhase;
  progress: number;
  setPhase: (phase: BootPhase) => void;
  setProgress: (progress: number) => void;
  skipBoot: () => void;
  isBootComplete: boolean;
}

const BootContext = createContext<BootContextType | undefined>(undefined);

export function BootProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<BootPhase>('INIT');
  const [progress, setProgress] = useState(0);
  const [isBootComplete, setIsBootComplete] = useState(false);

  useEffect(() => {
    // Check session storage to skip boot on refresh
    const skipped = sessionStorage.getItem('nexus_boot_skipped');
    if (skipped) {
      setPhase('SKIPPED');
      setIsBootComplete(true);
    }
  }, []);

  const skipBoot = useCallback(() => {
    setPhase('SKIPPED');
    setIsBootComplete(true);
    sessionStorage.setItem('nexus_boot_skipped', 'true');
  }, []);

  useEffect(() => {
    if (phase === 'COMPLETE' || phase === 'SKIPPED') {
      setIsBootComplete(true);
      sessionStorage.setItem('nexus_boot_skipped', 'true');
    }
  }, [phase]);

  return (
    <BootContext.Provider value={{ phase, progress, setPhase, setProgress, skipBoot, isBootComplete }}>
      {children}
    </BootContext.Provider>
  );
}

export function useBoot() {
  const context = useContext(BootContext);
  if (context === undefined) {
    throw new Error('useBoot must be used within a BootProvider');
  }
  return context;
}
