'use client';

import React, { useRef, useState, useMemo } from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial, OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { PROJECTS } from '@/data/projects';
import { Project } from '@/types/project';

export function ProjectVault() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProject = useMemo(() =>
    PROJECTS.find(p => p.id === selectedId),
    [selectedId]
  );

  return (
    <div className="w-full h-full bg-[#050A14] relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        
        {/* Cinematic Camera Rig */}
        <Rig selectedProject={selectedProject} />

        {/* ENHANCED LIGHTING */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00D4FF" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />

        {/* SPATIAL HELPERS */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <gridHelper args={[40, 40, "#1A2E4A", "#0A1628"]} position={[0, -4, 0]} rotation={[Math.PI / 2, 0, 0]} />

        {/* Project Nodes */}
        {PROJECTS.map((project) => (
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

        {/* Post-Processing Layer */}
        <EffectComposer enableNormalPass={false}>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} radius={0.4} />
          <DepthOfField 
            focusDistance={0} 
            focalLength={0.02} 
            bokehScale={2} 
          />
          <Noise opacity={0.05} />
          <Vignette offset={0.1} darkness={1.1} />
        </EffectComposer>
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
                {selectedProject.techStack.map((t: string) => (
                  <span key={t} className="text-[9px] px-2 py-0.5 bg-[var(--nexus-accent)]/10 text-[var(--nexus-accent)] rounded border border-[var(--nexus-accent)]/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button className="mt-6 w-full py-2 bg-[var(--nexus-accent)] text-[#050A14] text-[10px] font-bold uppercase tracking-widest hover:bg-[#00E5FF] transition-colors rounded shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            Decrypt Archives →
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
      const t = state.clock.getElapsedTime();
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

      // Gentle floating motion
      const t = state.clock.getElapsedTime();
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
            distort={0.4}
            speed={5}
            roughness={0.2}
            metalness={0.8}
            emissive={isSelected ? "#00D4FF" : "#000000"}
            emissiveIntensity={isSelected ? 0.5 : 0}
            opacity={0.8}
            transparent
          />
        </mesh>
      </Float>

      {/* Label */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color={isSelected || hovered ? "white" : "#4A5D71"}
        font="/fonts/geist-mono/GeistMono-Variable.woff2"
        anchorX="center"
        anchorY="middle"
      >
        {project.title.toUpperCase()}
      </Text>
    </group>
  );
}
