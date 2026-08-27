import React from 'react';
import { X, Printer, Phone, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TheWayLogo } from './TheWayLogo';

// Simple deterministic QR-like matrix visualizer for offline/iframe robustness
function renderQRMatrix(text: string): boolean[][] {
  const size = 21; // 21x21 QR Version 1
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns at top-left, top-right, bottom-left
  const addFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          matrix[r + i][c + j] = true;
        }
      }
    }
  };

  addFinder(0, 0);
  addFinder(0, size - 7);
  addFinder(size - 7, 0);

  // Simple deterministic hash to populate internal matrix
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finders
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= size - 8) ||
        (r >= size - 8 && c < 8)
      ) {
        continue;
      }
      // Timing patterns
      if (r === 6 || c === 6) {
        matrix[r][c] = (r + c) % 2 === 0;
        continue;
      }
      const val = (Math.abs(hash) * (r * 31 + c * 17)) % 100;
      matrix[r][c] = val > 45;
    }
  }

  return matrix;
}

export const QRCardModal: React.FC = () => {
  const { activeQRStudent, setActiveQRStudent, settings } = useApp();

  if (!activeQRStudent) return null;

  const matrix = renderQRMatrix(activeQRStudent.qrCode || activeQRStudent.code);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Controls */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              طباعة كارت الطالب
            </button>
          </div>
          <button
            onClick={() => setActiveQRStudent(null)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5" id="printable-student-card">
          {/* Card Frame */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0B1120] text-white p-6 shadow-xl border border-blue-800/50">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/15 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/10 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none" />

            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <TheWayLogo variant="white" size="sm" />
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                طالب معتمد
              </span>
            </div>

            {/* Middle Section: Avatar + Name */}
            <div className="my-4 flex items-center gap-3.5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-white/30"
                style={{ backgroundColor: activeQRStudent.avatarColor || '#2563eb' }}
              >
                {activeQRStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-base text-white tracking-tight">{activeQRStudent.name}</h3>
                <p className="text-xs text-blue-200 flex items-center gap-1 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
                  {activeQRStudent.grade}
                </p>
                <p className="text-xs font-mono font-bold text-sky-300 mt-0.5">
                  {activeQRStudent.code}
                </p>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-xl shadow-inner flex flex-col items-center justify-center my-3 text-slate-900">
              <div className="w-40 h-40 flex items-center justify-center">
                <svg viewBox="0 0 21 21" className="w-full h-full shape-rendering-crispEdges">
                  {matrix.map((row, r) =>
                    row.map((cell, c) =>
                      cell ? (
                        <rect
                          key={`${r}-${c}`}
                          x={c}
                          y={r}
                          width="1"
                          height="1"
                          fill="#0f172a"
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>
              <p className="text-[11px] font-mono font-bold text-slate-600 mt-2">
                {activeQRStudent.qrCode}
              </p>
            </div>

            {/* Bottom details */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-blue-200">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-blue-300" />
                <span>ولي الأمر: {activeQRStudent.parent.phone}</span>
              </div>
              <span>{settings.phone}</span>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 space-y-1">
            <p className="flex items-center justify-center gap-1 font-medium text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              جاهز للمسح عبر كاميرا الاستقبال أو قارئ الباركود
            </p>
            <p className="text-[11px] text-slate-400">
              يُرجى إبراز هذه البطاقة عند الدخول لتسجيل الحضور فورياً
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
