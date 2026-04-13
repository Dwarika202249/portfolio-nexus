import type { Metadata } from "next";
import "./globals.css";
import { BootProvider } from "@/context/BootContext";

export const metadata: Metadata = {
  title: "Dwarika Kumar — Full Stack & GenAI Engineer",
  description: "NEXUS v1.0.0 — Portfolio of Dwarika Kumar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-[#00D4FF] selection:text-[#050A14]" suppressHydrationWarning>
        <BootProvider>
          {children}
        </BootProvider>
      </body>
    </html>
  );
}
