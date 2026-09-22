import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Rubix — 3D Rubik's Cube Solver & Scanner",
  description: "Scan your cube. Build it virtually. Solve it step by step with Kociemba's optimal two-phase algorithm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
