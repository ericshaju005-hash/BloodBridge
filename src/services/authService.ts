import { storageService } from './storageService';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'user' | 'donor' | 'patient';
  bloodGroup: string;
  state: string;
  city: string;
  pincode: string;
  isDonor?: boolean;
  donorId?: string;
  avatar?: string;
  bio?: string;
  phoneVisibility?: 'visible' | 'request_only' | 'hidden';
}

export const authService = {
  getCurrentUser(): User | null {
    return storageService.getCurrentUser();
  },

  loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = storageService.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    
    const matched = users.find((u: any) => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      return { success: false, error: 'No demo account found with this email address.' };
    }

    if (matched.password !== password) {
      return { success: false, error: 'Incorrect password for demo account.' };
    }

    const { password: _, ...userSafe } = matched;
    storageService.saveCurrentUser(userSafe);
    return { success: true, user: userSafe as User };
  },

  registerUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    bloodGroup?: string;
    state?: string;
    city?: string;
    pincode?: string;
    isDonor?: boolean;
    phoneVisibility?: 'visible' | 'request_only' | 'hidden';
  }): { success: boolean; user?: User; error?: string } {
    const users = storageService.getUsers();
    const cleanEmail = userData.email.trim().toLowerCase();

    if (users.some((u: any) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists in demo storage.' };
    }

    const newId = `user-${Date.now()}`;
    const newUser: any = {
      id: newId,
      name: userData.name.trim(),
      email: cleanEmail,
      phone: userData.phone.trim(),
      password: userData.password,
      role: userData.isDonor ? 'donor' : 'user',
      bloodGroup: userData.bloodGroup || 'O+',
      state: userData.state || 'Maharashtra',
      city: userData.city || 'Mumbai',
      pincode: userData.pincode || '400001',
      isDonor: !!userData.isDonor,
      phoneVisibility: userData.phoneVisibility || 'request_only',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      bio: 'Voluntary community supporter on BloodBridge India.'
    };

    users.push(newUser);
    storageService.saveUsers(users);

    const { password: _, ...userSafe } = newUser;
    storageService.saveCurrentUser(userSafe);
    return { success: true, user: userSafe as User };
  },

  logoutUser(): void {
    storageService.saveCurrentUser(null);
  },

  updateProfile(userId: string, updates: Partial<User>): { success: boolean; user?: User; error?: string } {
    const users = storageService.getUsers();
    const index = users.findIndex((u: any) => u.id === userId);
    if (index === -1) {
      return { success: false, error: 'User not found in demo storage.' };
    }

    users[index] = { ...users[index], ...updates };
    storageService.saveUsers(users);

    const currentUser = storageService.getCurrentUser() as User | null;
    if (currentUser && currentUser.id === userId) {
      const { password: _, ...userSafe } = users[index];
      storageService.saveCurrentUser(userSafe);
      return { success: true, user: userSafe };
    }

    return { success: true, user: users[index] };
  },

  updatePassword(userId: string, oldPass: string, newPass: string): { success: boolean; error?: string } {
    const users = storageService.getUsers();
    const index = users.findIndex((u: any) => u.id === userId);
    if (index === -1) {
      return { success: false, error: 'User not found.' };
    }

    if (users[index].password !== oldPass) {
      return { success: false, error: 'Current password does not match demo record.' };
    }

    users[index].password = newPass;
    storageService.saveUsers(users);
    return { success: true };
  }
};
