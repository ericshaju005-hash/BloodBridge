import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { donorService } from '../services/donorService';
import { ShieldAlert, X, Flag, Check } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { activeReportTarget, setActiveReportTarget, showToast } = useApp();
  const [reason, setReason] = useState('Inaccurate blood group or location information');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!activeReportTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullReason = `${reason}: ${details.trim() || 'No additional note'}`;

    donorService.reportDonor(activeReportTarget.id, activeReportTarget.name, fullReason);
    setSubmitted(true);
    showToast('Report submitted for administrator moderation review.', 'info');
    setTimeout(() => {
      setActiveReportTarget(null);
      setSubmitted(false);
      setDetails('');
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Flag className="w-4 h-4 text-red-600" />
            <span>Report Profile or Request</span>
          </div>
          <button
            onClick={() => setActiveReportTarget(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-xs text-slate-600">
                You are reporting: <strong className="text-slate-900">{activeReportTarget.name}</strong> ({activeReportTarget.type})
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Moderation Flag
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Inaccurate blood group or location information">
                    Inaccurate blood group or location information
                  </option>
                  <option value="Unreachable phone or inactive profile">
                    Unreachable phone or inactive profile
                  </option>
                  <option value="Commercial solicitation / charging for blood (Strictly Prohibited)">
                    Commercial solicitation / charging for blood (Prohibited)
                  </option>
                  <option value="Suspicious emergency request / invalid hospital">
                    Suspicious emergency request / invalid hospital
                  </option>
                  <option value="Other safety violation">Other safety violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide context to assist demo moderation review..."
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReportTarget(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Thank you for keeping BloodBridge safe</h4>
              <p className="text-xs text-slate-500">The report has been queued in the moderation records.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
