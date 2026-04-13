export interface SocialNode {
  id: string;
  platform: string;
  url: string;
  icon: string;
  color: string;
  description: string;
  isAction?: boolean; // If true, it performs an action (like copy) instead of direct link
}

export const SOCIAL_LINKS: SocialNode[] = [
  {
    id: "github",
    platform: "GITHUB",
    url: "https://github.com/Dwarika202249",
    icon: "🐙",
    color: "#A855F7",
    description: "Neural Infrastructure & Code Archives",
  },
  {
    id: "linkedin",
    platform: "LINKEDIN",
    url: "https://www.linkedin.com/in/dwarika-kumar-2266861a5",
    icon: "👔",
    color: "#0077B5",
    description: "Professional Synchronicity & Network",
  },
  {
    id: "twitter",
    platform: "TWITTER",
    url: "https://x.com/iamDC5",
    icon: "🐦",
    color: "#1DA1F2",
    description: "Real-time Signal Transmission",
  },
  {
    id: "email",
    platform: "EMAIL",
    url: "dwarika.kumar9060@gmail.com",
    icon: "📧",
    color: "#00D4FF",
    description: "Direct Encrypted Communication",
    isAction: true,
  },
];
