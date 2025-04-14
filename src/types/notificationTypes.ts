export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    read: boolean;
  }
  
  export interface NotificationsState {
    notifications: Notification[];
  }
