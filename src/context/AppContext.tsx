import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Donor, donorService } from '../services/donorService';
import { requestService } from '../services/requestService';
import { isSupabaseConfigured } from '../services/supabaseClient';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  resetAllDemoData: () => void;
  
  // Modals state
  activeDonorForContact: Donor | null;
  setActiveDonorForContact: (donor: Donor | null) => void;
  
  activeDonorForRequest: Donor | null;
  setActiveDonorForRequest: (donor: Donor | null) => void;

  activeReportTarget: { type: 'donor' | 'request'; id: string; name: string } | null;
  setActiveReportTarget: (target: { type: 'donor' | 'request'; id: string; name: string } | null) => void;

  // Search pre-fill
  quickSearchFilter: { bloodGroup?: string; state?: string; city?: string; pincode?: string; radius?: number };
  setQuickSearchFilter: React.Dispatch<React.SetStateAction<{ bloodGroup?: string; state?: string; city?: string; pincode?: string; radius?: number }>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeDonorForContact, setActiveDonorForContact] = useState<Donor | null>(null);
  const [activeDonorForRequest, setActiveDonorForRequest] = useState<Donor | null>(null);
  const [activeReportTarget, setActiveReportTarget] = useState<{ type: 'donor' | 'request'; id: string; name: string } | null>(null);
  
  const [quickSearchFilter, setQuickSearchFilter] = useState<{
    bloodGroup?: string;
    state?: string;
    city?: string;
    pincode?: string;
    radius?: number;
  }>({});

  // Sync with Supabase on startup if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      Promise.all([
        donorService.syncWithSupabase(),
        requestService.syncWithSupabase()
      ]).then(() => {
        window.dispatchEvent(new Event('bloodbridge_storage_update'));
      }).catch((e) => {
        console.warn('Initial Supabase sync error:', e);
      });
    }
  }, []);

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const resetAllDemoData = () => {
    storageService.resetDemoData();
    showToast('Demo data has been restored to default sample records.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        resetAllDemoData,
        activeDonorForContact,
        setActiveDonorForContact,
        activeDonorForRequest,
        setActiveDonorForRequest,
        activeReportTarget,
        setActiveReportTarget,
        quickSearchFilter,
        setQuickSearchFilter
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
