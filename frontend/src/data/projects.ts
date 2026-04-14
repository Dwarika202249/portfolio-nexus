import { Project } from "@/types/project";

export const PROJECTS: Project[] = [
  {
    id: "dineos",
    title: "DineOS",
    tagline: "AI-Powered Multi-Tenant Restaurant OS",
    description:
      "A production-grade B2B2C SaaS platform for restaurant management. Features menu-aware RAG pipelines, real-time WebSocket room partitioning across 5 roles, and strict multi-tenant data isolation.",
    category: "SaaS_ARCHITECTURE",
    techStack: ["MERN", "TypeScript", "Socket.io", "Groq LLM", "RAG"],
    metrics: [
      { label: "Sync Latency", value: "<100ms" },
      { label: "AI Perceived Latency", value: "300ms" },
      { label: "Multi-Tenancy", value: "Enterprise Isolation" },
    ],
    links: {
      github: "https://github.com/Dwarika202249/restaurant-gpt",
      live: "https://dineos.netlify.app",
    },
    position: [0, 2.5, -1],
    color: "#00D4FF", // Electric Cyan
  },
  {
    id: "mockmate",
    title: "MockMate AI",
    tagline: "Intelligent Interview Simulation",
    description:
      "Personalized AI interview coach using resume-aware RAG. Implements SSE streaming for low-latency voice-to-voice interaction and rubric-based grading.",
    category: "AI_AGENTIC",
    techStack: ["React", "Node.js", "OpenAI Whisper", "LangChain", "Groq"],
    metrics: [
      { label: "Latency Reduction", value: "91%" },
      { label: "Voice Accuracy", value: "95%" },
      { label: "Context Match", value: "Resume-Aware" },
    ],
    links: {
      github: "https://github.com/Dwarika202249/MockMate",
      live: "https://mockmateio.netlify.app",
    },
    position: [-5.5, 2.5, 0],
    color: "#FF00D4", // Neon Magenta
  },
  {
    id: "codeweavers",
    title: "CodeWeavers LMS",
    tagline: "Enterprise EdTech SaaS Infrastructure",
    description:
      "LMS built for education businesses. Features complex RBAC (Admin/College/Student), automated PDF certificate generation with Puppeteer, and high-performance data grids.",
    category: "ENTERPRISE_SaaS",
    techStack: ["MERN", "TypeScript", "RBAC", "Puppeteer", "ApexCharts"],
    metrics: [
      { label: "Data Grid Spec", value: "5000+ Records" },
      { label: "Optimization", value: "Zero-Freeze Sync" },
      { label: "RBAC Logic", value: "JWT-Claim Guarded" },
    ],
    links: {
      github: "https://github.com/Dwarika202249/codeweavers-prd",
      live: "https://codeweavers-dk.vercel.app",
    },
    position: [5.5, 2.5, 0],
    color: "#00FF88", // Emerald Green
  },
  {
    id: "servicexchange",
    title: "HCL ServiceXchange",
    tagline: "Enterprise ITSM Escalation Layer",
    description:
      "Mission-critical platform for Fortune 500 incident management. Implemented real-time SLA tracking and bidirectional eBonding with ServiceNow and BMC Remedy.",
    category: "ITSM_ENTERPRISE",
    techStack: ["React", "Redux", "ServiceNow API", "Node.js"],
    metrics: [
      { label: "User Base", value: "10,000+" },
      { label: "MTTA Reduction", value: "P1 Threshold" },
      { label: "Sync Guard", value: "HMAC Webhooks" },
    ],
    links: {
      github: "https://github.com/Dwarika202249",
      live: "https://github.com/Dwarika202249",
    },
    position: [0, -2.5, 0],
    color: "#FFB300", // Electric Amber
  },
  {
    id: "sayrasphere",
    title: "SayraSphere",
    tagline: "Smart IoT Device & Sensor Management Platform",
    description:
      "A production-grade IoT management platform enabling users to monitor real-time sensor data, control remote devices, and configure automation rules. Built as a self-hosted alternative with native AI integrations.",
    category: "FULL_STACK_IOT",
    techStack: [
      "React",
      "Node.js",
      "MongoDB",
      "MQTT.js",
      "Socket.io",
      "Groq AI",
    ],
    metrics: [
      { label: "Protocol Bridge", value: "MQTT to WebSockets" },
      { label: "Rule Evaluation", value: "Async Event-Driven" },
      { label: "Real-time Sync", value: "Near-Zero Latency" },
    ],
    links: {
      github: "https://github.com/Dwarika202249/sayrasphere",
      live: "https://sayrasphere.vercel.app",
    },
    position: [-4.5, -2.5, 2],
    color: "#00FFCC", // Spring Cyan
  },
  {
    id: "nexarun",
    title: "NexaRun",
    tagline: "The infinite cyber sprint right in your browser",
    description:
      "A fast-paced, cyberpunk-themed 3D endless runner PWA. Fully offline-capable, featuring hardware-accelerated WebGL physics, sophisticated collision detection, and zero-stutter memory management.",
    category: "WEB_GAMING_PWA",
    techStack: [
      "Babylon.js",
      "TypeScript",
      "Vite",
      "IndexedDB",
      "Havok Physics",
    ],
    metrics: [
      { label: "Performance", value: "Locked 60 FPS Mobile" },
      { label: "Memory Mgt", value: "Tile Pooling Pattern" },
      { label: "Load Time", value: "< 5 Seconds" },
    ],
    links: {
      github: "https://github.com/Dwarika202249/nexarun",
      live: "https://nexarun.vercel.app",
    },
    position: [4.5, -2.5, 2],
    color: "#FF2D55", // Cyber Red
  },
  {
    id: "ghostphone",
    title: "GhostPhone (GhostNode)",
    tagline: "Advanced stealth tracking and anti-theft node",
    description:
      "A highly resilient anti-theft tracking system combining a deeply integrated Android background service with a high-throughput, asynchronous backend for real-time telemetry monitoring.",
    category: "MOBILE_SECURITY",
    techStack: [
      "Kotlin (Android)",
      "FastAPI",
      "PostgreSQL",
      "Next.js",
      "AsyncIO",
    ],
    metrics: [
      { label: "OS Integration", value: "Deep Broadcast Hooks" },
      { label: "Telemetry API", value: "High-Concurrency Async" },
      { label: "Tracking", value: "Resilient Foreground Svc" },
    ],
    links: {
      github: "https://github.com/Dwarika202249/ghostphone",
      live: "https://github.com/Dwarika202249/ghostphone",
    },
    position: [0, 0, -6],
    color: "#A020F0", // Phantom Purple
  },
];
