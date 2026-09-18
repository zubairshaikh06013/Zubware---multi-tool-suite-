import React from 'react';

interface ZubwareLogoProps {
  className?: string;
  size?: number;
}

export const ZubwareLogo: React.FC<ZubwareLogoProps> = ({ className = 'w-9 h-9', size }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
      style={style}
      aria-label="Zubware Logo"
    >
      <defs>
        <linearGradient id="zwTopBarGrad" x1="90" y1="80" x2="435" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0077ff" />
          <stop offset="35%" stopColor="#1a56eb" />
          <stop offset="70%" stopColor="#6722e6" />
          <stop offset="100%" stopColor="#8b2cf5" />
        </linearGradient>

        <linearGradient id="zwDiagGrad" x1="390" y1="160" x2="110" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1639a0" />
          <stop offset="25%" stopColor="#1d4ed8" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#00a8ff" />
        </linearGradient>

        <linearGradient id="zwBottomBarGrad" x1="120" y1="360" x2="445" y2="390" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0099ff" />
          <stop offset="38%" stopColor="#2d5cf6" />
          <stop offset="75%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a224f8" />
        </linearGradient>

        <linearGradient id="zwTopFoldShadow" x1="375" y1="150" x2="280" y2="235" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#080424" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#14083c" stopOpacity="0.75" />
          <stop offset="85%" stopColor="#160840" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#160840" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="zwBottomFoldShadow" x1="175" y1="310" x2="265" y2="375" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06031f" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#120638" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#120638" stopOpacity="0" />
        </linearGradient>

        <filter id="zwElevation" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#3b82f6" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#zwElevation)">
        {/* Bottom Horizontal Arm with Angled Terminal */}
        <path
          d="M 170 336 
             L 378 336 
             C 388 336 397 341 403 349 
             L 444 407 
             C 449 414 444 424 436 424 
             L 186 424 
             C 138 424 100 386 100 338 
             C 100 318 107 300 119 285 
             L 170 336 
             Z"
          fill="url(#zwBottomBarGrad)"
        />

        {/* Bottom Fold Shadow */}
        <path
          d="M 160 330 
             L 282 336 
             L 225 424 
             L 165 415 
             Z"
          fill="url(#zwBottomFoldShadow)"
        />

        {/* Diagonal Middle Ribbon & Bottom Loop */}
        <path
          d="M 390 156 
             L 198 358 
             C 168 390 120 388 100 354 
             C 88 330 96 298 122 268 
             L 318 64 
             C 346 36 396 56 396 96 
             L 390 156 
             Z"
          fill="url(#zwDiagGrad)"
        />

        {/* Top-Right Fold Shadow */}
        <path
          d="M 280 152 
             L 396 152 
             L 315 240 
             L 245 208 
             Z"
          fill="url(#zwTopFoldShadow)"
        />

        {/* Top Horizontal Bar with Rounded Left Tip */}
        <path
          d="M 142 152 
             C 118 152 98 132 98 108 
             C 98 84 118 64 142 64 
             L 376 64 
             C 405 64 428 87 428 116 
             C 428 129 423 142 414 151 
             L 364 202 
             L 288 202 
             L 336 152 
             Z"
          fill="url(#zwTopBarGrad)"
        />
      </g>
    </svg>
  );
};

export const ZubwareWordmark: React.FC<{
  className?: string;
  subtitleClassName?: string;
  showSubtitle?: boolean;
}> = ({
  className = 'text-[22px]',
  subtitleClassName = 'text-[9px]',
  showSubtitle = true,
}) => {
  return (
    <div className="flex flex-col justify-center select-none">
      <span className={`font-brand font-[850] leading-none tracking-[-0.035em] text-slate-900 dark:text-white ${className}`}>
        Zubware
      </span>
      {showSubtitle && (
        <span className={`font-brand-sub font-bold text-slate-500 dark:text-slate-400 tracking-[0.24em] uppercase leading-none mt-1 ${subtitleClassName}`}>
          Multi Tool Suite
        </span>
      )}
    </div>
  );
};


