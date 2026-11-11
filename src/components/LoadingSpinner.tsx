import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Searching verified donor network...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-3 border-red-100 border-t-red-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-red-600" />
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
};
