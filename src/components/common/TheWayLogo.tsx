import React from 'react';

interface TheWayLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero' | 'custom';
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
    sm: { icon: 'w-10 h-10', text: 'text-sm sm:text-base', sub: 'text-[9px]' },
    md: { icon: 'w-12 h-12', text: 'text-base sm:text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-16 h-16', text: 'text-lg sm:text-xl', sub: 'text-xs' },
    xl: { icon: 'w-24 h-24', text: 'text-2xl sm:text-3xl', sub: 'text-xs sm:text-sm' },
    '2xl': { icon: 'w-28 h-28 sm:w-32 sm:h-32', text: 'text-3xl sm:text-4xl', sub: 'text-xs sm:text-sm' },
    hero: { icon: 'w-36 h-36 sm:w-44 sm:h-44', text: 'text-3xl sm:text-4xl', sub: 'text-sm sm:text-base' },
    custom: { icon: customSizeClass || 'w-12 h-12', text: 'text-lg', sub: 'text-xs' }
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
      {/* Authentic Vector Logo Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Soft Ambient Glow */}
        <div
          className={`absolute -inset-2 rounded-3xl bg-blue-400/20 blur-md transition-all duration-300 pointer-events-none ${
            animated ? 'group-hover:bg-blue-500/30' : ''
          }`}
        />

        {/* Clean Light Card for the Logo Icon */}
        <div
          className={`relative ${currentSize.icon} rounded-2xl bg-gradient-to-b from-white to-[#F0F6FC] p-1.5 flex items-center justify-center border border-blue-100 dark:border-slate-700 shadow-md shadow-blue-900/5 transition-transform duration-300 ${
            animated ? 'group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/15' : ''
          }`}
        >
          <svg
            viewBox="0 0 800 650"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="comp-wLeftArm" x1="0%" y1="0%" x2="70%" y2="100%">
                <stop offset="0%" stopColor="#00A2F8" />
                <stop offset="35%" stopColor="#0080DE" />
                <stop offset="100%" stopColor="#004D99" />
              </linearGradient>

              <linearGradient id="comp-wMainBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0070CE" />
                <stop offset="40%" stopColor="#044E9B" />
                <stop offset="100%" stopColor="#012C63" />
              </linearGradient>

              <radialGradient id="comp-theSphere" cx="35%" cy="32%" r="65%">
                <stop offset="0%" stopColor="#00B0FF" />
                <stop offset="25%" stopColor="#007BDB" />
                <stop offset="65%" stopColor="#00458F" />
                <stop offset="100%" stopColor="#012454" />
              </radialGradient>

              <linearGradient id="comp-swooshGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0077D6" />
                <stop offset="45%" stopColor="#0088E8" />
                <stop offset="85%" stopColor="#149DF6" />
                <stop offset="100%" stopColor="#0072CE" />
              </linearGradient>

              <linearGradient id="comp-arrowTopFacet" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#007FDE" />
                <stop offset="100%" stopColor="#26B4FF" />
              </linearGradient>

              <linearGradient id="comp-arrowBottomFacet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0058A8" />
                <stop offset="100%" stopColor="#013673" />
              </linearGradient>
            </defs>

            <g transform="translate(40, 20)">
              {/* MAIN 'W' LETTER */}
              <polygon points="175,170 258,170 318,440 242,440" fill="url(#comp-wLeftArm)" />
              <polygon points="325,170 405,170 445,345 390,440 338,440" fill="url(#comp-wMainBody)" />
              <polygon points="405,170 560,170 485,440 400,440" fill="url(#comp-wMainBody)" />

              {/* "THE" 3D SPHERE */}
              <circle cx="140" cy="275" r="48" fill="url(#comp-theSphere)" />
              <ellipse cx="126" cy="254" rx="16" ry="10" fill="#FFFFFF" opacity="0.4" transform="rotate(-25 126 254)" />
              <text
                x="140"
                y="286"
                fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
                fontSize="28"
                fontWeight="900"
                fill="#FFFFFF"
                textAnchor="middle"
                letterSpacing="1"
              >
                THE
              </text>

              {/* SWOOP ARC & ARROW */}
              <path
                d="M 80,295 C 85,365 185,395 305,330 C 400,278 495,175 605,80 L 595,70 C 480,170 385,270 295,320 C 185,375 98,350 92,295 Z"
                fill="url(#comp-swooshGrad)"
              />
              <path d="M 295,320 L 605,80 L 600,72 L 290,312 Z" fill="#0060BA" />

              {/* 3D Arrowhead */}
              <polygon points="655,30 575,70 605,115" fill="url(#comp-arrowTopFacet)" />
              <polygon points="655,30 605,115 595,85" fill="url(#comp-arrowBottomFacet)" />
            </g>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-right leading-tight justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight font-sans ${currentSize.text} ${
                isWhite
                  ? 'text-white'
                  : isDark
                  ? 'text-slate-100'
                  : 'text-[#001F45] dark:text-white'
              }`}
            >
              The Way{' '}
              <span className="text-[#0080DE] dark:text-sky-400 font-black">
                Center
              </span>
            </span>
          </div>

          {showSlogan && (
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`font-bold tracking-wide ${currentSize.sub} ${
                  isWhite
                    ? 'text-sky-200'
                    : isDark
                    ? 'text-sky-400'
                    : 'text-[#004D99] dark:text-sky-300'
                }`}
              >
                Your Way To Success
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">•</span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                The Way Training Center
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
