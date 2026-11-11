import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { BLOOD_GROUPS, INDIAN_STATES } from '../data/indianLocations';
import { UserPlus, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { BloodBridgeLogo } from '../components/BloodBridgeLogo';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useApp();

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Account, Step 2: Profile Completion

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Profile completion fields
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400001');
  const [isDonor, setIsDonor] = useState(false);

  const [error, setError] = useState('');

  const handleStepOneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 4) {
      setError('Password must have at least 4 characters for this demo.');
      return;
    }

    // Move to Profile Completion
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await register({
      name,
      email,
      phone,
      password,
      bloodGroup,
      state,
      city,
      pincode,
      isDonor,
      phoneVisibility: 'request_only'
    });

    if (res.success) {
      showToast('Demo profile created successfully!', 'success');
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  const selectedStateObj = INDIAN_STATES.find((s) => s.name === state);
  const cities = selectedStateObj ? selectedStateObj.cities : [];

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-block">
          <BloodBridgeLogo showTagline={true} size="lg" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 pt-2">
          {step === 1 ? 'Create Demo Account' : 'Complete Your Profile'}
        </h1>
        <p className="text-xs text-slate-500">
          {step === 1
            ? 'Sign up to request blood or register as a voluntary donor.'
            : 'Set your blood group and location to receive matching emergency alerts.'}
        </p>
      </div>

      {/* Demo Warning */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Demonstration Storage Notice:</strong> This prototype saves credentials in LocalStorage. Never enter real sensitive banking or critical passwords.
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {step === 1 ? (
        /* STEP 1: Registration Credentials */
        <form onSubmit={handleStepOneSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rohini Sen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. rohini.sen@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98200 12345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            Continue to Profile Setup <ArrowRight className="w-4 h-4" />
          </button>

        </form>
      ) : (
        /* STEP 2: Profile Completion */
        <form onSubmit={handleFinalSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Your Blood Group
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

          <div className="grid grid-cols-2 gap-3">
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
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st.name} value={st.name}>
                    {st.name}
                  </option>
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
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
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
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PIN Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 font-mono"
            />
          </div>

          <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDonor}
                onChange={(e) => setIsDonor(e.target.checked)}
                className="rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-red-900">
                Register me as an available voluntary donor now
              </span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
            >
              Complete Registration
            </button>
          </div>

        </form>
      )}

      <div className="text-center text-xs text-slate-500">
        Already have a demo account?{' '}
        <Link to="/login" className="text-red-600 hover:text-red-700 font-bold">
          Log In
        </Link>
      </div>

    </div>
  );
};
