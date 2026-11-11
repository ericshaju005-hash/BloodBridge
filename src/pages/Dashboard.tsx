import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { requestService, BloodRequest } from '../services/requestService';
import { donorService, Donor } from '../services/donorService';
import { notificationService, NotificationItem } from '../services/notificationService';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { 
  Heart, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  User, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Calendar,
  Building2,
  Trash2,
  Check,
  X,
  Bell,
  Activity,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { currentUser, isDonor, updateProfile } = useAuth();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'my-requests' | 'incoming-requests' | 'profile' | 'notifications'>('overview');

  const [myBloodRequests, setMyBloodRequests] = useState<BloodRequest[]>([]);
  const [incomingDonationRequests, setIncomingDonationRequests] = useState<BloodRequest[]>([]);
  const [donorRecord, setDonorRecord] = useState<Donor | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Load all dashboard state
  const loadDashboardData = () => {
    if (!currentUser) return;

    // Requests submitted by current user
    const userReqs = requestService.getUserRequests(currentUser.id);
    setMyBloodRequests(userReqs);

    // If user is a donor, load donor profile and incoming requests
    if (currentUser.donorId) {
      const d = donorService.getDonorById(currentUser.donorId);
      if (d) setDonorRecord(d);
      const inc = requestService.getIncomingRequestsForDonor(currentUser.donorId);
      setIncomingDonationRequests(inc);
    } else {
      // Look for donor by email/phone or name
      const allDonors = donorService.getAllDonors();
      const matched = allDonors.find((d) => d.email === currentUser.email || d.name === currentUser.name);
      if (matched) {
        setDonorRecord(matched);
        setIncomingDonationRequests(requestService.getIncomingRequestsForDonor(matched.id));
      }
    }

    setNotifications(notificationService.getNotifications(currentUser.id));
  };

  useEffect(() => {
    loadDashboardData();

    const handleUpdate = () => loadDashboardData();
    window.addEventListener('bloodbridge_storage_update', handleUpdate);
    return () => window.removeEventListener('bloodbridge_storage_update', handleUpdate);
  }, [currentUser]);

  // Handle Availability Toggle
  const handleAvailabilityChange = (newStatus: 'Available' | 'Temporarily Unavailable' | 'Not Currently Donating') => {
    if (!donorRecord) {
      showToast('You are not currently registered as a voluntary donor.', 'info');
      return;
    }
    donorService.updateDonorAvailability(donorRecord.id, newStatus);
    setDonorRecord((prev) => (prev ? { ...prev, availability: newStatus } : null));
    showToast(`Donor status updated to: ${newStatus}`, 'success');
  };

  // Handle Donor Accepting or Declining Request
  const handleRequestResponse = (requestId: string, status: 'Accepted' | 'Declined') => {
    requestService.updateRequestStatus(requestId, status);
    loadDashboardData();
    showToast(`Request marked as ${status}. Requester notified in demo session.`, 'success');
  };

  // Handle Requester Cancelling Request
  const handleCancelRequest = (requestId: string) => {
    requestService.cancelBloodRequest(requestId);
    loadDashboardData();
    showToast('Your blood request has been cancelled.', 'info');
  };

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileCity, setProfileCity] = useState(currentUser?.city || '');
  const [profilePincode, setProfilePincode] = useState(currentUser?.pincode || '');
  const [profileVisibility, setProfileVisibility] = useState(currentUser?.phoneVisibility || 'request_only');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: profileName,
      phone: profilePhone,
      city: profileCity,
      pincode: profilePincode,
      phoneVisibility: profileVisibility as any
    });
    showToast('Profile information saved in LocalStorage.', 'success');
  };

  if (!currentUser) return null;

  const pendingIncoming = incomingDonationRequests.filter((r) => r.status === 'Pending').length;
  const activeUserRequests = myBloodRequests.filter((r) => r.status === 'Pending' || r.status === 'Accepted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white font-extrabold flex items-center justify-center text-2xl shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Welcome back, {currentUser.name}
              </h1>
              <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full capitalize">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser.city}, {currentUser.state} ({currentUser.pincode}) · Blood Group: <strong className="text-red-600">{currentUser.bloodGroup}</strong>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            to="/request-blood"
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            New Blood Request
          </Link>
          <Link
            to="/find-donors"
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            Find Donors
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Dashboard Overview
        </button>

        <button
          onClick={() => setActiveTab('my-requests')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'my-requests'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>My Blood Requests</span>
          {activeUserRequests > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 text-[10px] flex items-center justify-center font-bold">
              {activeUserRequests}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('incoming-requests')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'incoming-requests'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Incoming Donor Requests</span>
          {pendingIncoming > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingIncoming}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Profile & Privacy
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'notifications'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Alerts & Logs</span>
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </button>
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Donor Status
              </span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">
                  {donorRecord?.availability || (isDonor ? 'Active' : 'Not Registered')}
                </span>
                <span className={`w-3 h-3 rounded-full ${donorRecord?.availability === 'Available' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {donorRecord ? 'Listed in voluntary directory' : 'Click become a donor to join'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                My Posted Requests
              </span>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 tabular-nums">
                {myBloodRequests.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {activeUserRequests} active requirements
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Incoming Requests
              </span>
              <div className="mt-2 text-2xl font-extrabold text-amber-600 tabular-nums">
                {incomingDonationRequests.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {pendingIncoming} waiting for your response
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Accepted Connections
              </span>
              <div className="mt-2 text-2xl font-extrabold text-emerald-600 tabular-nums">
                {incomingDonationRequests.filter((r) => r.status === 'Accepted').length + myBloodRequests.filter((r) => r.status === 'Accepted').length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Demonstration life lines
              </p>
            </div>

          </div>

          {/* Donor Availability Control (If Donor) */}
          {donorRecord && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Update Your Voluntary Donor Availability
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Temporarily pause incoming emergency donation requests whenever you are traveling or recovering.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(['Available', 'Temporarily Unavailable', 'Not Currently Donating'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleAvailabilityChange(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      donorRecord.availability === status
                        ? status === 'Available'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pending Incoming Requests Preview */}
          {pendingIncoming > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Action Required: Pending Incoming Donation Requests ({pendingIncoming})
                </h3>
                <button
                  onClick={() => setActiveTab('incoming-requests')}
                  className="text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingDonationRequests
                  .filter((r) => r.status === 'Pending')
                  .map((req) => (
                    <div key={req.id} className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                            Direct Hospital Request
                          </span>
                          <h4 className="font-bold text-slate-900 text-base">{req.patientName}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">{req.hospitalName}, {req.city}</p>
                        </div>
                        <BloodGroupBadge group={req.bloodGroup} size="md" />
                      </div>

                      <div className="text-xs text-slate-700 italic bg-white/70 p-2.5 rounded-lg border border-amber-100">
                        "{req.message}"
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span>Required: {req.requiredDate}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRequestResponse(req.id, 'Declined')}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleRequestResponse(req.id, 'Accepted')}
                            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                          >
                            Accept & Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Active Blood Requests Posted by User */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Recent Blood Requests Posted by You
              </h3>
              <button
                onClick={() => setActiveTab('my-requests')}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Manage Requests &rarr;
              </button>
            </div>

            {myBloodRequests.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                You haven't posted any blood requests yet.
                <div className="mt-2">
                  <Link to="/request-blood" className="text-red-600 font-bold hover:underline">
                    Create your first blood request
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {myBloodRequests.slice(0, 3).map((req) => (
                  <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <BloodGroupBadge group={req.bloodGroup} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{req.patientName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">({req.id})</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {req.hospitalName}, {req.city} · {req.units} unit(s) · Urgency: <strong className="text-slate-800">{req.urgency}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        req.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-700'
                          : req.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {req.status}
                      </span>
                      {req.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelRequest(req.id)}
                          className="text-xs text-slate-400 hover:text-red-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB CONTENT: 2. MY BLOOD REQUESTS */}
      {activeTab === 'my-requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">My Posted Blood Requirements</h2>
            <Link
              to="/request-blood"
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              New Requirement
            </Link>
          </div>

          {myBloodRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <h3 className="text-sm font-bold text-slate-800">No Blood Requests Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Post an emergency or routine transfusion request to seek voluntary donors.
              </p>
              <Link
                to="/request-blood"
                className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold"
              >
                Post Blood Request
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myBloodRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <BloodGroupBadge group={req.bloodGroup} size="lg" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{req.patientName}</h4>
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {req.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {req.hospitalName} · {req.hospitalAddress}, {req.city}, {req.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : req.status === 'Completed'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        Status: {req.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Units Required</span>
                      <strong className="text-slate-900">{req.units} Unit(s)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Urgency</span>
                      <strong className={req.urgency === 'Emergency' ? 'text-red-600' : 'text-slate-900'}>
                        {req.urgency}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Date Required</span>
                      <strong className="text-slate-900">{req.requiredDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Target Donor</span>
                      <strong className="text-slate-900">{req.targetDonorName || 'Local Public Network'}</strong>
                    </div>
                  </div>

                  {req.message && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{req.message}"
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span>Contact: {req.contactPerson} ({req.contactNumber})</span>
                    <div className="flex items-center gap-2">
                      {req.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelRequest(req.id)}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 3. INCOMING DONOR REQUESTS */}
      {activeTab === 'incoming-requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Incoming Donation Requests
            </h2>
            <span className="text-xs text-slate-500">
              Requesters asking for your voluntary donation
            </span>
          </div>

          {incomingDonationRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <h3 className="text-sm font-bold text-slate-800">No Incoming Requests</h3>
              <p className="text-xs text-slate-500 mt-1">
                You will receive alerts here when a patient in your locality requests your blood group.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingDonationRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{req.patientName}</h4>
                        <BloodGroupBadge group={req.bloodGroup} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {req.hospitalName} ({req.city}, {req.state}) · Urgency: <strong className="text-red-600">{req.urgency}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        req.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-700'
                          : req.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    "{req.message}"
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                    <div>
                      Attendant Contact: <strong>{req.contactPerson}</strong> ({req.contactNumber})
                    </div>

                    {req.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRequestResponse(req.id, 'Declined')}
                          className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleRequestResponse(req.id, 'Accepted')}
                          className="px-5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          Accept Request
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Response recorded in demo storage.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 4. PROFILE & PRIVACY */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Profile Settings & Contact Privacy
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={profilePincode}
                  onChange={(e) => setProfilePincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Visibility Shield
              </label>
              <select
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
              >
                <option value="request_only">Shielded: Requester must confirm consent before viewing</option>
                <option value="visible">Public: Visible on card with safety dialog</option>
                <option value="hidden">Hidden: In-app requests only</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: 5. NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Notifications & Transfusion Logs</h2>
            <button
              onClick={() => {
                notificationService.markAllAsRead(currentUser.id);
                loadDashboardData();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Mark all as read
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
            {notifications.map((n) => (
              <div key={n.id} className={`p-4 ${!n.read ? 'bg-red-50/30' : ''}`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
