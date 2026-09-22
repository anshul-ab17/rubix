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
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex flex-col bg-slate-100/70 text-slate-900 selection:bg-blue-500 selection:text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
