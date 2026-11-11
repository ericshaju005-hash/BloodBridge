import React from 'react';

interface BloodGroupBadgeProps {
  group: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showRhDetail?: boolean;
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({
  group,
  size = 'md',
  className = '',
  showRhDetail = false
}) => {
  const isRhNegative = group.includes('-');

  const sizeClasses = {
    sm: 'text-xs font-semibold px-2 py-0.5 min-w-[32px] h-6',
    md: 'text-sm font-bold px-2.5 py-1 min-w-[42px] h-8',
    lg: 'text-lg font-extrabold px-3.5 py-1.5 min-w-[54px] h-11'
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg tabular-nums tracking-tight select-none shadow-xs transition-transform ${
        isRhNegative
          ? 'bg-red-50 text-red-700 border border-red-200'
          : 'bg-red-600 text-white border border-red-700'
      } ${sizeClasses[size]} ${className}`}
      title={`${group} Blood Group ${isRhNegative ? '(Rh Negative — Rare)' : '(Rh Positive)'}`}
    >
      <span>{group}</span>
      {showRhDetail && (
        <span className={`ml-1 text-[10px] font-normal opacity-85`}>
          {isRhNegative ? 'Rh-' : 'Rh+'}
        </span>
      )}
    </div>
  );
};
