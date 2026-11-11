import React from 'react';
import { INDIAN_STATES, BLOOD_GROUPS } from '../data/indianLocations';
import { Search, RotateCcw, MapPin, Filter, Navigation } from 'lucide-react';

export interface SearchFilterState {
  bloodGroup: string;
  state: string;
  city: string;
  pincode: string;
  radiusKm: number;
  availability: string;
  sortBy: 'distance' | 'donations' | 'name';
}

interface SearchFiltersProps {
  filters: SearchFilterState;
  onFilterChange: (updates: Partial<SearchFilterState>) => void;
  onReset: () => void;
  resultCount: number;
}

const TEN_FEATURED_LOCATIONS = [
  { city: 'Mumbai', state: 'Maharashtra', code: '400001', label: 'Mumbai' },
  { city: 'Delhi', state: 'Delhi', code: '110001', label: 'Delhi NCR' },
  { city: 'Bengaluru', state: 'Karnataka', code: '560034', label: 'Bengaluru' },
  { city: 'Kolkata', state: 'West Bengal', code: '700029', label: 'Kolkata' },
  { city: 'Chennai', state: 'Tamil Nadu', code: '600018', label: 'Chennai' },
  { city: 'Hyderabad', state: 'Telangana', code: '500034', label: 'Hyderabad' },
  { city: 'Pune', state: 'Maharashtra', code: '411004', label: 'Pune' },
  { city: 'Ahmedabad', state: 'Gujarat', code: '380009', label: 'Ahmedabad' },
  { city: 'Jaipur', state: 'Rajasthan', code: '302001', label: 'Jaipur' },
  { city: 'Lucknow', state: 'Uttar Pradesh', code: '226001', label: 'Lucknow' }
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  resultCount
}) => {
  // Available cities for selected state
  const selectedStateObj = INDIAN_STATES.find(
    (s) => s.name.toLowerCase() === filters.state.toLowerCase()
  );
  const cityOptions = selectedStateObj ? selectedStateObj.cities : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
      
      {/* 10 Quick Location Shortcuts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            10 Key Indian Locations (Click to jump to location)
          </label>
          <span className="text-[11px] text-slate-400">
            Select any city to find local donors
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {TEN_FEATURED_LOCATIONS.map((loc) => {
            const isCityActive = filters.city.toLowerCase() === loc.city.toLowerCase();
            return (
              <button
                key={loc.city}
                type="button"
                onClick={() =>
                  onFilterChange({
                    state: loc.state,
                    city: loc.city,
                    pincode: loc.code
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  isCityActive
                    ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-400 ring-offset-1'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <MapPin className="w-3 h-3 text-red-500" />
                <span>{loc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blood Group Quick Bar */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Blood Group Selection
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onFilterChange({ bloodGroup: 'ALL' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.bloodGroup === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Groups
          </button>
          {BLOOD_GROUPS.map((bg) => {
            const isSelected = filters.bloodGroup === bg;
            return (
              <button
                key={bg}
                type="button"
                onClick={() => onFilterChange({ bloodGroup: bg })}
                className={`min-w-[42px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all tabular-nums ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-400 ring-offset-1'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
                }`}
              >
                {bg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* State */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            State
          </label>
          <select
            value={filters.state}
            onChange={(e) => onFilterChange({ state: e.target.value, city: '' })}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-slate-800"
          >
            <option value="ALL">All Indian States</option>
            {INDIAN_STATES.map((st) => (
              <option key={st.name} value={st.name}>
                {st.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            City
          </label>
          {cityOptions.length > 0 ? (
            <select
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-slate-800"
            >
              <option value="">All Cities in {filters.state}</option>
              {cityOptions.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Mumbai, Pune, Jaipur"
                value={filters.city}
                onChange={(e) => onFilterChange({ city: e.target.value })}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          )}
        </div>

        {/* PIN Code */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            PIN Code
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="6-digit PIN"
            value={filters.pincode}
            onChange={(e) => onFilterChange({ pincode: e.target.value.replace(/\D/g, '') })}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
          />
        </div>

        {/* Radius */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center justify-between">
            <span>Search Radius</span>
            <span className="text-[11px] font-bold text-red-600 tabular-nums">
              {filters.radiusKm} km
            </span>
          </label>
          <select
            value={filters.radiusKm}
            onChange={(e) => onFilterChange({ radiusKm: Number(e.target.value) })}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-slate-800"
          >
            <option value={5}>Within 5 km (Immediate)</option>
            <option value={10}>Within 10 km</option>
            <option value={25}>Within 25 km</option>
            <option value={50}>Within 50 km</option>
            <option value={100}>Within 100 km (District Wide)</option>
          </select>
        </div>

      </div>

      {/* Secondary Bar: Availability, Sort By & Reset */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Availability */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Availability:</span>
            <select
              value={filters.availability}
              onChange={(e) => onFilterChange({ availability: e.target.value })}
              className="px-2.5 py-1 text-xs rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Temporarily Unavailable">Temporarily Unavailable</option>
              <option value="Not Currently Donating">Not Currently Donating</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sort By:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="px-2.5 py-1 text-xs rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium text-slate-700"
            >
              <option value="distance">Distance (Nearest First)</option>
              <option value="donations">Donation Count (Experience)</option>
              <option value="name">Donor Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Count & Reset */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500">
            Found <strong className="text-slate-900 font-bold tabular-nums">{resultCount}</strong> potential donors
          </span>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1 text-slate-500 hover:text-red-600 hover:bg-slate-50 rounded-md border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        </div>

      </div>

    </div>
  );
};
