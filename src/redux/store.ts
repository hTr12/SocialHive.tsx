import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/postsSlice";
import userReducer from "./slices/userSlice";
import notificationsReducer from "./slices/notificationsSlice";

const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;