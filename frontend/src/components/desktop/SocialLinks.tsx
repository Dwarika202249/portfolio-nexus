'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOCIAL_LINKS, SocialNode } from '@/data/socials';

export function SocialLinks() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAction = (node: SocialNode) => {
    if (node.isAction) {
      navigator.clipboard.writeText(node.url);
      setCopiedId(node.id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      window.open(node.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="h-full bg-[#050A14] font-mono p-8 flex flex-col relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.02)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="mb-8 border-b border-white/5 pb-4">
        <h2 className="text-2xl font-bold tracking-tighter text-white uppercase italic flex items-center gap-3">
          <span className="w-2 h-2 bg-[var(--nexus-accent)] animate-pulse" />
          Neural_Links_Hub
        </h2>
        <p className="text-[10px] text-white/30 uppercase mt-1 tracking-widest">Target Acquisition Mode: ACTIVE</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-auto no-scrollbar">
        {SOCIAL_LINKS.map((node, index) => (
          <motion.button
            key={node.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleAction(node)}
            className="group relative flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-lg text-left transition-all hover:bg-white/[0.05] hover:border-white/20 overflow-hidden"
          >
            {/* Resonance Glow Backdrop */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: node.color }}
            />
            
            <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300 relative z-10">
              {node.icon}
            </div>

            <div className="flex-1 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white tracking-widest uppercase mb-1">
                  {node.platform}
                </span>
                {node.isAction && (
                  <span className="text-[8px] text-[var(--nexus-accent)] uppercase animate-pulse">Action_Logic</span>
                )}
              </div>
              <p className="text-[11px] text-[var(--nexus-text-muted)] group-hover:text-white/60 transition-colors">
                {node.description}
              </p>
            </div>

            {/* Connection Indicator */}
            <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[var(--nexus-accent)] group-hover:shadow-[0_0_10px_rgba(0,212,255,1)] transition-all duration-300" />

            <AnimatePresence>
              {copiedId === node.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center bg-[var(--nexus-accent)]/90 backdrop-blur-sm z-50 text-[#050A14] font-bold text-xs uppercase italic tracking-widest"
                >
                  Neural_Signal_Captured
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[8px] text-white/20 uppercase tracking-[0.2em]">
        <span>Status: Uplink_Established</span>
        <span>Secure Protocol: AES-256</span>
      </div>
    </div>
  );
}
