'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  brief: string;
}

type Stage = 'FORM' | 'DRAFT' | 'SUCCESS';

export function ContactApp() {
  const [stage, setStage] = useState<Stage>('FORM');
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    brief: '',
  });
  const [aiSummary, setAiSummary] = useState('');
  const [isSending, setIsSending] = useState(false);

  // For magic typing
  const draftRefs = {
    to: useRef<HTMLSpanElement>(null),
    subject: useRef<HTMLSpanElement>(null),
    body: useRef<HTMLDivElement>(null),
  };

  const startDrafting = () => {
    const summary = `Greetings, I am drafting a specialized transmission for Dwarika based on your inquiry. 
    
    You are reaching out regarding a potential collaboration/opportunity. I have captured your contact coordinates at ${formData.email} and summarized the objective: "${formData.brief}".
    
    My creator, Dwarika, is currently optimized for innovative Full-Stack and AI solutions. I will transmit this data to his primary neural inbox immediately.`;
    
    setAiSummary(summary);
    setStage('DRAFT');
  };

  useEffect(() => {
    if (stage === 'DRAFT' && draftRefs.to.current) {
      const tl = gsap.timeline({
        onComplete: () => setIsSending(false),
        delay: 0.5 // Brief wait for the window animation to settle
      });

      setIsSending(true);

      // Clear contents for a fresh typing feel
      if (draftRefs.to.current) draftRefs.to.current.innerText = "";
      if (draftRefs.subject.current) draftRefs.subject.current.innerText = "";
      if (draftRefs.body.current) draftRefs.body.current.innerText = "";

      // Animation Sequence
      tl.to(draftRefs.to.current, { text: "Dwarika Kumar <dcchaudhary85@gmail.com>", duration: 1.2, ease: "none" })
        .to(draftRefs.subject.current, { text: `[OPPORTUNITY] Transmission from ${formData.name}`, duration: 1.5, ease: "none" }, "+=0.3")
        .to(draftRefs.body.current, { text: aiSummary, duration: 3.5, ease: "none" }, "+=0.3");
    }
  }, [stage, aiSummary, formData.name]);

  const handleFinalSend = async () => {
    setIsSending(true);
    try {
      const response = await fetch('http://localhost:5000/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, aiSummary }),
      });

      if (response.ok) {
        setStage('SUCCESS');
      }
    } catch (error) {
      console.error("Transmission Failed", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full bg-[#050A14] font-mono text-[12px] p-6 relative flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === 'FORM' && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6 max-w-lg mx-auto w-full"
          >
            <div className="border-l-2 border-[var(--nexus-accent)] pl-4 py-2 mb-8">
              <h2 className="text-xl font-bold tracking-tighter text-white">ESTABLISH_CONTACT</h2>
              <p className="text-[10px] text-[var(--nexus-text-muted)] uppercase">Neural Link Initialization Sequence</p>
            </div>

            <div className="grid gap-4">
              <InputGroup label="RECRUITER_NAME" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} placeholder="IDENTIFY YOURSELF" />
              <InputGroup label="SIGNAL_COORDINATES (EMAIL)" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} placeholder="EMAIL@DOMAIN.COM" />
              <InputGroup label="VOICE_LINK (OPTIONAL)" value={formData.phone || ''} onChange={(v) => setFormData({...formData, phone: v})} placeholder="+91 XXXXX XXXXX" />
              <div className="space-y-1">
                <label className="text-[9px] text-[var(--nexus-accent)] font-bold">TRANSMISSION_BRIEF</label>
                <textarea 
                  value={formData.brief}
                  onChange={(e) => setFormData({...formData, brief: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded p-3 h-32 focus:border-[var(--nexus-accent)]/50 outline-none text-white resize-none"
                  placeholder="DETAILS OF THE OPPORTUNITY..."
                />
              </div>
            </div>

            <button 
              onClick={() => {
                 const summary = `Greetings, I am drafting a specialized transmission for Dwarika based on your inquiry. 
    
You are reaching out regarding a potential collaboration/opportunity. I have captured your contact coordinates at ${formData.email} and summarized the objective: "${formData.brief}".
    
My creator, Dwarika, is currently optimized for innovative Full-Stack and AI solutions. I will transmit this data to his primary neural inbox immediately.`;
                 setAiSummary(summary);
                 setStage('DRAFT');
              }}
              disabled={!formData.name || !formData.email || !formData.brief}
              className="w-full py-3 bg-[var(--nexus-accent)] text-[#050A14] font-bold uppercase tracking-widest hover:bg-[#00E5FF] transition-all disabled:opacity-50 disabled:grayscale"
            >
              DRY_RUN_DRAFT »
            </button>
          </motion.div>
        )}

        {stage === 'DRAFT' && (
          <DraftingView 
            formData={formData} 
            aiSummary={aiSummary} 
            onSend={handleFinalSend} 
            isSending={isSending} 
          />
        )}

        {stage === 'SUCCESS' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                  className="w-20 h-20 rounded-full border-2 border-[var(--nexus-accent)] flex items-center justify-center"
                >
                  <span className="text-2xl">✓</span>
                </motion.div>
                <div className="absolute inset-0 animate-ping border border-[var(--nexus-accent)] rounded-full" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">SIGNAL_RECEIVED</h3>
              <p className="text-[10px] text-[var(--nexus-text-muted)] max-w-xs uppercase leading-loose">
                Your transmission has been encrypted and delivered to Dwarika's primary neural hub. 
                He will recalibrate for a callback soon.
              </p>
            </div>

            <button 
              onClick={() => setStage('FORM')}
              className="text-[9px] text-[var(--nexus-accent)] border border-[var(--nexus-accent)]/30 px-4 py-1 hover:bg-[var(--nexus-accent)]/10 transition-colors"
            >
              INITIATE_NEW_STREAM
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DraftingView({ formData, aiSummary, onSend, isSending }: any) {
  const [isTyping, setIsTyping] = useState(true);
  const refs = {
    to: useRef<HTMLSpanElement>(null),
    subject: useRef<HTMLSpanElement>(null),
    body: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsTyping(false),
      delay: 0.2
    });

    tl.to(refs.to.current, { text: "Dwarika Kumar <dcchaudhary85@gmail.com>", duration: 1.2, ease: "none" })
      .to(refs.subject.current, { text: `[OPPORTUNITY] Transmission from ${formData.name}`, duration: 1.2, ease: "none" }, "+=0.2")
      .to(refs.body.current, { text: aiSummary, duration: 4, ease: "none" }, "+=0.2");

    return () => { tl.kill(); };
  }, [formData.name, aiSummary]);

  return (
    <motion.div 
      key="draft"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col bg-[#0A1628] rounded-lg border border-white/10 overflow-hidden shadow-2xl"
    >
      <div className="bg-white/5 border-b border-white/10 p-4 space-y-3">
        <div className="flex gap-4">
          <span className="text-white/30 w-16 text-[10px]">TO:</span>
          <span ref={refs.to} className="text-[var(--nexus-accent)] font-bold"></span>
        </div>
        <div className="flex gap-4">
          <span className="text-white/30 w-16 text-[10px]">FROM:</span>
          <span className="text-white font-bold">{formData.email}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-white/30 w-16 text-[10px]">SUBJECT:</span>
          <span ref={refs.subject} className="text-white"></span>
        </div>
      </div>

      <div className="flex-1 p-6 text-[11px] leading-relaxed text-[var(--nexus-text-muted)] whitespace-pre-wrap">
        <div ref={refs.body}></div>
      </div>

      <div className="p-4 border-t border-white/10 flex justify-between items-center">
        <span className="text-[9px] text-[var(--nexus-accent)] animate-pulse">
          {isTyping ? "NEURAL DRAFTING IN PROGRESS..." : (isSending ? "ENCRYPTING DATASTREAM..." : "neural draft finalized")}
        </span>
        <button 
          onClick={onSend}
          disabled={isTyping || isSending}
          className="px-8 py-2 bg-[var(--nexus-accent)] text-[#050A14] font-bold hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all disabled:opacity-50"
        >
          TRANSMIT_SIGNAL »
        </button>
      </div>
    </motion.div>
  );
}

function InputGroup({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] text-[var(--nexus-accent)] font-bold">{label}</label>
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 focus:border-[var(--nexus-accent)]/50 outline-none text-white"
        placeholder={placeholder}
      />
    </div>
  );
}
