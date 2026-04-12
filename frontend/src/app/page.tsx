'use client';

import { BootSequence } from "@/components/boot/BootSequence";
import { useBoot } from "@/context/BootContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { isBootComplete } = useBoot();
  const [showDesktop, setShowDesktop] = useState(false);

  useEffect(() => {
    if (isBootComplete) {
      // Small delay to allow boot sequence exit animation to finish
      const timer = setTimeout(() => {
        setShowDesktop(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isBootComplete]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050A14]">
      {/* PHASE 1: BOOT SEQUENCE */}
      {!isBootComplete && <BootSequence />}

      {/* PHASE 2: NEXUS DESKTOP (Placeholder) */}
      {showDesktop && (
        <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
          <h1 className="text-4xl font-bold text-[var(--nexus-accent)] mb-4">NEXUS OS v1.0.0</h1>
          <p className="text-[var(--nexus-text-muted)] font-mono">
            System initialization successful. Desktop shell loading...
          </p>
          <div className="absolute bottom-10 animate-bounce text-[var(--nexus-accent-2)]">
            PHASE 2: DESKTOP SHELL UNDER CONSTRUCTION
          </div>
        </div>
      )}
    </main>
  );
}
