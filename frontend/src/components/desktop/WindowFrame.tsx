'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { useWindowManager, AppId } from '@/context/WindowContext';
import { useMobile } from '@/hooks/useMobile';

interface WindowFrameProps {
  id: AppId;
  title: string;
  zIndex: number;
  isFocused: boolean;
  children: React.ReactNode;
}

export const WindowFrame = React.forwardRef<HTMLDivElement, WindowFrameProps>(
  ({ id, title, children, zIndex, isFocused }, ref) => {
    const { closeWindow, minimizeWindow, focusWindow, updateWindowSpatial, windows } = useWindowManager();
    const isMobile = useMobile();
    const win = windows[id];

    // Dragging Logic
    const handleDragStart = (e: React.MouseEvent) => {
      if (isMobile) return;
      e.preventDefault();
      focusWindow(id);
      
      const startX = e.clientX;
      const startY = e.clientY;
      const initialX = win.x;
      const initialY = win.y;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        updateWindowSpatial(id, {
          x: initialX + deltaX,
          y: initialY + deltaY,
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    // Resizing Logic (8-way)
    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();
      focusWindow(id);

      const startX = e.clientX;
      const startY = e.clientY;
      const { x, y, width, height } = win;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        let newSpatial: any = {};

        if (direction.includes('e')) newSpatial.width = Math.max(400, width + deltaX);
        if (direction.includes('s')) newSpatial.height = Math.max(300, height + deltaY);
        if (direction.includes('w')) {
          const newWidth = Math.max(400, width - deltaX);
          if (newWidth !== 400) {
            newSpatial.width = newWidth;
            newSpatial.x = x + deltaX;
          }
        }
        if (direction.includes('n')) {
          const newHeight = Math.max(300, height - deltaY);
          if (newHeight !== 300) {
            newSpatial.height = newHeight;
            newSpatial.y = y + deltaY;
          }
        }

        updateWindowSpatial(id, newSpatial);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const desktopStyles = !isMobile ? {
      left: win.x,
      top: win.y,
      width: win.width,
      height: win.height,
      position: 'absolute' as const,
      margin: 0,
      zIndex,
    } : { zIndex };

    const mobileStyles = isMobile ? {
      width: '100vw',
      height: 'calc(100vh - 48px)',
      top: 0,
      left: 0,
      margin: 0,
      borderRadius: 0,
    } : {};

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        style={{ ...desktopStyles, ...mobileStyles }}
        onClick={() => focusWindow(id)}
        className={cn(
          "bg-[#0A1628]/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col pointer-events-auto",
          isFocused ? "ring-1 ring-[var(--nexus-accent)] shadow-[0_0_30px_rgba(0,212,255,0.15)]" : "opacity-90",
          isMobile && "border-none shadow-none ring-0"
        )}
      >
        {/* Resize Handles (Desktop Only) */}
        {!isMobile && (
          <>
            <div className="absolute top-0 left-0 w-full h-1 cursor-ns-resize z-[60]" onMouseDown={(e) => handleResizeStart(e, 'n')} />
            <div className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize z-[60]" onMouseDown={(e) => handleResizeStart(e, 's')} />
            <div className="absolute top-0 left-0 w-1 h-full cursor-ew-resize z-[60]" onMouseDown={(e) => handleResizeStart(e, 'w')} />
            <div className="absolute top-0 right-0 w-1 h-full cursor-ew-resize z-[60]" onMouseDown={(e) => handleResizeStart(e, 'e')} />
            
            <div className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-[70]" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
            <div className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-[70]" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
            <div className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-[70]" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
            <div className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-[70] group/resize" onMouseDown={(e) => handleResizeStart(e, 'se')}>
               {/* Visual Handle */}
               <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-white/20 group-hover/resize:border-[var(--nexus-accent)] transition-colors" />
            </div>
          </>
        )}

        {/* Title Bar */}
        <div 
          onMouseDown={handleDragStart}
          className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 cursor-move select-none active:cursor-grabbing"
        >
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isFocused ? "bg-[var(--nexus-accent)]" : "bg-white/20")} />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--nexus-text-muted)]">{title}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} className="hover:text-white transition-colors relative z-[80]">
              <span className="text-lg leading-none opacity-50 hover:opacity-100">−</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }} className="hover:text-red-400 transition-colors relative z-[80]">
              <span className="text-lg leading-none opacity-50 hover:opacity-100">×</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {children}
          
          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] z-50" />
        </div>

        {/* Status Bar */}
        <div className="h-6 px-3 flex items-center justify-between bg-white/5 border-t border-white/5 text-[9px] font-mono text-[var(--nexus-text-muted)]">
            <span>STATUS: NOMINAL</span>
            <div className="flex items-center gap-4">
                <span>LNG: TS/JSX</span>
                <span>POS: {Math.round(win.x)},{Math.round(win.y)}</span>
            </div>
        </div>
      </motion.div>
    );
  }
);

WindowFrame.displayName = 'WindowFrame';
