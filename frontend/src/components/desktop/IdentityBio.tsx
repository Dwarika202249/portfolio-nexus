'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';

const SKILLS = [
  { name: 'MERN_STACK', level: 95, category: 'CORE' },
  { name: 'AI_ORCHESTRATOR', level: 88, category: 'NEURAL' },
  { name: '3D_VISUALIZATION', level: 82, category: 'GRAPHICS' },
  { name: 'SYSTEM_ARCH', level: 90, category: 'ENGINEER' },
];

export function IdentityBio() {
  const scanlineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Biometric Sweep Animation
    if (scanlineRef.current) {
      gsap.fromTo(scanlineRef.current, 
        { top: '-10%' },
        { 
          top: '110%', 
          duration: 2, 
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 3
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="h-full bg-[#050A14] font-mono text-[12px] p-8 relative overflow-hidden flex flex-col gap-8">
      {/* Scanning Effect Overlay */}
      <div 
        ref={scanlineRef}
        className="absolute left-0 right-0 h-[2px] bg-[var(--nexus-accent)] shadow-[0_0_15px_rgba(0,212,255,0.8)] z-50 pointer-events-none opacity-50"
      />
      
      {/* Bio Header Section */}
      <div className="flex items-start justify-between border-b border-white/5 pb-8 relative z-10">
        <div className="flex gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[var(--nexus-accent)]/20 to-transparent border border-[var(--nexus-accent)]/30 rounded flex items-center justify-center relative overflow-hidden group shadow-[0_0_20px_rgba(0,212,255,0.1)]">
            <Image 
              src="/dwarika.png" 
              alt="Dwarika Kumar" 
              width={96}
              height={96}
              className="w-full h-full object-cover filter brightness-90 contrast-110 group-hover:brightness-100 transition-all duration-500"
            />
            {/* Holographic Overlays */}
            <div className="absolute inset-0 bg-[var(--nexus-accent)]/5 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tighter text-white uppercase italic">DWARIKA KUMAR</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)] text-[9px] font-bold rounded">ELITE_ARCHITECT</span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest">RANK: MASTER_NODE</span>
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[10px] text-[var(--nexus-accent)] font-bold">IDENTITY_VERIFIED // 100%</span>
          <span className="text-[8px] text-white/20 mt-1 uppercase tracking-tighter">SECURE_LINK: STABLE</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 relative z-10">
        {/* Left Column: Mission Directives */}
        <section className="space-y-6">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--nexus-accent)] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[var(--nexus-accent)] rounded-full animate-pulse" />
              Primary_Directives
            </h3>
            <p className="text-[var(--nexus-text-muted)] leading-relaxed italic border-l border-white/10 pl-4">
              &quot;Mastering the intersection of high-performance architecture and neural intelligence. My mission is to build digital ecosystems that are as resilient as they are beautiful.&quot;
            </p>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Neural_Archive_Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] border-b border-white/5 pb-2">
                <span className="text-white/30">CURRENT_FOCUS</span>
                <span className="text-white">AI_RAG_OPTIMIZATION</span>
              </div>
              <div className="flex justify-between text-[10px] border-b border-white/5 pb-2">
                <span className="text-white/30">COGNITIVE_GEAR</span>
                <span className="text-white">NEXT.JS // TYPESCRIPT // THREE.JS</span>
              </div>
              <div className="flex justify-between text-[10px] border-b border-white/5 pb-2">
                <span className="text-white/30">DEPLOYMENT_STATIONS</span>
                <span className="text-white">VERCEL // RENDER // AWS</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Skill Integrity Matrix */}
        <section>
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--nexus-accent)] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--nexus-accent)] rounded-full animate-pulse" />
            Neural_Integrity_Matrix
          </h3>
          <div className="space-y-6">
            {SKILLS.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-[9px] uppercase tracking-widest">
                  <span className="text-white/60">{skill.name}</span>
                  <span className="text-[var(--nexus-accent)]">{skill.level}%_STABLE</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-[var(--nexus-accent)] to-[var(--nexus-accent-2)] relative"
                  >
                    <div className="absolute inset-0 bg-[white/20] animate-pulse" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Footer Actions */}
      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6 text-[9px] text-white/20 relative z-10">
        <div className="flex gap-4">
          <span>LOC: KARNATAKA, IN</span>
          <span>ZONE: UTC+5:30</span>
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded hover:border-[var(--nexus-accent)] hover:text-[var(--nexus-accent)] transition-all uppercase tracking-[0.2em] font-bold">
          Request_Neural_Signature (CV)
        </button>
      </div>
    </div>
  );
}
