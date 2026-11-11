import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Building2, 
  Award, 
  Compass, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { BloodBridgeLogo } from '../components/BloodBridgeLogo';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest block">
            Our Mission & Commitment
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Connecting Willing Donors. Supporting Fragile Lives.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every two seconds, someone in India needs blood. Surgery patients, accident victims, mothers with postpartum hemorrhage, and children battling thalassemia require timely transfusions. BloodBridge is designed to make voluntary blood donor discovery immediate, transparent, and dignified.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              to="/find-donors"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Explore Donors
            </Link>
            <Link
              to="/become-donor"
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
            >
              Join Network
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src="/src/assets/images/about_medical_team_1794204453675.jpg"
              alt="Medical and donor care team discussing voluntary transfusion protocols in India"
              referrerPolicy="no-referrer"
              className="w-full h-80 object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
            Guiding Values
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Principles Governing BloodBridge
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Strictly Non-Commercial</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We stand firmly behind the Supreme Court of India and National Blood Transfusion Council regulations: blood donation must be 100% voluntary and unpaid. Remuneration of any kind is strictly prohibited.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Privacy by Architecture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donors give freely of themselves, and their personal data must be respected. We never publish precise residential street addresses, and phone contacts remain masked behind explicit consent shields.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Clinical Safety First</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We are a discovery directory, not a clinical blood bank. All physical testing, compatibility cross-matching, and transfusion monitoring must occur under certified medical officers at authorized blood centers.
            </p>
          </div>

        </div>
      </section>

      {/* Prototype & Future Architecture Note */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-100 text-red-700 rounded-xl">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Frontend Prototype & Future Production Roadmap
            </h3>
            <p className="text-xs text-slate-500">
              Built for rapid evaluation with a modular service layer ready for real backend integration.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          BloodBridge is currently running as a comprehensive frontend demonstration powered by browser LocalStorage and modular JavaScript/TypeScript services (<code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">authService</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">donorService</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">requestService</code>). When scaling to nationwide production, these services seamlessly connect with a Supabase or PostgreSQL backend, Aadhaar/DigiLocker verification, and hospital E-Rakt Kosh API integrations without rewriting the presentation layer.
        </p>

        <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-red-600">
          <Link to="/how-it-works" className="hover:underline flex items-center gap-1">
            Review Medical Guidelines <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/privacy-terms" className="hover:underline flex items-center gap-1 text-slate-600">
            Review Privacy Terms <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
};
