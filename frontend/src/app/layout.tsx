import type { Metadata } from "next";
import "./globals.css";
import { BootProvider } from "@/context/BootContext";
import { NeuralProvider } from "@/context/NeuralContext";

export const metadata: Metadata = {
  title: 'NEXUS // Dwarika Kumar - Elite Full-Stack & AI Architect',
  description: 'Experience the next generation of professional portfolios. Explore the neural archives and specialized AI modules of Dwarika Kumar.',
  keywords: ['Full-Stack Developer', 'AI Architect', 'Next.js', 'React', 'Three.js', 'Portfolio OS'],
  openGraph: {
    title: 'NEXUS // Dwarika Kumar',
    description: 'Advanced Portfolio Operating System',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-[#00D4FF] selection:text-[#050A14]" suppressHydrationWarning>
        <NeuralProvider>
          <BootProvider>
            {children}
          </BootProvider>
        </NeuralProvider>
      </body>
    </html>
  );
}
