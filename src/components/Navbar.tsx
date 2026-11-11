import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BloodBridgeLogo } from './BloodBridgeLogo';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { SupabaseModal } from './SupabaseModal';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  RotateCcw,
  Database
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { currentUser, logout, quickDemoLogin } = useAuth();
  const { resetAllDemoData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(isSupabaseConfigured());

  useEffect(() => {
    const handleUpdate = () => {
      setIsDbConnected(isSupabaseConfigured());
    };
    window.addEventListener('bloodbridge_storage_update', handleUpdate);
    return () => window.removeEventListener('bloodbridge_storage_update', handleUpdate);
  }, []);

  const navLinks = [
    { label: 'Find Donors', path: '/find-donors' },
    { label: 'Request Blood', path: '/request-blood' },
    { label: 'Become a Donor', path: '/become-donor' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About', path: '/about' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 h-18">
            
            {/* Zone 1: Single text element wordmark */}
            <div className="shrink-0">
              <BloodBridgeLogo showTagline={false} size="md" />
            </div>

            {/* Zone 2: 4-5 clean single-line text navigation links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`whitespace-nowrap transition-colors hover:text-red-600 ${
                    isActive(link.path)
                      ? 'text-red-600 font-semibold underline underline-offset-8 decoration-2 decoration-red-600'
                      : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Zone 3: 1 primary action or user session dropdown */}
            <div className="flex items-center gap-3 shrink-0">
              
              {/* Database Connection Pill */}
              <button
                type="button"
                onClick={() => setSupabaseModalOpen(true)}
                title={isDbConnected ? 'Connected to Supabase PostgreSQL' : 'Click to connect your Supabase database or copy setup SQL'}
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isDbConnected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Database className={`w-3.5 h-3.5 ${isDbConnected ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{isDbConnected ? 'DB: Supabase Live' : 'DB: Local Demo (Click to link)'}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              </button>

              {/* Notification Bell */}
              <NotificationBell />

              {/* If Logged In */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 border border-red-200 text-red-700 font-bold flex items-center justify-center text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[110px]">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-slate-500 capitalize">
                        {currentUser.role}
                      </span>
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        User Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>

                      <button
                        onClick={() => setSupabaseModalOpen(true)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                      >
                        <Database className="w-4 h-4 text-slate-400" />
                        Supabase Database Setup
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={resetAllDemoData}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-slate-400" />
                        Reset Demo Data
                      </button>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* If Not Logged In */
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-red-600 transition-colors whitespace-nowrap"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-xs whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Quick Demo Switcher helper */}
              <div className="hidden xl:flex items-center pl-2 border-l border-slate-200">
                <button
                  onClick={() => quickDemoLogin(currentUser?.role === 'donor' ? 'patient' : 'donor')}
                  title="Switch demo profile persona: Patient (Recipient) or Donor"
                  className="text-[11px] font-medium text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  Role: <span className="font-bold text-red-600 capitalize">{currentUser?.role === 'donor' ? 'Donor' : 'Patient'}</span>
                </button>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-red-50 text-red-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {currentUser && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  Dashboard
                </Link>
              )}
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSupabaseModalOpen(true);
                }}
                className="text-xs text-slate-700 font-medium py-1.5 flex items-center gap-2"
              >
                <Database className="w-4 h-4 text-slate-400" />
                {isDbConnected ? 'Supabase Database (Connected)' : 'Connect Supabase Database'}
              </button>

              <button
                onClick={() => {
                  resetAllDemoData();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo Records
              </button>
              {currentUser && (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-medium text-left py-1"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Supabase Connection Modal */}
      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        onConnectedChange={(connected) => setIsDbConnected(connected)}
      />
    </>
  );
};
