import React from 'react';
import { ShieldCheck, AlertTriangle, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { BloodBridgeLogo } from '../components/BloodBridgeLogo';

export const PrivacyAndTerms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest block">
          Legal & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Medical Disclaimer, Privacy Policy & Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Last updated: November 2026 · Governing voluntary discovery and data protection on BloodBridge India.
        </p>
      </div>

      {/* 1. CRITICAL MEDICAL DISCLAIMER */}
      <section className="bg-red-50/70 border border-red-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-red-700">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h2 className="text-lg font-bold">1. Critical Medical Safety Disclaimer</h2>
        </div>
        <div className="text-xs text-red-950 space-y-2.5 leading-relaxed">
          <p>
            <strong>BloodBridge is a voluntary discovery and coordination directory, NOT a licensed blood bank, clinical laboratory, or emergency healthcare dispatch provider.</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-red-900">
            <li>
              <strong>No Guarantee of Medical Fitness:</strong> Registering as a donor on this platform does NOT constitute medical clearance or eligibility to donate blood. Final clinical fitness (hemoglobin, viral markers, vital signs) is solely evaluated by qualified physicians at authorized blood banks.
            </li>
            <li>
              <strong>No Automatic Transfusion Compatibility:</strong> Information on blood groups provided on this website is for general educational awareness only. ABO and Rh compatibility, cross-matching, antibody screening, and transfusion authorizations MUST be conducted by certified medical staff.
            </li>
            <li>
              <strong>No Guarantee of Donor Arrival:</strong> Because all donors are voluntary citizens, BloodBridge does not and cannot guarantee that any specific donor will be available, respond to calls, or arrive at a hospital.
            </li>
            <li>
              <strong>Immediate Hospital Emergency Protocol:</strong> In acute life-threatening situations, patients and families MUST immediately notify hospital emergency doctors and contact the on-site blood storage center or dial the national medical emergency lines (<strong>108 / 104</strong>).
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PROTOTYPE & LOCALSTORAGE NOTICE */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-amber-900">
          <Lock className="w-6 h-6 shrink-0" />
          <h2 className="text-lg font-bold">2. Demonstration Prototype & LocalStorage Advisory</h2>
        </div>
        <div className="text-xs text-amber-950 space-y-2.5 leading-relaxed">
          <p>
            This application is a <strong>frontend technology demonstration prototype</strong> designed to showcase user experience, search filters, and simulated workflows.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-amber-900">
            <li>
              <strong>Browser LocalStorage Storage:</strong> All user accounts, donor profiles, blood requests, and messages are stored inside your browser's LocalStorage memory. They are not transmitted across the internet to an external server.
            </li>
            <li>
              <strong>Insecure for Real Production Personal Data:</strong> Browser LocalStorage is not encrypted for sensitive medical information. Never enter real personal passwords, real bank details, or confidential medical records in this prototype.
            </li>
            <li>
              <strong>Fictional Sample Data:</strong> All sample donor records, addresses, and request histories provided in initial seed data are entirely fictional.
            </li>
          </ul>
        </div>
      </section>

      {/* 3. DONOR PRIVACY POLICY */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3 text-slate-900">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <h2 className="text-lg font-bold">3. Donor Privacy Protection & Address Masking</h2>
        </div>
        <div className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
          <p>
            We implement privacy-by-design principles to protect voluntary citizens who offer blood donations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Zero Residential Address Publishing:</strong> We never request or publicly display a donor's precise house number or street address. Only the general city, state, and approximate PIN code are shown for distance approximations.
            </li>
            <li>
              <strong>Phone Visibility Consent:</strong> By default, phone numbers are shielded behind a requester confirmation step. Donors can also set their preference to "Hidden" to restrict communications to in-app messages.
            </li>
            <li>
              <strong>Right to Withdraw & Pause:</strong> Donors can change their status to "Temporarily Unavailable" or "Not Donating" at any moment from their dashboard, instantly pausing contact requests.
            </li>
          </ul>
        </div>
      </section>

      {/* 4. TERMS OF USE */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3 text-slate-900">
          <FileText className="w-6 h-6 text-red-600 shrink-0" />
          <h2 className="text-lg font-bold">4. Strict Prohibition of Commercial Blood Trading</h2>
        </div>
        <div className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
          <p>
            Under the landmark judgment of the Supreme Court of India (1996) and the National Blood Policy of the Government of India, <strong>commercial sale and purchase of human blood is strictly illegal</strong> and punishable by law.
          </p>
          <p>
            Any user found soliciting payment, offering monetary incentives, or engaging in commercial trade will be immediately removed from the demonstration records and reported to regulatory authorities.
          </p>
        </div>
      </section>

    </div>
  );
};
