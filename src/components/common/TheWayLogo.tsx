import React from 'react';

interface TheWayLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showText?: boolean;
  showSlogan?: boolean;
  variant?: 'light' | 'dark' | 'white';
}

export const TheWayLogo: React.FC<TheWayLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showSlogan = true,
  variant = 'light'
}) => {
  const sizeMap = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
    custom: ''
  };

  const isDark = variant === 'dark';
  const isWhite = variant === 'white';

  const textColor = isWhite ? 'text-white' : isDark ? 'text-slate-100' : 'text-[#1E3A8A]';
  const sloganColor = isWhite ? 'text-blue-200' : isDark ? 'text-blue-300' : 'text-slate-500';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Vector Logo Graphic */}
      <div className={`relative aspect-[1.1/1] shrink-0 ${sizeMap[size] || 'h-10'}`}>
        <svg
          viewBox="0 0 500 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto drop-shadow-sm"
        >
          <defs>
            <linearGradient id="logo-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="35%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="logo-arrow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="70%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Letter W segments */}
          <path d="M100 160 H165 L215 365 H155 Z" fill="url(#logo-blue-grad)" />
          <path d="M225 160 H285 L320 300 L275 365 Z" fill="url(#logo-blue-grad)" />
          <path d="M275 160 H345 L415 365 H350 Z" fill="url(#logo-blue-grad)" />

          {/* THE circle badge on the left */}
          <circle cx="70" cy="245" r="36" fill="url(#logo-blue-grad)" />
          <text
            x="70"
            y="253"
            fontFamily="'Segoe UI', 'Cairo', Arial, sans-serif"
            fontSize="21"
            fontWeight="900"
            fill="#FFFFFF"
            textAnchor="middle"
            letterSpacing="1"
          >
            THE
          </text>

          {/* Upward dynamic swooshing arc */}
          <path
            d="M20 260 C 45 330, 200 325, 435 65 L 455 85 C 220 355, 35 340, 20 260 Z"
            fill="url(#logo-arrow-grad)"
          />

          {/* Sleek Arrow Tip pointing to upper right */}
          <polygon points="485,20 420,60 450,85" fill="#2563EB" />
          <polygon points="485,20 445,80 435,70" fill="#1E3A8A" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-tight">
          <span className={`font-black tracking-tight text-base sm:text-lg ${textColor}`}>
            The Way <span className="text-blue-500 font-extrabold">Center</span>
          </span>
          {showSlogan && (
            <span className={`text-[10px] sm:text-[11px] font-semibold tracking-wider ${sloganColor}`}>
              Your Way To Success
            </span>
          )}
        </div>
      )}
    </div>
  );
};
