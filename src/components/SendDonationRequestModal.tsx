import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';
import { X, Send, Heart, Building2, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { BloodGroupBadge } from './BloodGroupBadge';

export const SendDonationRequestModal: React.FC = () => {
  const { activeDonorForRequest, setActiveDonorForRequest, showToast } = useApp();
  const { currentUser } = useAuth();

  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [requiredDate, setRequiredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [units, setUnits] = useState(1);
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Emergency'>('Urgent');
  const [contactPerson, setContactPerson] = useState(currentUser?.name || '');
  const [contactNumber, setContactNumber] = useState(currentUser?.phone || '+91 98');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState('');

  if (!activeDonorForRequest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim() || !hospitalName.trim() || !contactNumber.trim()) {
      showToast('Please fill all mandatory fields (Patient, Hospital & Contact Number)', 'error');
      return;
    }

    const newReq = requestService.createBloodRequest({
      requesterId: currentUser?.id || 'demo-guest-requester',
      patientName: patientName.trim(),
      bloodGroup: activeDonorForRequest.bloodGroup,
      units: Number(units) || 1,
      urgency,
      hospitalName: hospitalName.trim(),
      hospitalAddress: hospitalAddress.trim() || `${activeDonorForRequest.city} Hospital`,
      state: activeDonorForRequest.state,
      city: activeDonorForRequest.city,
      pincode: activeDonorForRequest.pincode,
      requiredDate,
      contactPerson: contactPerson.trim() || 'Attendant',
      contactNumber: contactNumber.trim(),
      message: message.trim() || `Request directly initiated for ${activeDonorForRequest.name}`,
      targetDonorId: activeDonorForRequest.id,
      targetDonorName: activeDonorForRequest.name,
      status: 'Pending'
    });

    setCreatedRequestId(newReq.id);
    setIsSubmitted(true);
    showToast(`Donation request ${newReq.id} sent to ${activeDonorForRequest.name}!`, 'success');
  };

  const handleClose = () => {
    setActiveDonorForRequest(null);
    setIsSubmitted(false);
    setCreatedRequestId('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-red-50/60 shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Send Donation Request to Donor
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Target Donor Snapshot */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Selected Donor
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{activeDonorForRequest.name}</h4>
                  <p className="text-xs text-slate-500">
                    {activeDonorForRequest.city}, {activeDonorForRequest.state} · Approx. {activeDonorForRequest.distanceKm ?? 12} km away
                  </p>
                </div>
                <BloodGroupBadge group={activeDonorForRequest.bloodGroup} size="lg" />
              </div>

              {/* Patient Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient or Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Verma"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Units & Urgency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Units Required
                  </label>
                  <select
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value={1}>1 Unit (PRBC / Whole Blood)</option>
                    <option value={2}>2 Units</option>
                    <option value={3}>3 Units</option>
                    <option value={4}>4+ Units (Critical)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Normal">Normal (Within 3–5 days)</option>
                    <option value="Urgent">Urgent (Within 24–48 hours)</option>
                    <option value="Emergency">Emergency (Immediate / Surgery)</option>
                  </select>
                </div>
              </div>

              {/* Hospital Details */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hospital / Blood Transfusion Facility *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KEM Hospital Blood Bank / Lilavati Hospital"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hospital Address / Ward / Room
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ICU Ward 3, 2nd Floor, Main Building"
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Date & Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Required Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Note for Donor (Doctor's advice, cross-matching note)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Doctor requested voluntary donor for elective surgery. Hospital transfusion slip verified."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Demo Notice */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Demo Workflow: This will create a locally simulated request record stored in your browser LocalStorage and trigger an in-app notification. No real SMS or cellular transmission takes place.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Demo Request
                </button>
              </div>

            </form>
          ) : (
            /* Confirmation Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Donation Request Created Successfully!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your request has been recorded under demonstration reference ID:
              </p>
              <div className="inline-block px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg font-mono font-bold text-slate-800 text-sm">
                {createdRequestId}
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                The donor's simulated dashboard has received an incoming request alert. You can track this in your <strong>User Dashboard</strong> under <em>My Blood Requests</em>.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
