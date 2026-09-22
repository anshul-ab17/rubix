'use client';

import React from 'react';
import { X, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  {
    category: 'Timer & Playback',
    items: [
      { key: 'Space', desc: 'Hold & release to start timer / Play & pause solution' },
      { key: '← / →', desc: 'Step backward / forward through solution moves' },
    ],
  },
  {
    category: '3D Layer Turns',
    items: [
      { key: 'U / Shift+U', desc: 'Up face (Clockwise / Counter-clockwise U\')' },
      { key: 'D / Shift+D', desc: 'Down face (Clockwise / Counter-clockwise D\')' },
      { key: 'F / Shift+F', desc: 'Front face (Clockwise / Counter-clockwise F\')' },
      { key: 'B / Shift+B', desc: 'Back face (Clockwise / Counter-clockwise B\')' },
      { key: 'R / Shift+R', desc: 'Right face (Clockwise / Counter-clockwise R\')' },
      { key: 'L / Shift+L', desc: 'Left face (Clockwise / Counter-clockwise L\')' },
    ],
  },
  {
    category: 'Cube Actions & Navigation',
    items: [
      { key: 'S', desc: 'Generate random WCA scramble' },
      { key: '1 / 2 / 3 / 4', desc: 'Switch between sections on mobile/tablet' },
      { key: '?', desc: 'Toggle keyboard shortcuts cheat sheet' },
      { key: 'Esc', desc: 'Close open modal or dialog' },
    ],
  },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Command className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Speed up your solving and practice workflow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of shortcuts */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {SHORTCUTS.map((section) => (
            <div key={section.category}>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {section.category}
              </h4>
              <div className="space-y-1.5">
                {section.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.desc}</span>
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs font-mono font-bold text-blue-600 dark:text-blue-300 text-[11px] shrink-0 ml-2">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
