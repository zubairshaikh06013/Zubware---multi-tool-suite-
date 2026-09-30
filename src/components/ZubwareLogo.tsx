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
        <linearGradient id="zwTopBarGrad" x1="86" y1="84" x2="426" y2="168" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00a8ff" />
          <stop offset="40%" stopColor="#0077ff" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        <linearGradient id="zwDiagGrad" x1="380" y1="100" x2="130" y2="412" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="30%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        <linearGradient id="zwBottomBarGrad" x1="86" y1="344" x2="426" y2="428" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="60%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        <linearGradient id="zwTopFoldShadow" x1="330" y1="168" x2="260" y2="168" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0b0f3b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0b0f3b" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="zwBottomFoldShadow" x1="180" y1="344" x2="250" y2="344" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0b0f3b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0b0f3b" stopOpacity="0" />
        </linearGradient>

        <filter id="zwElevation" x="-12%" y="-12%" width="124%" height="124%">
          <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#3b82f6" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#zwElevation)">
        <path
          d="M 128 84
             L 404 84
             C 416 84 426 94 426 106
             L 426 168
             L 236 168
             L 128 168
             C 104.8 168 86 149.2 86 126
             C 86 102.8 104.8 84 128 84
             Z"
          fill="url(#zwTopBarGrad)"
        />

        <path
          d="M 426 84
             L 426 168
             L 194 428
             L 86 428
             L 86 344
             L 318 84
             Z"
          fill="url(#zwDiagGrad)"
        />

        <path
          d="M 318 84
             L 426 168
             L 370 190
             L 262 168
             Z"
          fill="url(#zwTopFoldShadow)"
        />

        <path
          d="M 86 344
             L 276 344
             L 384 344
             C 407.2 344 426 362.8 426 386
             C 426 409.2 407.2 428 384 428
             L 194 428
             L 86 428
             Z"
          fill="url(#zwBottomBarGrad)"
        />

        <path
          d="M 194 428
             L 86 344
             L 142 322
             L 250 344
             Z"
          fill="url(#zwBottomFoldShadow)"
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
