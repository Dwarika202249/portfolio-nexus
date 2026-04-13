'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowManager } from '@/context/WindowContext';
import { PROJECTS } from '@/data/projects';
import { cn } from '@/lib/utils/cn';

// Virtual File System Definition
const VFS: any = {
  home: {
    guest: {
      projects: {
        'codeweavers.txt': 'CodeWeavers LMS: Multi-tenant Enterprise Learning OS. Built with MERN.',
        'mockmate.txt': 'MockMate AI: Voice-First AI Interviewer using LLM chains.',
        'servicexchange.txt': 'HCL ServiceXchange: Global Service Escalation Layer.'
      },
      skills: {
        'frontend.txt': 'React, Next.js, Three.js, Tailwind, Framer Motion',
        'backend.txt': 'Node.js, Python, FastAPI, PostgreSQL, MongoDB',
        'neural.txt': 'OpenAI SDK, LangChain, Vector DBs'
      },
      'contact.txt': 'Email: contact@dwarika.nexus\nGitHub: github.com/Dwarika202249\nLinkedIn: linkedin.com/in/dwarika',
      'secret.txt': 'NEXUS_OS_ADMIN_PROTOCOL: 0x88231'
    }
  }
};

type LineType = 'command' | 'output' | 'error' | 'system' | 'header';

interface TerminalLine {
  type: LineType;
  content: string;
  path?: string;
}

