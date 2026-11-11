import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  Clock, 
  Activity, 
  AlertTriangle,
  Building,
  CheckCircle2,
  Users,
  Compass,
  Sparkles
} from 'lucide-react';
import { INDIAN_STATES, BLOOD_GROUPS, BLOOD_COMPATIBILITY, BloodGroup } from '../data/indianLocations';
import { storageService } from '../services/storageService';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { useApp } from '../context/AppContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setQuickSearchFilter } = useApp();

  // Quick search form state
  const [selectedGroup, setSelectedGroup] = useState<string>('O+');
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [cityInput, setCityInput] = useState<string>('Mumbai');
  const [pincodeInput, setPincodeInput] = useState<string>('');
  const [radiusInput, setRadiusInput] = useState<number>(25);

  // Active compatibility modal/tab
  const [activeGroupDetail, setActiveGroupDetail] = useState<BloodGroup>('O+');

  // Dynamic demo stats
  const [stats, setStats] = useState({
    donors: 32,
    available: 28,
    requests: 18,
    connections: 142
  });

  useEffect(() => {
    const donors = storageService.getDonors();
    const requests = storageService.getRequests();
    const availableCount = donors.filter((d: any) => d.availability === 'Available').length;

    setStats({
      donors: donors.length,
      available: availableCount,
      requests: requests.length,
      connections: 142 + requests.filter((r: any) => r.status === 'Completed').length
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickSearchFilter({
      bloodGroup: selectedGroup,
      state: selectedState,
      city: cityInput,
      pincode: pincodeInput,
      radius: radiusInput
    });
    navigate('/find-donors');
  };

  const selectedStateObj = INDIAN_STATES.find(
    (s) => s.name.toLowerCase() === selectedState.toLowerCase()
  );
  const cityOptions = selectedStateObj ? selectedStateObj.cities : [];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 lg:pt-14 pb-12 lg:pb-20 border-b border-slate-200 bg-gradient-to-b from-red-50/60 via-[#F9FAFB] to-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-100/70 border border-red-200/60 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                <span>India-Wide Voluntary Blood Donor Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] text-balance">
                Every Drop Counts. <br />
                <span className="text-red-600">Every Connection</span> Matters.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Find willing blood donors near you and become someone's reason to smile. A transparent, voluntary platform connecting emergency patients with generous local donors across Indian cities.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/find-donors"
                  className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  Find Blood Donors
                </Link>

                <Link
                  to="/become-donor"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs flex items-center gap-2 transition-all hover:border-slate-400"
                >
                  <Heart className="w-4 h-4 text-red-600" />
                  Become a Donor
                </Link>
              </div>

              {/* Quick Trust Points */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Voluntary</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Donor Privacy Shield</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Activity className="w-4 h-4 text-red-600" />
                  <span>Emergency Fast Track</span>
                </div>
              </div>

            </div>

            {/* Right Image Feature */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group">
                <img
                  src="/src/assets/images/hero_blood_donation_1794204454576.jpg"
                  alt="Voluntary blood donation session at a modern healthcare center in India"
                  referrerPolicy="no-referrer"
                  className="w-full h-[380px] sm:h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest">
                    Community Impact
                  </span>
                  <p className="text-sm font-semibold mt-1">
                    "Voluntary blood donation transforms critical medical emergencies into moments of hope."
                  </p>
                  <span className="text-xs text-slate-300 mt-1">
                    Red Cross & Hospital Blood Transfusion Support
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROMINENT SEARCH CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-14 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
          
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                Quick Donor Finder
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                Search Donors by Blood Group & Location
              </h2>
            </div>
            <Link
              to="/find-donors"
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Advanced Search <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <form onSubmit={handleSearchSubmit} className="mt-6 space-y-6">
            
            {/* Blood Group Selectors */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2.5">
                Select Blood Group
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {BLOOD_GROUPS.map((bg) => {
                  const isSelected = selectedGroup === bg;
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setSelectedGroup(bg)}
                      className={`py-2.5 rounded-xl font-extrabold text-sm transition-all tabular-nums text-center ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-md scale-102 ring-2 ring-red-400 ring-offset-2'
                          : 'bg-slate-50 hover:bg-red-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {bg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    const st = INDIAN_STATES.find((s) => s.name === e.target.value);
                    if (st && st.cities.length > 0) {
                      setCityInput(st.cities[0].name);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st.name} value={st.name}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City
                </label>
                {cityOptions.length > 0 ? (
                  <select
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {cityOptions.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={cityInput}
                    placeholder="e.g. Mumbai, Pune"
                    onChange={(e) => setCityInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                )}
              </div>

              {/* PIN Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  PIN Code (Optional)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 400001"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>

              {/* Search Radius */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Radius: <span className="text-red-600 font-bold">{radiusInput} km</span>
                </label>
                <select
                  value={radiusInput}
                  onChange={(e) => setRadiusInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value={5}>Within 5 km</option>
                  <option value={10}>Within 10 km</option>
                  <option value={25}>Within 25 km (Standard)</option>
                  <option value={50}>Within 50 km</option>
                  <option value={100}>Within 100 km</option>
                </select>
              </div>

            </div>

            {/* Submit Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Searching real-time demo records in <strong className="text-slate-800">{cityInput}, {selectedState}</strong>
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Search className="w-4 h-4" />
                Find Donors Near Me
              </button>
            </div>

          </form>

        </div>
      </section>

      {/* 3. BLOOD GROUP SECTION & COMPATIBILITY GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
            Compatibility Knowledge
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Understanding Blood Groups & Compatibility
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Click on any blood group to understand who can receive from or donate to this group. Final compatibility is always authorized by blood bank testing.
          </p>
        </div>

        {/* 8 Blood Groups Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {BLOOD_GROUPS.map((bg) => {
            const isSelected = activeGroupDetail === bg;
            return (
              <button
                key={bg}
                onClick={() => setActiveGroupDetail(bg)}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-700 shadow-lg scale-105'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
                }`}
              >
                <div className="text-2xl font-black tabular-nums">{bg}</div>
                <div className={`text-[11px] mt-1 ${isSelected ? 'text-red-100' : 'text-slate-500'}`}>
                  {bg.includes('-') ? 'Rare Rh-' : 'Common Rh+'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Blood Group Breakdown Card */}
        {activeGroupDetail && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <BloodGroupBadge group={activeGroupDetail} size="lg" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Blood Group {activeGroupDetail} Specifications
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {BLOOD_COMPATIBILITY[activeGroupDetail].description}
                  </p>
                </div>
              </div>

              <Link
                to={`/find-donors?bg=${encodeURIComponent(activeGroupDetail)}`}
                className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors shrink-0"
              >
                Search {activeGroupDetail} Donors &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              
              {/* Can Give To */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Can Donate Red Cells To ({BLOOD_COMPATIBILITY[activeGroupDetail].canGiveTo.length} Groups):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_COMPATIBILITY[activeGroupDetail].canGiveTo.map((g) => (
                    <BloodGroupBadge key={g} group={g} size="md" />
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Recipients with these blood types have compatible antigen profiles for red blood cell transfusions.
                </p>
              </div>

              {/* Can Receive From */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Can Receive Red Cells From ({BLOOD_COMPATIBILITY[activeGroupDetail].canReceiveFrom.length} Groups):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_COMPATIBILITY[activeGroupDetail].canReceiveFrom.map((g) => (
                    <BloodGroupBadge key={g} group={g} size="md" />
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  In emergency transfusions, these donor groups will not trigger adverse hemolytic antibody reactions.
                </p>
              </div>

            </div>
          </div>
        )}

      </section>

      {/* 4. HOW IT WORKS (4 STEPS) */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
              Transparent Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How BloodBridge Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              A four-step collaborative framework connecting willing voluntary donors with hospital requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-extrabold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base">Voluntary Registration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Individuals register voluntary donor profiles specifying blood group, approximate locality, and contact availability preferences.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-extrabold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base">Discover & Search</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients, families, or hospital liaisons search for compatible donors filtered by blood group, state, city, and approximate radius.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-extrabold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base">Connect with Consent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Requesters send a direct donation request or initiate contact under strict privacy safeguards without exposing private home addresses.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-base">Hospital Coordination</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The donor coordinates directly with the hospital or authorized blood transfusion bank where clinical testing and donation take place.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. LIVE STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest block">
                  Demonstration Platform Metrics
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Active Community Discovery Network
                </h3>
              </div>
              <span className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-md self-start md:self-auto">
                * Demonstration Data for Evaluation
              </span>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
              
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-red-500 tabular-nums">
                  {stats.donors}
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-1">
                  Registered Fictional Donors
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Across 15+ Indian major cities
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tabular-nums">
                  {stats.available}
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-1">
                  Available for Immediate Call
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Currently active status
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tabular-nums">
                  {stats.requests}
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-1">
                  Hospital Blood Requests
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Normal, Urgent & Emergency
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                  {stats.connections}
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-1">
                  Successful Connections
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Simulated local coordinations
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION: BECOME A DONOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-red-600 to-red-800 text-white p-8 sm:p-14 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-red-200 uppercase tracking-widest block">
              Be A Hero For Someone in Need
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Ready to Save Lives in Your Neighborhood?
            </h2>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
              Register as a voluntary blood donor today. You choose when you are available, your contact visibility remains securely shielded, and you can update your status at any time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto">
            <Link
              to="/become-donor"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-red-700 font-extrabold text-sm hover:bg-red-50 text-center shadow-lg transition-all"
            >
              Register as Donor
            </Link>
            <Link
              to="/request-blood"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-red-900/60 hover:bg-red-900/80 text-white font-bold text-sm text-center border border-red-400/40 transition-all"
            >
              Post a Request
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
