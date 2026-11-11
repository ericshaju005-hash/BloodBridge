import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isLink?: boolean;
}

export const BloodBridgeLogo: React.FC<LogoProps> = ({
  showTagline = false,
  size = 'md',
  className = '',
  isLink = true
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom BloodBridge Icon: Blood Drop infused with interconnected bridge arch & life pulses */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white shadow-sm shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          {/* Blood Drop Silhouette */}
          <path
            d="M18 4C18 4 9 14.5 9 22C9 26.9706 13.0294 31 18 31C22.9706 31 27 26.9706 27 22C27 14.5 18 4 18 4Z"
            fill="currentColor"
            opacity="0.95"
          />
          {/* Bridge Arch Connection inside Drop */}
          <path
            d="M12.5 24C14 20.5 22 20.5 23.5 24"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Central Donor-to-Recipient Node / Pulse */}
          <circle cx="18" cy="18" r="2.2" fill="#FFFFFF" />
          {/* Bridge Suspension Connectors */}
          <line x1="15" y1="21" x2="15" y2="24" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="21" y1="21" x2="21" y2="24" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-extrabold tracking-tight text-slate-900 leading-none ${textSizes[size]}`}>
          Blood<span className="text-red-600">Bridge</span>
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 tracking-normal mt-0.5 whitespace-nowrap">
            Connecting Donors. Supporting Lives.
          </span>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link to="/" className="inline-flex items-center hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
