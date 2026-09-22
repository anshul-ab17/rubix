import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Rubix — 3D Rubik's Cube Solver & Speedcubing Studio",
  description: "Optimal Kociemba Two-Phase 3D Rubik's Cube Solver, Computer Vision Scanner, and WCA Speed Timer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-blue-500 selection:text-white overflow-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
