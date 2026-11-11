import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { donorService, Donor } from '../services/donorService';
import { SearchFilters, SearchFilterState } from '../components/SearchFilters';
import { DonorCard } from '../components/DonorCard';
import { MapView } from '../components/MapView';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useApp } from '../context/AppContext';
import { 
  LayoutGrid, 
  List, 
  Map as MapIcon, 
  AlertCircle, 
  Users, 
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';

export const FindDonors: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { quickSearchFilter, setQuickSearchFilter } = useApp();

  const [filters, setFilters] = useState<SearchFilterState>({
    bloodGroup: searchParams.get('bg') || quickSearchFilter.bloodGroup || 'ALL',
    state: quickSearchFilter.state || 'ALL',
    city: quickSearchFilter.city || '',
    pincode: quickSearchFilter.pincode || '',
    radiusKm: quickSearchFilter.radius || 25,
    availability: 'ALL',
    sortBy: 'distance'
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync when quickSearchFilter changes
  useEffect(() => {
    if (quickSearchFilter.bloodGroup || quickSearchFilter.state || quickSearchFilter.city) {
      setFilters((prev) => ({
        ...prev,
        bloodGroup: quickSearchFilter.bloodGroup || prev.bloodGroup,
        state: quickSearchFilter.state || prev.state,
        city: quickSearchFilter.city ?? prev.city,
        pincode: quickSearchFilter.pincode ?? prev.pincode,
        radiusKm: quickSearchFilter.radius || prev.radiusKm
      }));
    }
  }, [quickSearchFilter]);

  // Execute Search
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const results = donorService.searchDonors({
        bloodGroup: filters.bloodGroup,
        state: filters.state,
        city: filters.city,
        pincode: filters.pincode,
        radiusKm: filters.radiusKm,
        availability: filters.availability,
        sortBy: filters.sortBy
      });
      setDonors(results);
      setLoading(false);
    }, 180);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (updates: Partial<SearchFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setQuickSearchFilter({});
    setFilters({
      bloodGroup: 'ALL',
      state: 'ALL',
      city: '',
      pincode: '',
      radiusKm: 25,
      availability: 'ALL',
      sortBy: 'distance'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title & Privacy Pill */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
            Nationwide Discovery Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Find Blood Donors Across India
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover voluntary, non-commercial donors in your city. Direct contact requires privacy shield consent.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Grid
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            Map View
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        resultCount={donors.length}
      />

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner label="Searching verified Indian blood donors..." />
      ) : (
        <div>
          {/* Map View */}
          {viewMode === 'map' && (
            <div className="space-y-4">
              <div className="h-[540px] w-full">
                <MapView donors={donors} selectedCity={filters.city} />
              </div>
              <p className="text-xs text-slate-500 text-center">
                Approximate sample coordinates used to safeguard donor privacy. Click any drop marker to preview donor information and contact them.
              </p>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div>
              {donors.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No Donors Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    No registered voluntary donors matched your filter criteria. Try broadening your radius or switching to All Groups.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {donors.map((donor) => (
                    <DonorCard key={donor.id} donor={donor} viewMode="grid" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div>
              {donors.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
                  <h3 className="text-base font-bold text-slate-800">No Donors Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Try broadening your search radius or selecting a different city.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {donors.map((donor) => (
                    <DonorCard key={donor.id} donor={donor} viewMode="list" />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Safety Notice Footer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Demonstration Safeguard: </strong>
          All donors listed are fictional sample records created for system prototype demonstration. Never offer or accept financial remuneration for blood donation; commercial blood donation is illegal under the National Blood Policy of India.
        </div>
      </div>

    </div>
  );
};
