import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, X, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MedicalDisclaimerBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-slate-800 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-[11px] shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            Medical Safety & Demo Prototype
          </span>
          <span className="text-slate-700 line-clamp-1 md:line-clamp-none">
            BloodBridge is a voluntary discovery platform, not a blood bank. In acute medical emergencies, immediately contact hospital staff or call emergency services.
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-red-700">
            <PhoneCall className="w-3 h-3 text-red-600 animate-pulse" />
            <span>National Emergency: 108 / 104</span>
          </div>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <Link
            to="/how-it-works"
            className="text-slate-600 hover:text-red-600 font-medium underline underline-offset-2 whitespace-nowrap"
          >
            Safety Guidelines
          </Link>
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss disclaimer banner"
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-amber-200/50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
