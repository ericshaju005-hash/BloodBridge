import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Phone, Copy, Check, MessageSquare, X, AlertTriangle } from 'lucide-react';

export const PhoneRevealModal: React.FC = () => {
  const { activeDonorForContact, setActiveDonorForContact, showToast } = useApp();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!activeDonorForContact) return null;

  const handleCopy = () => {
    if (activeDonorForContact.phone) {
      navigator.clipboard.writeText(activeDonorForContact.phone);
      setCopied(true);
      showToast('Fictional contact copied to clipboard', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setActiveDonorForContact(null);
    setRevealed(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-red-50/50">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span>Donor Contact Privacy Shield</span>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-base">
              {activeDonorForContact.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">{activeDonorForContact.name}</h4>
              <p className="text-xs text-slate-500">
                Blood Group: <strong className="text-red-600">{activeDonorForContact.bloodGroup}</strong> · {activeDonorForContact.city}, {activeDonorForContact.state}
              </p>
            </div>
          </div>

          {/* Privacy & Safety Warning */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Demonstration Contact Safety Notice:</strong>
                <p className="mt-1 text-slate-700 leading-relaxed">
                  In accordance with donor protection guidelines, phone numbers remain masked until explicit requester verification. In this frontend demonstration, this reveals a fictional sample number. In production, end-to-end backend authorization, phone OTP verification, and rate limiting protect donor privacy.
                </p>
              </div>
            </div>
          </div>

          {!revealed ? (
            <div className="pt-2 text-center">
              <button
                onClick={() => setRevealed(true)}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                I Understand & Consent to View Contact
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                Preferred communication: {activeDonorForContact.preferredContact || 'Phone & WhatsApp'}
              </p>
            </div>
          ) : (
            <div className="pt-2 space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase font-medium">Fictional Demo Number</span>
                  <span className="text-lg font-bold text-slate-900 tracking-wide font-mono">
                    {activeDonorForContact.phone}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
                  title="Copy number"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${activeDonorForContact.phone}`}
                  className="py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Donor (Demo)
                </a>
                <a
                  href={`https://wa.me/?text=Hello%20${encodeURIComponent(activeDonorForContact.name)},%20I%20found%20your%20donor%20profile%20on%20BloodBridge%20for%20blood%20group%20${activeDonorForContact.bloodGroup}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Profile Verification: Demo Verified</span>
          <button
            onClick={handleClose}
            className="font-medium hover:text-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
