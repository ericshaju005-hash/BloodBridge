import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES, BLOOD_GROUPS } from '../data/indianLocations';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  Building2, 
  Calendar, 
  User, 
  Clock, 
  FileText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { BloodGroupBadge } from '../components/BloodGroupBadge';

export const RequestBlood: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useApp();

  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [units, setUnits] = useState(1);
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Emergency'>('Urgent');
  
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400012');

  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [requiredDate, setRequiredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [requiredTime, setRequiredTime] = useState('11:00');
  
  const [contactPerson, setContactPerson] = useState(currentUser?.name || '');
  const [contactNumber, setContactNumber] = useState(currentUser?.phone || '+91 ');
  const [message, setMessage] = useState('');
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState('');

  const selectedStateObj = INDIAN_STATES.find((s) => s.name === state);
  const cities = selectedStateObj ? selectedStateObj.cities : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim() || !hospitalName.trim() || !contactNumber.trim()) {
      showToast('Please fill all mandatory fields.', 'error');
      return;
    }

    if (!consentAcknowledged) {
      showToast('Please acknowledge the hospital and emergency disclaimer.', 'warning');
      return;
    }

    const newReq = requestService.createBloodRequest({
      requesterId: currentUser?.id || 'guest-requester',
      patientName: patientName.trim(),
      bloodGroup,
      units: Number(units) || 1,
      urgency,
      hospitalName: hospitalName.trim(),
      hospitalAddress: hospitalAddress.trim() || `${city} Medical Facility`,
      state,
      city,
      pincode: pincode.trim(),
      requiredDate,
      requiredTime,
      contactPerson: contactPerson.trim() || 'Attendant',
      contactNumber: contactNumber.trim(),
      message: message.trim()
    });

    setCreatedRequestId(newReq.id);
    setIsSuccess(true);
    showToast(`Request ${newReq.id} recorded in LocalStorage.`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
          Emergency & Clinical Requirement
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Post a Blood Requirement Request
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Broadcast a blood requirement to voluntary donors in your locality. All requests are saved to local demonstration storage.
        </p>
      </div>

      {/* Critical Emergency Banner */}
      <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-600 text-white rounded-xl shrink-0">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Acute Emergency Warning</h4>
            <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
              If the patient requires urgent blood within minutes, do NOT rely solely on online web platforms. Immediately contact your hospital transfusion medicine staff, blood storage center, or dial <strong>108 / 104</strong>.
            </p>
          </div>
        </div>
        <a
          href="tel:108"
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg shrink-0 whitespace-nowrap shadow-xs"
        >
          Dial 108 Emergency
        </a>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Patient Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Patient & Transfusion Requirement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Patient or Requester Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandita Bose"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Required Blood Group *
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 text-xs font-bold rounded-lg transition-all tabular-nums text-center ${
                        bloodGroup === bg
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-red-50'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Number of Units Required *
                </label>
                <select
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value={1}>1 Unit (approx. 350–450 ml)</option>
                  <option value={2}>2 Units</option>
                  <option value={3}>3 Units</option>
                  <option value={4}>4 Units (High surgical demand)</option>
                  <option value={5}>5+ Units (Trauma / Massive Transfusion)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Clinical Urgency Level *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Normal', 'Urgent', 'Emergency'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                        urgency === lvl
                          ? lvl === 'Emergency'
                            ? 'bg-red-600 text-white border-red-700'
                            : lvl === 'Urgent'
                            ? 'bg-amber-600 text-white border-amber-700'
                            : 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Hospital & Location */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Hospital & Transfusion Facility Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    const s = INDIAN_STATES.find((st) => st.name === e.target.value);
                    if (s && s.cities.length > 0) {
                      setCity(s.cities[0].name);
                      setPincode(`${s.cities[0].pincodePrefix}001`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st.name} value={st.name}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City *
                </label>
                {cities.length > 0 ? (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {cities.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 400012"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Memorial Hospital / AIIMS"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hospital Address / Department / Bed
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. E Borges Road, Parel, Ward 4"
                  value={hospitalAddress}
                  onChange={(e) => setHospitalAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date Blood is Required *
                </label>
                <input
                  type="date"
                  required
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Time
                </label>
                <input
                  type="time"
                  value={requiredTime}
                  onChange={(e) => setRequiredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

          </div>

          {/* Contact Person Details */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              3. Attendant & Contact Coordination
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Verma (Brother)"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 00000"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Clinical Message / Doctor's Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Specify condition (e.g. dengue platelet depletion, bypass surgery, thalassemia transfusion) and any specific blood bank replacement slip requirements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentAcknowledged}
                onChange={(e) => setConsentAcknowledged(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                I understand this is a demonstration request saved to local storage. BloodBridge does not verify medical eligibility or guarantee donor arrival. Transfusions and cross-matching will be strictly supervised by the hospital blood bank.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              Submit Blood Request
            </button>
          </div>

        </form>
      ) : (
        /* Confirmation Screen */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Blood Request Submitted Successfully!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Your demonstration blood request has been assigned unique identification code:
            </p>
            <div className="inline-block px-5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl font-mono text-base font-extrabold text-slate-800">
              {createdRequestId}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 max-w-xl mx-auto text-left leading-relaxed">
            <strong className="block text-amber-950 font-bold mb-1">Prototype Notice:</strong>
            This request has been added to your local browser storage and will be visible under your User Dashboard and the Administration console. In a production deployment, verified donors in {city} with matching {bloodGroup} blood would be notified via cellular SMS/WhatsApp.
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              View in My Dashboard
            </Link>

            <Link
              to="/find-donors"
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              Search Compatible Donors Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
