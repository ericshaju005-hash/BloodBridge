import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Heart, 
  PhoneCall, 
  ArrowRight,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { BLOOD_GROUPS, BLOOD_COMPATIBILITY } from '../data/indianLocations';
import { BloodGroupBadge } from '../components/BloodGroupBadge';

export const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest block">
          Transparent Coordination Protocols
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          How BloodBridge Connects Donors & Supports Lives
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          BloodBridge is a voluntary discovery directory. Learn how the process works from discovery to certified hospital transfusion in India.
        </p>
      </div>

      {/* 4 Step Visual Workflow */}
      <section className="space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">
          The 4-Step Voluntary Discovery Pathway
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-extrabold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">Register as a Voluntary Donor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Volunteers sign up with their blood group, city, state, and approximate PIN code. You set your availability status (Available, Temporarily Unavailable, Not Donating) and privacy preference so your personal phone is never indiscriminately published.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-extrabold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">Search & Discover Verified Donors</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a medical necessity arises, patients, relatives, or social workers filter the directory by blood group, state, city, and approximate distance. Results display compatibility badges and distance calculations without exposing exact residential addresses.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-extrabold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">Initiate Request with Privacy Shield</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Requesters send a direct donation requirement outlining the hospital, patient name, and units required. Alternatively, after viewing a privacy warning, the requester can reveal the donor's contact to coordinate timing.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base">Coordinate at a Licensed Blood Bank</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All actual blood collections strictly happen at government-licensed blood transfusion banks or hospital transfusion medicine departments. Qualified medical officers verify donor fitness, perform cross-matching, and manage safe donation.
            </p>
          </div>

        </div>
      </section>

      {/* Donor Eligibility Checklist */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
            National Blood Transfusion Guidelines (NBTC India)
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            General Voluntary Donor Eligibility Criteria
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Blood donation is simple and safe, but medical criteria must be met at the time of clinical evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Age: 18 to 65 Years
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Must be at least 18 years of age. Healthy repeat donors may donate up to 65 years with medical physician clearance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Weight: Minimum 45 kg
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Donors weighing ≥45 kg can safely donate 350 ml of blood. For a 450 ml collection, donor weight should be ≥55 kg.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Hemoglobin: ≥ 12.5 g/dl
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Hemoglobin count is tested on-the-spot by the blood bank with a simple prick test prior to every donation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Interval: 90 Days
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Male donors can donate whole blood every 3 months (90 days). Female donors can donate every 4 months (120 days).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Pulse & Blood Pressure
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Pulse rate between 60–100 beats/min. Blood pressure systolic 100–140 mmHg and diastolic 60–90 mmHg.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Good General Health
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Well-rested, no cold/fever, well-hydrated, and no major dental or surgical procedures within recent weeks.
            </p>
          </div>

        </div>
      </section>

      {/* Comprehensive Compatibility Table */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
            Medical Reference
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Complete ABO & Rh Compatibility Table
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] border-b border-slate-300">
                <th className="p-3">Blood Group</th>
                <th className="p-3">Can Receive Red Cells From</th>
                <th className="p-3">Can Donate Red Cells To</th>
                <th className="p-3">Key Indian Clinical Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {BLOOD_GROUPS.map((bg) => {
                const info = BLOOD_COMPATIBILITY[bg];
                return (
                  <tr key={bg} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      <BloodGroupBadge group={bg} size="md" />
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {info.canReceiveFrom.map((g) => (
                          <BloodGroupBadge key={g} group={g} size="sm" />
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {info.canGiveTo.map((g) => (
                          <BloodGroupBadge key={g} group={g} size="sm" />
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-[11px] text-slate-500 leading-relaxed">
                      {info.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTAs */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Ready to take part in this voluntary mission?</h3>
          <p className="text-xs text-slate-400">Register in under two minutes or browse donors currently available.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/become-donor"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Become a Donor
          </Link>
          <Link
            to="/find-donors"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
          >
            Find Donors
          </Link>
        </div>
      </div>

    </div>
  );
};
