import React from 'react';

interface ZubwareLogoProps {
  className?: string;
  size?: number;
}

export const ZubwareLogo: React.FC<ZubwareLogoProps> = ({ className = 'w-9 h-9', size }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <img
      src="/favicon.svg"
      alt="Zubware Logo"
      className={`${className} shrink-0`}
      style={style}
      aria-label="Zubware Logo"
    />
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
