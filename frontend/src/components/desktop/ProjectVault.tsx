'use client';

import React, { useRef, useState, useMemo } from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial, OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { PROJECTS } from '@/data/projects';
import { Project } from '@/types/project';
import { cn } from '@/lib/utils/cn';

export function ProjectVault() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const selectedProject = useMemo(() => {
    if (!PROJECTS) return undefined;
    return PROJECTS.find(p => p.id === selectedId);
  }, [selectedId]);

  const handleDecrypt = () => {
    const link = selectedProject?.links?.live || selectedProject?.links?.github;
    if (!link) {
      console.warn("[NEXUS_DEBUG] Archive_Error // DATA_LINK_NULL");
      return;
    }

    setIsDecrypting(true);
    
    // Neural sequence delay
    setTimeout(() => {
      window.open(link, '_blank');
      setIsDecrypting(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-[#050A14] relative">
      <Canvas shadows dpr={[1, 1]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        
        {/* Cinematic Camera Rig */}
        <Rig selectedProject={selectedProject} />

        {/* BASIC LIGHTING */}
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#00D4FF" />
        
        {/* SPATIAL HELPERS */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <gridHelper args={[40, 40, "#1A2E4A", "#0A1628"]} position={[0, -4, 0]} rotation={[Math.PI / 2, 0, 0]} />

        {/* Project Nodes */}
        {PROJECTS && PROJECTS.map((project) => (
          <ProjectNode
            key={project.id}
            project={project}
            onSelect={setSelectedId}
            isSelected={selectedId === project.id}
          />
        ))}

        <OrbitControls
          enablePan={!selectedId}
          enableZoom={!selectedId}
          maxDistance={30}
          minDistance={5}
          makeDefault
        />
      </Canvas>

      {/* Overlay UI for selected project */}
      {selectedProject && (
        <div className="absolute right-6 top-6 bottom-6 w-80 bg-[#0A1628]/90 backdrop-blur-xl border border-[var(--nexus-accent)]/30 rounded-lg p-6 flex flex-col pointer-events-auto animate-in fade-in slide-in-from-right-10 duration-500">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono text-[var(--nexus-accent)] uppercase tracking-widest">{selectedProject.category}</span>
            <button onClick={() => setSelectedId(null)} className="text-white/30 hover:text-white">✕</button>
          </div>

          <h3 className="text-xl font-bold mb-2 text-white">{selectedProject.title}</h3>
          <p className="text-xs text-[var(--nexus-text-muted)] leading-relaxed mb-6 font-mono">
            {selectedProject.description}
          </p>

          <div className="space-y-4 flex-1">
            <div>
              <span className="text-[9px] text-white/40 block mb-2 uppercase">Core Diagnostics</span>
              <div className="grid grid-cols-2 gap-2">
                {selectedProject.metrics?.map((m: any) => (
                  <div key={m.label} className="bg-white/5 p-2 rounded border border-white/5">
                    <div className="text-[8px] text-white/40 truncate">{m.label}</div>
                    <div className="text-[10px] text-[var(--nexus-accent)] font-bold">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[9px] text-white/40 block mb-2 uppercase">Neural Stack</span>
              <div className="flex flex-wrap gap-1">
                {selectedProject.techStack?.map((t: string) => (
                  <span key={t} className="text-[9px] px-2 py-0.5 bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)] rounded border border-[var(--nexus-accent)]/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button 
            disabled={isDecrypting}
            onClick={handleDecrypt}
            className={cn(
              "mt-6 w-full py-2 text-[#050A14] text-[10px] font-bold uppercase tracking-widest transition-all rounded shadow-lg overflow-hidden relative",
              isDecrypting 
                ? "bg-[var(--nexus-accent)]/50 cursor-wait animate-pulse" 
                : "bg-[var(--nexus-accent)] hover:bg-[#00E5FF] shadow-[0_0_15px_rgba(0,212,255,0.3)]"
            )}
          >
            {isDecrypting && (
              <div className="absolute inset-0 bg-white/20 animate-[ping_0.5s_infinite]" />
            )}
            <span className="relative z-10">
              {isDecrypting ? "Sequencing Arch_Uplink..." : "Decrypt Archives →"}
            </span>
          </button>
        </div>
      )}

      {!selectedId && (
        <div className="absolute left-1/2 bottom-8 -translate-x-1/2 text-[10px] font-mono text-white/30 tracking-[0.4em] uppercase pointer-events-none animate-pulse">
          Orbit to Navigate // Click Artifact to Inspect
        </div>
      )}
    </div>
  );
}

function Rig({ selectedProject }: { selectedProject: Project | undefined }) {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();

  return useFrame((state) => {
    if (selectedProject) {
      // Focus on selected project
      const [x, y, z] = selectedProject.position as [number, number, number];
      camera.position.lerp(vec.set(x, y + 1, z + 6), 0.05);
      camera.lookAt(x, y, z);
    } else {
      // General orbit/hover
      const t = state.clock.elapsedTime;
      camera.position.lerp(vec.set(Math.sin(t * 0.1) * 2 + mouse.x * 2, Math.cos(t * 0.1) * 2 + mouse.y * 2, 15), 0.05);
      camera.lookAt(0, 0, 0);
    }
  });
}

function ProjectNode({ project, onSelect, isSelected }: { project: Project; onSelect: (id: string | null) => void; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;

      // Gentle floating motion - Using internal elapsed time for stability
      const t = state.clock.elapsedTime;
      meshRef.current.position.y = (project.position?.[1] || 0) + Math.sin(t + (project.position?.[0] || 0)) * 0.2;
    }
  });

  return (
    <group position={project.position as [number, number, number]}>
      {/* Neural Pulse - Glows only when selected */}
      {isSelected && (
        <pointLight intensity={2} distance={5} color="#00D4FF" />
      )}
      
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onSelect(project.id); }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
        >
          <icosahedronGeometry args={[1, 15]} />
          <MeshDistortMaterial
            color={isSelected ? "#00D4FF" : hovered ? "#00E5FF" : "#1A2E4A"}
            distort={0.45}
            speed={4}
            roughness={0.1}
            metalness={0.9}
            emissive={isSelected ? "#00D4FF" : hovered ? "#0066FF" : "#000000"}
            emissiveIntensity={isSelected ? 1.5 : hovered ? 0.8 : 0}
            opacity={0.9}
            transparent
          />
        </mesh>
      </Float>

      {/* Label */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color={isSelected || hovered ? "white" : "#4A5D71"}
        anchorX="center"
        anchorY="middle"
      >
        {project.title.toUpperCase()}
      </Text>
    </group>
  );
}
