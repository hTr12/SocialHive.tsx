import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification, NotificationsState } from "../../types/notificationTypes";

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>) => {
      const newNotification: Notification = {
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type,
        read: false
      };
      state.notifications.push(newNotification);
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, markAsRead, removeNotification, clearAllNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;