'use client';

import { BootSequence } from "@/components/boot/BootSequence";
import { NexusDesktop } from "@/components/desktop/NexusDesktop";
import { useBoot } from "@/context/BootContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { isBootComplete } = useBoot();
  const [showDesktop, setShowDesktop] = useState(false);

  useEffect(() => {
    if (isBootComplete) {
      const timer = setTimeout(() => {
        setShowDesktop(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowDesktop(false);
    }
  }, [isBootComplete]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050A14]">
      {/* PHASE 1: BOOT SEQUENCE */}
      {!isBootComplete && <BootSequence />}

      {/* PHASE 2: NEXUS DESKTOP */}
      {showDesktop && <NexusDesktop />}
    </main>
  );
}
