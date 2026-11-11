import { storageService } from './storageService';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'accepted' | 'declined' | 'completed' | 'system';
  read: boolean;
  timestamp: string;
  link?: string;
}

export const notificationService = {
  getNotifications(userId?: string): NotificationItem[] {
    const list: NotificationItem[] = (storageService.getNotifications() || []) as NotificationItem[];
    if (!userId) return list;
    return list.filter((n) => n.userId === userId || n.userId === 'all');
  },

  getUnreadCount(userId?: string): number {
    return this.getNotifications(userId).filter((n) => !n.read).length;
  },

  markAsRead(id: string): void {
    const list = (storageService.getNotifications() || []) as NotificationItem[];
    const item = list.find((n: NotificationItem) => n.id === id);
    if (item) {
      item.read = true;
      storageService.saveNotifications(list);
    }
  },

  markAllAsRead(userId?: string): void {
    const list = (storageService.getNotifications() || []) as NotificationItem[];
    list.forEach((n: NotificationItem) => {
      if (!userId || n.userId === userId || n.userId === 'all') {
        n.read = true;
      }
    });
    storageService.saveNotifications(list);
  },

  createNotification(data: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const list = (storageService.getNotifications() || []) as NotificationItem[];
    const newNotif: NotificationItem = {
      ...data,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      read: false,
      timestamp: new Date().toISOString()
    };
    list.unshift(newNotif);
    storageService.saveNotifications(list);
    return newNotif;
  }
};
