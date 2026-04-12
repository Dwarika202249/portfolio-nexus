'use client';

import { useEffect, useRef } from 'react';
import { useBoot, BootPhase } from '../context/BootContext';
import gsap from 'gsap';

export function useBootSequence() {
  const { phase, setPhase, setProgress, progress, skipBoot } = useBoot();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (phase === 'SKIPPED' || phase === 'COMPLETE') return;

    // Master orchestration timeline
    const tl = gsap.timeline({
      onComplete: () => setPhase('COMPLETE')
    });
    timelineRef.current = tl;

    // Phase: INIT
    tl.to({}, { duration: 0.1, onStart: () => setPhase('INIT') })
    
    // Phase: SCANNING
    .to({}, { 
      duration: 0.8, 
      onStart: () => setPhase('SCANNING'),
    })

    // Phase: LOADING
    .to({}, { 
      duration: 1.5, 
      onStart: () => setPhase('LOADING'),
      onUpdate: function() {
        setProgress(Math.floor(this.progress() * 100));
      }
    })

    // Phase: IDENTITY
    .to({}, { 
      duration: 1.0, 
      onStart: () => setPhase('IDENTITY') 
    })

    // Phase: MOUNTING
    .to({}, { 
      duration: 0.6, 
      onStart: () => setPhase('MOUNTING') 
    });

    return () => {
      tl.kill();
    };
  }, []); // Only run once on mount

  return {
    phase,
    progress,
    skip: skipBoot
  };
}
