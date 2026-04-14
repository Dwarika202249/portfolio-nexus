'use client';

import React, { useState } from 'react';
import { useBoot } from '@/context/BootContext';

export function SettingsApp() {
  const { rebootSystem } = useBoot();
  const [activeTab, setActiveTab] = useState<'visuals' | 'diagnostics'>('visuals');

  const handleReboot = () => {
    rebootSystem();
  };

  return (
    <div className="h-full bg-[#050A14] font-mono p-8 flex flex-col relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.01)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="mb-8 border-b border-white/5 pb-4 flex justify-between items-end relative z-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-white uppercase italic">SYSTEM_CONTROL</h2>
          <p className="text-[10px] text-white/30 uppercase mt-1 tracking-widest italic">Core Configuration Interface</p>
        </div>
        <div className="flex gap-4 text-[10px] font-bold">
          <button
            onClick={() => setActiveTab('visuals')}
            className={activeTab === 'visuals' ? "text-[var(--nexus-accent)]" : "text-white/20"}
          >
            VISUAL_PROT
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={activeTab === 'diagnostics' ? "text-[var(--nexus-accent)]" : "text-white/20"}
          >
            DIAGNOSTICS
          </button>
        </div>
      </div>

      <div className="flex-1 relative z-10 overflow-auto no-scrollbar space-y-8">
        {activeTab === 'visuals' ? (
          <>
            {/* Visual Protocols */}
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-lg group hover:border-[var(--nexus-accent)]/30 transition-all">
                <div>
                  <h4 className="text-[11px] text-white font-bold uppercase tracking-widest">CRT_SHIELD_OVERLAY</h4>
                  <p className="text-[9px] text-white/30 mt-1 uppercase">Vintage Scanline Simulation</p>
                </div>
                <div className="w-10 h-5 bg-[var(--nexus-accent)] rounded-full p-1 flex justify-end cursor-pointer opacity-50">
                  <div className="w-3 h-3 bg-[#050A14] rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-lg group hover:border-[var(--nexus-accent)]/30 transition-all">
                <div>
                  <h4 className="text-[11px] text-white font-bold uppercase tracking-widest">NEON_BLOOM_RESONANCE</h4>
                  <p className="text-[9px] text-white/30 mt-1 uppercase">Cinematic Atmosphere glow</p>
                </div>
                <div className="w-10 h-5 bg-[var(--nexus-accent)] rounded-full p-1 flex justify-end cursor-pointer shadow-[0_0_8px_rgba(0,212,255,0.5)]">
                  <div className="w-3 h-3 bg-[#050A14] rounded-full" />
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                <div className="flex justify-between mb-4">
                  <h4 className="text-[11px] text-white font-bold uppercase tracking-widest">SIGNAL_BRIGHTNESS</h4>
                  <span className="text-[10px] text-[var(--nexus-accent)]">85%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-[var(--nexus-accent)] shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
                </div>
              </div>
            </div>

            {/* Reboot Protocol */}
            <div className="pt-8 mt-8 border-t border-white/5">
              <h3 className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-4">DANGER_ZONE</h3>
              <button
                onClick={handleReboot}
                className="w-full py-4 border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-red-500/10 hover:border-red-500 transition-all rounded shadow-[0_0_20px_rgba(239,68,68,0.1)]"
              >
                Execute_Neural_Reboot
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-black/40 border border-white/5 rounded-lg font-mono text-[10px] space-y-2">
              <div className="flex justify-between">
                <span className="text-white/20">OS_VERSION</span>
                <span className="text-[var(--nexus-accent)]">NEXUS_V1.4.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/20">UPTIME</span>
                <span className="text-[var(--nexus-accent)]">04:12:33:09</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/20">NEURAL_LOAD</span>
                <span className="text-[var(--nexus-accent)]">14%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/20">CORE_TEMP</span>
                <span className="text-[var(--nexus-accent)]">STABLE</span>
              </div>
            </div>

            <div className="p-4 border border-white/5 rounded-lg opacity-30">
              <h4 className="text-[9px] text-white/40 uppercase mb-4">Neural_Stability_History</h4>
              <div className="flex items-end gap-1 h-12">
                {[40, 70, 45, 90, 65, 80, 55, 75, 95, 60, 85, 50].map((h, i) => (
                  <div key={i} className="flex-1 bg-[var(--nexus-accent)]/20 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] text-white/20 uppercase tracking-widest relative z-10">
        <span>Authorization: ROOT_ADMIN</span>
        <span>Secure Session // ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
      </div>
    </div>
  );
}
