import React from 'react';

interface TheWayLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  showText?: boolean;
  showSlogan?: boolean;
  variant?: 'light' | 'dark' | 'white' | 'glass';
  animated?: boolean;
  customSizeClass?: string;
}

export const TheWayLogo: React.FC<TheWayLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showSlogan = true,
  variant = 'light',
  animated = true,
  customSizeClass = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-9 h-9', text: 'text-sm sm:text-base', sub: 'text-[9px]' },
    md: { icon: 'w-11 h-11', text: 'text-base sm:text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-lg sm:text-xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-2xl sm:text-3xl', sub: 'text-xs sm:text-sm' },
    '2xl': { icon: 'w-24 h-24 sm:w-28 sm:h-28', text: 'text-3xl sm:text-4xl', sub: 'text-xs sm:text-sm' },
    custom: { icon: customSizeClass || 'w-11 h-11', text: 'text-lg', sub: 'text-xs' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const isWhite = variant === 'white';
  const isDark = variant === 'dark';

  return (
    <div
      className={`inline-flex items-center gap-3.5 select-none ${
        animated ? 'group cursor-pointer' : ''
      } ${className}`}
      dir="rtl"
    >
      {/* High-Contrast Dynamic Vector Emblem with Glow Halo */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Animated Glow Aura */}
        <div
          className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-400 to-indigo-600 blur-md opacity-40 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none ${
            animated ? 'animate-pulse' : ''
          }`}
        />

        {/* Outer Hex/Rounded Emblem Container with High-Contrast Background */}
        <div
          className={`relative ${currentSize.icon} rounded-2xl bg-gradient-to-br from-[#0B1528] via-[#102446] to-[#080E1C] p-1.5 flex items-center justify-center border-2 border-blue-500/40 shadow-xl shadow-blue-950/50 transition-transform duration-300 ${
            animated ? 'group-hover:scale-105 group-hover:border-sky-400' : ''
          }`}
        >
          {/* Internal SVG vector of THE WAY stylized logo */}
          <svg
            viewBox="0 0 500 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_2px_8px_rgba(56,189,248,0.5)]"
          >
            <defs>
              <linearGradient id="tw-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="45%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>

              <linearGradient id="tw-swoosh-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>

              <linearGradient id="tw-circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              <filter id="tw-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stylized geometric "W" pillars */}
            <path
              d="M100 150 H165 L215 365 H155 Z"
              fill="url(#tw-blue-grad)"
              stroke="#93C5FD"
              strokeWidth="4"
            />
            <path
              d="M225 150 H285 L320 300 L275 365 Z"
              fill="url(#tw-blue-grad)"
              stroke="#93C5FD"
              strokeWidth="4"
            />
            <path
              d="M275 150 H345 L415 365 H350 Z"
              fill="url(#tw-blue-grad)"
              stroke="#93C5FD"
              strokeWidth="4"
            />

            {/* THE circular badge */}
            <circle
              cx="75"
              cy="235"
              r="40"
              fill="url(#tw-circle-grad)"
              stroke="#38BDF8"
              strokeWidth="6"
            />
            <text
              x="75"
              y="245"
              fontFamily="'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif"
              fontSize="24"
              fontWeight="900"
              fill="#FFFFFF"
              textAnchor="middle"
              letterSpacing="1"
            >
              THE
            </text>

            {/* Dynamic Upward Arc / Pathway to Success */}
            <path
              d="M25 255 C 50 340, 210 335, 435 60 L 458 82 C 220 365, 38 350, 25 255 Z"
              fill="url(#tw-swoosh-grad)"
              filter="url(#tw-glow-filter)"
            />

            {/* Arrow Tip with Golden Accent Sparkle */}
            <polygon points="488,18 420,55 450,82" fill="#38BDF8" />
            <polygon points="488,18 448,78 438,68" fill="#FACC15" />
          </svg>
        </div>
      </div>

      {/* Dynamic Typography with High-Legibility Contrast & Vitality */}
      {showText && (
        <div className="flex flex-col text-right leading-tight justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight font-sans ${currentSize.text} ${
                isWhite
                  ? 'text-white'
                  : isDark
                  ? 'text-slate-100'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              THE WAY{' '}
              <span className="bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 bg-clip-text text-transparent font-black drop-shadow-xs">
                CENTER
              </span>
            </span>
          </div>

          {showSlogan && (
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`font-bold tracking-wide ${currentSize.sub} ${
                  isWhite
                    ? 'text-sky-300'
                    : isDark
                    ? 'text-sky-400'
                    : 'text-blue-600 dark:text-sky-400'
                }`}
              >
                YOUR WAY TO SUCCESS
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">•</span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                مركز ذا واي التعليمي
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
