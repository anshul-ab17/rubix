import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Rubix — 3D Rubik's Cube Solver & Speedcubing Studio",
  description: "Optimal Kociemba Two-Phase 3D Rubik's Cube Solver, Computer Vision Scanner, and WCA Speed Timer.",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('rubix_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full flex flex-col bg-slate-100 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white overflow-hidden font-sans transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
