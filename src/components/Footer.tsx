import React from 'react';
import { Link } from 'react-router-dom';
import { BloodBridgeLogo } from './BloodBridgeLogo';
import { Heart, PhoneCall, ShieldCheck, Mail, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { resetAllDemoData } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Emergency Action Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-red-950/70 to-slate-900 border border-red-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
              <PhoneCall className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Critical Blood Requirement in India?</h4>
              <p className="text-slate-400 text-xs mt-1 max-w-2xl leading-relaxed">
                If a patient is in immediate danger, do not wait for online donor responses. Directly contact the blood transfusion center at your hospital or dial the National Emergency Helpline 108 / 104 immediately.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:108"
              className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Call 108 (Helpline)
            </a>
            <Link
              to="/request-blood"
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-colors whitespace-nowrap"
            >
              Post Emergency Request
            </Link>
          </div>
        </div>

        {/* 4 Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/5 p-2 rounded-xl inline-block">
              <BloodBridgeLogo showTagline={true} size="md" />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              BloodBridge is an India-wide voluntary donor discovery initiative designed to bridge the critical gap between voluntary blood donors and patients undergoing medical treatments, trauma care, and surgeries.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Voluntary · Non-Commercial · Community-Driven</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider">Discovery</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/find-donors" className="hover:text-red-400 transition-colors">
                  Find Blood Donors
                </Link>
              </li>
              <li>
                <Link to="/request-blood" className="hover:text-red-400 transition-colors">
                  Request Blood
                </Link>
              </li>
              <li>
                <Link to="/become-donor" className="hover:text-red-400 transition-colors">
                  Register as a Donor
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-red-400 transition-colors">
                  Blood Compatibility Guide
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-red-400 transition-colors">
                  Donation Eligibility Checklist
                </Link>
              </li>
            </ul>
          </div>

          {/* Major Covered Cities */}
          <div className="space-y-3">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider">Major Cities</h5>
            <div className="text-xs text-slate-400 grid grid-cols-2 gap-x-2 gap-y-1.5">
              <span>Mumbai</span>
              <span>Delhi NCR</span>
              <span>Bengaluru</span>
              <span>Hyderabad</span>
              <span>Chennai</span>
              <span>Kolkata</span>
              <span>Pune</span>
              <span>Ahmedabad</span>
              <span>Jaipur</span>
              <span>Lucknow</span>
              <span>Indore</span>
              <span>Bhilwara</span>
            </div>
          </div>

          {/* Safety & Compliance */}
          <div className="space-y-3">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider">Safety & Legal</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy-terms" className="hover:text-red-400 transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy-terms" className="hover:text-red-400 transition-colors">
                  Privacy Policy & Consent
                </Link>
              </li>
              <li>
                <Link to="/privacy-terms" className="hover:text-red-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-red-400 transition-colors text-amber-300">
                  Transfusion Safety Standards
                </Link>
              </li>
              <li>
                <button
                  onClick={resetAllDemoData}
                  className="text-left text-slate-400 hover:text-white transition-colors underline decoration-slate-600 underline-offset-2"
                >
                  Reset Local Demo Data
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Medical & Prototype Disclaimer Note */}
        <div className="mt-8 pt-4 pb-4 px-5 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Demonstration Platform & Medical Protocol Advisory: </strong>
              BloodBridge is a frontend technology demonstration prototype built with mock data and browser LocalStorage. It is not an authorized blood bank or clinical laboratory. Transfusion compatibility, infection screenings, and medical authorization must strictly be performed by licensed medical officers at government-authorized blood transfusion facilities. All donor accounts and requests displayed are fictional.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 BloodBridge India. Connecting Donors. Supporting Lives.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for voluntary donors across India
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
