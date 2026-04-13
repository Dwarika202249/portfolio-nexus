import { Project } from '@/types/project';

export const PROJECTS: Project[] = [
  {
    id: 'codeweavers',
    title: 'CodeWeavers LMS',
    tagline: 'Multi-tenant Enterprise Learning OS',
    description: 'A robust educational platform built with MERN & TypeScript. Features complex Role-Based Access Control (RBAC), automated certificate generation, and deep progress analytics.',
    category: 'FULLSTACK',
    techStack: ['MERN', 'TypeScript', 'RBAC', 'ApexCharts', 'PDFKit'],
    metrics: [
      { label: 'Role Types', value: 'Admin/College/Student' },
      { label: 'Record Capacity', value: '5000+' }
    ],
    position: [-2, 1, 0]
  },
  {
    id: 'mockmate',
    title: 'MockMate AI',
    tagline: 'Voice-First AI Interviewer',
    description: 'Revolutionizing technical recruitment with real-time AI agents. Uses Whisper for transcription and custom LLM chains to evaluate candidate logic in real-time.',
    category: 'AI_ML',
    techStack: ['Python', 'OpenAI', 'Whisper', 'FastAPI', 'React'],
    metrics: [
      { label: 'Latency', value: '<800ms' },
      { label: 'Accuracy', value: '94%' }
    ],
    position: [0, 2, -1]
  },
  {
    id: 'servicexchange',
    title: 'HCL ServiceXchange',
    tagline: 'Global Service Escalation Layer',
    description: 'Mission-critical platform for managing B2B service escalations. Implements complex workflow state-machines and real-time behavioral analytics for SLA compliance.',
    category: 'FULLSTACK',
    techStack: ['Next.js', 'Redux', 'Spring Boot', 'Oracle'],
    metrics: [
      { label: 'SLA Improvement', value: '40%' },
      { label: 'User Rating', value: '4.8/5' }
    ],
    position: [2, 1, 0]
  }
];
