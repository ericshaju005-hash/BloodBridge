import initialDonors from '../data/donors.json';
import initialUsers from '../data/users.json';
import initialRequests from '../data/requests.json';
import initialNotifications from '../data/notifications.json';

const STORAGE_KEYS = {
  DONORS: 'bloodbridge_donors_v2',
  USERS: 'bloodbridge_users_v2',
  REQUESTS: 'bloodbridge_requests_v2',
  NOTIFICATIONS: 'bloodbridge_notifications_v2',
  CURRENT_USER: 'bloodbridge_current_user_v2',
  REPORTS: 'bloodbridge_reports_v2'
};

export const storageService = {
  // Initialize storage if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.DONORS)) {
      localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(initialDonors));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(initialRequests));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([
        {
          id: "rep-1",
          reportedItemType: "donor",
          reportedItemId: "donor-7",
          reportedItemName: "Vikram Rathore",
          reason: "Phone number unreachable during local blood drive",
          status: "pending",
          timestamp: "2026-11-07T14:22:00Z"
        }
      ]));
    }
  },

  getItem<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom event for reactive tab/component updates
      window.dispatchEvent(new Event('bloodbridge_storage_update'));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  },

  // Donors
  getDonors(): any[] {
    this.init();
    return this.getItem(STORAGE_KEYS.DONORS, initialDonors as any[]);
  },

  saveDonors(donors: any[]) {
    this.setItem(STORAGE_KEYS.DONORS, donors);
  },

  // Users
  getUsers(): any[] {
    this.init();
    return this.getItem(STORAGE_KEYS.USERS, initialUsers as any[]);
  },

  saveUsers(users: any[]) {
    this.setItem(STORAGE_KEYS.USERS, users);
  },

  // Requests
  getRequests(): any[] {
    this.init();
    return this.getItem(STORAGE_KEYS.REQUESTS, initialRequests as any[]);
  },

  saveRequests(requests: any[]) {
    this.setItem(STORAGE_KEYS.REQUESTS, requests);
  },

  // Notifications
  getNotifications(): any[] {
    this.init();
    return this.getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications as any[]);
  },

  saveNotifications(notifications: any[]) {
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  // Reports
  getReports() {
    this.init();
    return this.getItem(STORAGE_KEYS.REPORTS, []);
  },

  saveReports(reports: any[]) {
    this.setItem(STORAGE_KEYS.REPORTS, reports);
  },

  // Auth Session
  getCurrentUser() {
    return this.getItem(STORAGE_KEYS.CURRENT_USER, null);
  },

  saveCurrentUser(user: any) {
    if (user) {
      this.setItem(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      window.dispatchEvent(new Event('bloodbridge_storage_update'));
    }
  },

  // Reset to original mock data
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(initialDonors));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(initialRequests));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.dispatchEvent(new Event('bloodbridge_storage_update'));
  }
};
