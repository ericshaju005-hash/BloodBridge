import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { donorService } from '../services/donorService';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES, BLOOD_GROUPS, BloodGroup } from '../data/indianLocations';
import { 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  MapPin, 
  Phone, 
  Eye, 
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { BloodGroupBadge } from '../components/BloodGroupBadge';

export const RegisterDonor: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [dob, setDob] = useState('1998-05-15');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 ');
  const [email, setEmail] = useState(currentUser?.email || '');
  
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400001');

  const [availability, setAvailability] = useState<'Available' | 'Temporarily Unavailable' | 'Not Currently Donating'>('Available');
  const [phoneVisibility, setPhoneVisibility] = useState<'request_only' | 'visible' | 'hidden'>('request_only');
  const [preferredContact, setPreferredContact] = useState('Phone & WhatsApp');
  const [bio, setBio] = useState('Voluntary community blood donor. Ready to assist in local hospital requirements.');

  const [consentEligibility, setConsentEligibility] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedStateObj = INDIAN_STATES.find((s) => s.name === state);
  const cities = selectedStateObj ? selectedStateObj.cities : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !pincode.trim()) {
      showToast('Please fill all mandatory fields.', 'error');
      return;
    }

    if (!consentEligibility || !consentPrivacy) {
      showToast('Please accept both donor consent checkboxes.', 'warning');
      return;
    }

    // Calculate age from DOB
    const birthYear = new Date(dob).getFullYear();
    const currentYear = 2026;
    const computedAge = Math.max(18, currentYear - birthYear);

    const newDonor = donorService.registerDonor({
      name: name.trim(),
      bloodGroup,
      gender,
      age: computedAge,
      state,
      city,
      pincode: pincode.trim(),
      phone: phone.trim(),
      email: email.trim(),
      availability,
      phoneVisibility,
      preferredContact,
      bio: bio.trim()
    });

    if (currentUser) {
      updateProfile({
        isDonor: true,
        donorId: newDonor.id,
        bloodGroup,
        state,
        city,
        pincode,
        phoneVisibility
      });
    }

    setIsSuccess(true);
    showToast('Your voluntary donor registration is recorded in LocalStorage!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
          Voluntary Contribution
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Register as a Voluntary Blood Donor
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Join thousands of compassionate donors across India. Your details are protected by donor privacy preferences.
        </p>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Blood Group Select */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Your Blood Group *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_GROUPS.map((bg) => {
                const isSelected = bloodGroup === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-3 rounded-xl font-black text-sm text-center tabular-nums transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400 ring-offset-2'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-red-50'
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              Only select if your blood group is confirmed by a previous lab or blood donation certificate.
            </p>
          </div>

          {/* Personal Info */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    max="2008-01-01" // At least 18 yrs
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

          </div>

          {/* Location Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Locality & Approximate Area
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
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  placeholder="e.g. 400001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Note: Precise residential street address is NEVER publicly published. Only your city, state, and approximate PIN code are shown to calculate travel distances.
            </p>
          </div>

          {/* Privacy & Availability Controls */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Availability & Contact Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Donor Availability Status
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Available">Available (Ready to donate when requested)</option>
                  <option value="Temporarily Unavailable">Temporarily Unavailable (Recent donation/travel)</option>
                  <option value="Not Currently Donating">Not Currently Donating (On Pause)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number Visibility Consent
                </label>
                <select
                  value={phoneVisibility}
                  onChange={(e) => setPhoneVisibility(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="request_only">Protected: Masked until verified requester confirmation</option>
                  <option value="visible">Direct: Visible to visitors with safety shield</option>
                  <option value="hidden">Hidden: In-app message requests only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Mode of Contact
              </label>
              <select
                value={preferredContact}
                onChange={(e) => setPreferredContact(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Phone & WhatsApp">Phone & WhatsApp (Fastest for emergencies)</option>
                <option value="WhatsApp">WhatsApp Message Only</option>
                <option value="Phone">Phone Calls Only</option>
                <option value="Email">Email Communication</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Short Donor Note / Bio (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Regular donor in South Mumbai. Available on weekends or urgent hospital calls."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Consents & Medical Disclaimer */}
          <div className="space-y-3 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentEligibility}
                onChange={(e) => setConsentEligibility(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                <strong>Medical Eligibility Disclaimer:</strong> I acknowledge that registering as a voluntary donor does NOT certify me as medically fit. Final eligibility (weight ≥45 kg, hemoglobin ≥12.5 g/dl, 90-day interval between donations, and infection screenings) will be conducted by hospital medical staff at the time of donation.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentPrivacy}
                onChange={(e) => setConsentPrivacy(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                <strong>Privacy & Demonstration Consent:</strong> I agree to allow BloodBridge to list my first name, blood group, and approximate city locality for voluntary donor discovery. I understand this frontend demonstration prototype saves records to browser LocalStorage.
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Heart className="w-4 h-4" />
              Register as Voluntary Donor
            </button>
          </div>

        </form>
      ) : (
        /* Success Screen */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Welcome to BloodBridge India!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Thank you, <strong>{name}</strong>. Your voluntary donor record has been registered in the demonstration directory under blood group <strong className="text-red-600">{bloodGroup}</strong> in {city}, {state}.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/find-donors"
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
            >
              View in Donor Directory
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Go to User Dashboard
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
