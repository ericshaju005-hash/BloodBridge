import React from 'react';
import { Donor } from '../services/donorService';
import { BloodGroupBadge } from './BloodGroupBadge';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  Clock, 
  Flag, 
  ShieldCheck, 
  Heart,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface DonorCardProps {
  donor: Donor;
  viewMode?: 'grid' | 'list';
}

export const DonorCard: React.FC<DonorCardProps> = ({ donor, viewMode = 'grid' }) => {
  const { setActiveDonorForContact, setActiveDonorForRequest, setActiveReportTarget } = useApp();

  const isAvailable = donor.availability === 'Available';
  const isTempUnavailable = donor.availability === 'Temporarily Unavailable';

  const availabilityBadge = (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
        isAvailable
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : isTempUnavailable
          ? 'bg-amber-50 text-amber-700 border border-amber-200'
          : 'bg-slate-100 text-slate-600 border border-slate-200'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isAvailable ? 'bg-emerald-500' : isTempUnavailable ? 'bg-amber-500' : 'bg-slate-400'
        }`}
      />
      {donor.availability}
    </span>
  );

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Info */}
        <div className="flex items-center gap-4">
          <BloodGroupBadge group={donor.bloodGroup} size="lg" />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">{donor.name}</h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium" title="Demonstration Profile Record">
                Demo Record
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {donor.city}, {donor.state} ({donor.pincode})
              </span>
              <span aria-hidden="true">·</span>
              <span>{donor.age} yrs · {donor.gender}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">{donor.totalDonations} previous donations</span>
              {donor.distanceKm !== undefined && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-red-600 tabular-nums">
                    ~{donor.distanceKm} km away
                  </span>
                </>
              )}
            </div>

            {donor.bio && (
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-1 italic">
                "{donor.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div>{availabilityBadge}</div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDonorForContact(donor)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              Contact
            </button>
            <button
              onClick={() => setActiveDonorForRequest(donor)}
              className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Request Blood
            </button>
            <button
              onClick={() => setActiveReportTarget({ type: 'donor', id: donor.id, name: donor.name })}
              title="Report profile"
              className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <BloodGroupBadge group={donor.bloodGroup} size="lg" />
          <div className="flex items-center gap-1.5">
            {availabilityBadge}
            <button
              onClick={() => setActiveReportTarget({ type: 'donor', id: donor.id, name: donor.name })}
              title="Flag or report donor record"
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-1 transition-opacity"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Name and Verification */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-slate-900 text-base group-hover:text-red-600 transition-colors">
              {donor.name}
            </h3>
            <span
              title="Demo Verified Voluntary Donor"
              className="text-emerald-600"
            >
              <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {donor.city}, {donor.state} · {donor.pincode}
            </span>
          </div>
        </div>

        {/* Distance & Bio */}
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>Donation History:</span>
            <span className="font-bold text-slate-900 tabular-nums">
              {donor.totalDonations} donation{donor.totalDonations === 1 ? '' : 's'}
            </span>
          </div>

          {donor.distanceKm !== undefined && (
            <div className="flex items-center justify-between text-slate-600">
              <span>Approx. Distance:</span>
              <span className="font-semibold text-red-600 tabular-nums">
                ~{donor.distanceKm} km
              </span>
            </div>
          )}

          {donor.bio && (
            <p className="text-slate-500 text-xs italic line-clamp-2 pt-1 leading-relaxed">
              "{donor.bio}"
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <button
          onClick={() => setActiveDonorForContact(donor)}
          className="py-2.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Phone className="w-3.5 h-3.5 text-slate-500" />
          Contact
        </button>

        <button
          onClick={() => setActiveDonorForRequest(donor)}
          className="py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          Request
        </button>
      </div>

    </div>
  );
};
