import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { BLOOD_GROUPS, INDIAN_STATES } from '../data/indianLocations';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bloodGroup, setBloodGroup] = useState(currentUser?.bloodGroup || 'O+');
  const [state, setState] = useState(currentUser?.state || 'Maharashtra');
  const [city, setCity] = useState(currentUser?.city || 'Mumbai');
  const [pincode, setPincode] = useState(currentUser?.pincode || '400001');
  const [phoneVisibility, setPhoneVisibility] = useState(currentUser?.phoneVisibility || 'request_only');
  const [bio, setBio] = useState(currentUser?.bio || '');

  // Password update form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');

  if (!currentUser) return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile({
      name,
      phone,
      bloodGroup,
      state,
      city,
      pincode,
      phoneVisibility: phoneVisibility as any,
      bio
    });

    if (res.success) {
      showToast('Profile information successfully updated in LocalStorage.', 'success');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    if (newPass.length < 4) {
      setPassError('Password must be at least 4 characters for this demo.');
      return;
    }

    const res = authService.updatePassword(currentUser.id, currentPass, newPass);
    if (res.success) {
      showToast('Demo account password changed successfully.', 'success');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassError(res.error || 'Failed to update password');
    }
  };

  const selectedStateObj = INDIAN_STATES.find((s) => s.name === state);
  const cities = selectedStateObj ? selectedStateObj.cities : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
          Personal Preferences
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          My Account & Privacy Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your volunteer credentials, location, and contact visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Profile Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 self-start">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white font-extrabold flex items-center justify-center text-3xl shadow-sm mb-3">
              {currentUser.name.charAt(0)}
            </div>
            <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
            <div className="mt-3">
              <BloodGroupBadge group={currentUser.bloodGroup} size="lg" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs space-y-2 text-slate-600">
            <div className="flex items-center justify-between">
              <span>Account Role:</span>
              <span className="font-bold text-slate-900 capitalize">{currentUser.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Location:</span>
              <span className="font-medium text-slate-900">{currentUser.city}, {currentUser.state}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Phone Shield:</span>
              <span className="font-medium text-red-700 capitalize">{currentUser.phoneVisibility || 'Shielded'}</span>
            </div>
          </div>
        </div>

        {/* Right Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Edit Details */}
          <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Update Profile Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st.name} value={st.name}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City
                </label>
                {cities.length > 0 ? (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    {cities.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Visibility Preference
              </label>
              <select
                value={phoneVisibility}
                onChange={(e) => setPhoneVisibility(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
              >
                <option value="request_only">Shielded: Requester must confirm consent before viewing</option>
                <option value="visible">Public: Visible on card with safety dialog</option>
                <option value="hidden">Hidden: In-app requests only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Donor Bio / Description
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Save Profile Updates
            </button>
          </form>

          {/* Change Demo Password */}
          <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Update Demo Password
            </h3>

            {passError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {passError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Demo Password
              </label>
              <input
                type="password"
                required
                placeholder="Current demo password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="New demo password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Update Password
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
