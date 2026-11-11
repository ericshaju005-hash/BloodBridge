import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { LogIn, ShieldAlert, KeyRound, Mail, User, Heart } from 'lucide-react';
import { BloodBridgeLogo } from '../components/BloodBridgeLogo';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, quickDemoLogin } = useAuth();
  const { showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = (location.state as any)?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      showToast('Logged in successfully (Demo Session)', 'success');
      navigate(redirectPath, { replace: true });
    } else {
      setError(res.error || 'Failed to log in');
    }
  };

  const handleQuickDemo = (role: 'patient' | 'donor') => {
    quickDemoLogin(role);
    showToast(`Logged in as demo ${role}`, 'info');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-block">
          <BloodBridgeLogo showTagline={true} size="lg" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 pt-2">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-slate-500">
          Access your donor status, patient requirements, and notifications.
        </p>
      </div>

      {/* Demo Prototype Security Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Demonstration Authentication System:</strong> This interface uses local browser storage for prototype testing. Accounts and passwords are not transmitted to or authenticated by a remote production server.
        </div>
      </div>

      {/* 1-Click Quick Demo Login Shortcuts */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          One-Click Demo Personas (Instant Access)
        </span>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleQuickDemo('patient')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center transition-all group"
          >
            <User className="w-4 h-4 text-slate-600 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 block mt-1">Patient / Requester</span>
            <span className="text-[10px] text-slate-500 block">Arjun Sharma (O+)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('donor')}
            className="p-3 rounded-xl bg-red-50/60 hover:bg-red-50 border border-red-200 text-center transition-all group"
          >
            <Heart className="w-4 h-4 text-red-600 mx-auto group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-red-700 block mt-1">Voluntary Donor</span>
            <span className="text-[10px] text-red-500 block">Pooja Deshmukh (A+)</span>
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="e.g. arjun.sharma@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Demo Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="e.g. demo123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Hint: Use <strong>demo123</strong> for test accounts or click any persona above.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <LogIn className="w-4 h-4" />
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>

      </form>

      {/* Footer Switch */}
      <div className="text-center text-xs text-slate-500">
        Don't have a demonstration account yet?{' '}
        <Link to="/register" className="text-red-600 hover:text-red-700 font-bold">
          Sign Up Here
        </Link>
      </div>

    </div>
  );
};
