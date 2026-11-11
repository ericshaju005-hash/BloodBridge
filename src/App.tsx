import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Layout & Global Components
import { MedicalDisclaimerBanner } from './components/MedicalDisclaimerBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PhoneRevealModal } from './components/PhoneRevealModal';
import { SendDonationRequestModal } from './components/SendDonationRequestModal';
import { ReportModal } from './components/ReportModal';
import { ToastContainer } from './components/ToastContainer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { FindDonors } from './pages/FindDonors';
import { RequestBlood } from './pages/RequestBlood';
import { RegisterDonor } from './pages/RegisterDonor';
import { HowItWorks } from './pages/HowItWorks';
import { About } from './pages/About';
import { PrivacyAndTerms } from './pages/PrivacyAndTerms';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#1F2937] antialiased">
            {/* Top Medical & Emergency Disclaimer Banner */}
            <MedicalDisclaimerBanner />

            {/* Standard Top Navigation Bar */}
            <Navbar />

            {/* Main Page Viewport */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/find-donors" element={<FindDonors />} />
                <Route path="/request-blood" element={<RequestBlood />} />
                <Route path="/become-donor" element={<RegisterDonor />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-terms" element={<PrivacyAndTerms />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Authenticated User / Patient / Donor Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Comprehensive Footer */}
            <Footer />

            {/* Global Modals & Feedback Overlays */}
            <PhoneRevealModal />
            <SendDonationRequestModal />
            <ReportModal />
            <ToastContainer />
          </div>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