export function TerminalApp() {
  const { closeWindow } = useWindowManager();
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: 'NEXUS OS [Version 1.0.0.42]' },
    { type: 'system', content: '(c) Dwarika Systems. All rights reserved.' },
    { type: 'system', content: '' },
    { type: 'system', content: 'Type "help" to see available commands.' },
    { type: 'system', content: '' }
  ]);
  const [dirStack, setDirStack] = useState(['home', 'guest']);
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const getDir = (stack: string[]) => {
    let current = VFS;
    for (const d of stack) {
      current = current[d];
    }
    return current;
  };

  const COMMANDS: Record<string, { desc: string; action: (args: string[]) => { type: LineType, content: string }[] | void }> = {
    help: {
      desc: 'Display the system manual and available commands',
      action: () => [
        { type: 'header', content: 'AVAILABLE NEURAL COMMANDS:' },
        { type: 'output', content: '  about        - Reveal system author profile' },
        { type: 'output', content: '  ls           - List directory contents' },
        { type: 'output', content: '  cd <dir>     - Navigate through the file system' },
        { type: 'output', content: '  pwd          - Print current working directory' },
        { type: 'output', content: '  cat <file>   - Read file contents' },
        { type: 'output', content: '  clear        - Purge terminal buffer' },
        { type: 'output', content: '  neofetch     - Display system identity and specs' },
        { type: 'output', content: '  status       - Check system health diagnostics' },
        { type: 'output', content: '  whoami       - Display current session identity' },
        { type: 'output', content: '  tech         - List neuro-stack dependencies' },
        { type: 'output', content: '  projects     - Summary of localized archives' },
        { type: 'output', content: '  date         - View current neural timeline' },
        { type: 'output', content: '  echo <text>  - Repeat input string' },
        { type: 'output', content: '  history      - View previous command log' },
        { type: 'output', content: '  ping <host>  - Test network latency' },
        { type: 'output', content: '  social       - Reveal neural contact links' },
        { type: 'output', content: '  matrix       - Initiate Matrix Protocol' },
        { type: 'output', content: '  diagnostics  - Run deep system check' },
        { type: 'output', content: '  reboot       - Restart system session' },
        { type: 'output', content: '  exit         - Terminate terminal process' }
      ]
    },
    ls: {
       desc: 'List contents of the current directory',
       action: () => {
         const current = getDir(dirStack);
         const content = Object.keys(current).map(k => {
            return typeof current[k] === 'object' ? `${k}/` : k;
         }).join('   ');
         return [{ type: 'output', content }];
       }
    },
    pwd: {
      desc: 'Show current working directory path',
      action: () => [{ type: 'output', content: `/${dirStack.join('/')}` }]
    },
    cd: {
      desc: 'Change directory (use .. to go back)',
      action: (args) => {
        const target = args[0];
        if (!target) return;
        if (target === '..') {
          if (dirStack.length > 0) setDirStack(dirStack.slice(0, -1));
          return;
        }
        const current = getDir(dirStack);
        if (current[target] && typeof current[target] === 'object') {
          setDirStack([...dirStack, target]);
        } else {
          return [{ type: 'error', content: `Directory not found: ${target}` }];
        }
      }
    },
    cat: {
      desc: 'Read the contents of a virtual file',
      action: (args) => {
        const target = args[0];
        if (!target) return [{ type: 'error', content: 'Usage: cat <filename>' }];
        const current = getDir(dirStack);
        if (current[target] && typeof current[target] === 'string') {
          return [{ type: 'output', content: current[target] }];
        }
        return [{ type: 'error', content: `File not found: ${target}` }];
      }
    },
    about: {
      desc: 'Show info about the author',
      action: () => [{ type: 'output', content: 'Dwarika Kumar: Elite Full-Stack Architect specialized in GenAI & Immersive Web.' }]
    },
    whoami: {
      desc: 'Display current user identity',
      action: () => [
        { type: 'output', content: 'User: guest@NEXUS_OS' },
        { type: 'output', content: 'Status: Authorized' },
        { type: 'output', content: 'Access: Virtual_Shell' }
      ]
    },
    date: {
      desc: 'Show current system date and time',
      action: () => [{ type: 'output', content: new Date().toString() }]
    },
    clear: {
      desc: 'Clear the terminal screen',
      action: () => { setLines([]); return; }
    },
    neofetch: {
      desc: 'Display system branding and specifications',
      action: () => [
        { type: 'output', content: '      .:::::.      OS: NEXUS_OS v1.0.0' },
        { type: 'output', content: '     .::...::.     Author: Dwarika Kumar' },
        { type: 'output', content: '    .::.   .::.    Shell: zsh (Neural)' },
        { type: 'output', content: '    .::.   .::.    Resolution: 1920x1080' },
        { type: 'output', content: '     .::...::.     DE: Cinematic_Glass' },
        { type: 'output', content: '      .:::::.      CPU: Nexus Core i9 (Virtual)' },
        { type: 'output', content: '                   Memory: 32000 MB / 64000 MB' }
      ]
    },
    status: {
      desc: 'Check system stability and health',
      action: () => [
        { type: 'output', content: 'SYSTEM_HEALTH: NOMINAL' },
        { type: 'output', content: 'CORE_TEMP: 42.5°C' },
        { type: 'output', content: 'PACKET_LOSS: 0.00%' },
        { type: 'output', content: 'NEURAL_LINK: STABLE' }
      ]
    },
    tech: {
      desc: 'List core technologies used in this system',
      action: () => [{ type: 'output', content: 'STACK: Next.js, Three.js, React, TypeScript, Tailwind, Framer Motion' }]
    },
    projects: {
      desc: 'List all major archives in the vault',
      action: () => PROJECTS.map(p => ({ type: 'output', content: `- ${p.title} [${p.category}]` }))
    },
    echo: {
      desc: 'Repeat back provided text',
      action: (args) => [{ type: 'output', content: args.join(' ') }]
    },
    history: {
      desc: 'Show history of entered commands',
      action: () => history.slice(-10).map(h => ({ type: 'output', content: h }))
    },
    ping: {
      desc: 'Test connection to a neural host',
      action: (args) => [
        { type: 'output', content: `PING ${args[0] || 'nexus.sys'} (127.0.0.1): 56 data bytes` },
        { type: 'output', content: '64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.04 ms' }
      ]
    },
    social: {
      desc: 'Reveal neural contact points',
      action: () => [
        { type: 'header', content: 'Neural Links:' },
        { type: 'output', content: '  > GitHub: @Dwarika202249' },
        { type: 'output', content: '  > LinkedIn: /in/dwarika' },
        { type: 'output', content: '  > Mail: contact@dwarika.nexus' }
      ]
    },
    matrix: {
      desc: 'Initiate the Matrix Protocol simulation',
      action: () => [
        { type: 'system', content: 'Wake up, Neo...' },
        { type: 'system', content: 'The Matrix has you...' },
        { type: 'system', content: 'Follow the white rabbit.' }
      ]
    },
    diagnostics: {
      desc: 'Run a deep system diagnostic sweep',
      action: () => [
        { type: 'system', content: 'Scanning neural pathways...' },
        { type: 'system', content: 'Optimizing memory buffers...' },
        { type: 'output', content: 'All systems green.' }
      ]
    },
    reboot: {
      desc: 'Restart the OS session',
      action: () => { window.location.reload(); }
    },
    exit: {
      desc: 'Terminate the current terminal process',
      action: () => { closeWindow('terminal'); }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parts = input.trim().split(' ');
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    setHistory(prev => [...prev, input]);
    
    const currentPath = `/${dirStack.join('/')}`;
    const commandLine: TerminalLine = { 
      type: 'command', 
      content: input,
      path: currentPath 
    };

    let newLines = [...lines, commandLine];

    if (COMMANDS[cmdName]) {
      const output = COMMANDS[cmdName].action(args);
      if (output) newLines = [...newLines, ...output];
    } else {
      newLines.push({ type: 'error', content: `Command not found: ${cmdName}. Type 'help' for manual.` });
    }

    if (cmdName !== 'clear') {
      setLines([...newLines, { type: 'system', content: '' }]);
    }
    setInput('');
  };

  const renderLine = (line: TerminalLine, index: number) => {
    switch (line.type) {
      case 'command':
        return (
          <div key={index} className="flex gap-2">
            <span className="text-[var(--nexus-accent)] font-bold">{line.path} $</span>
            <span className="text-white">{line.content}</span>
          </div>
        );
      case 'error':
        return <div key={index} className="text-red-400 font-medium">{line.content}</div>;
      case 'header':
        return <div key={index} className="text-[var(--nexus-accent)] font-bold tracking-widest mt-2">{line.content}</div>;
      case 'system':
        return <div key={index} className="text-[var(--nexus-success)]/60 italic">{line.content}</div>;
      case 'output':
      default:
        return <div key={index} className="text-[var(--nexus-success)]">{line.content}</div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/70 p-4 font-mono text-[12px] overflow-hidden">
      <div className="flex-1 overflow-auto space-y-1 scrollbar-thin scrollbar-thumb-white/10 pr-2">
        {lines.map((line, i) => renderLine(line, i))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="mt-2 flex gap-2 border-t border-white/10 pt-3 bg-black/20">
        <span className="text-[var(--nexus-accent)] font-bold">
            /{dirStack.join('/')} $
        </span>
        <input
          title='terminal'
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-white caret-[var(--nexus-accent)] font-medium"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}
