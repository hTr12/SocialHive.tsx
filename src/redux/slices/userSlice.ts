import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "../../types/userTypes";

const initialState: UserState = {
  currentUser: null,
  users: [
    { 
      id: 1, 
      username: 'demo', 
      email: 'demo@example.com', 
      password: 'demo123', 
      isLoggedIn: false 
    }
  ],
  status: 'idle',
  error: null
};

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      return new Promise<User>((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now(),
            username: userData.username,
            email: userData.email,
            password: userData.password,
            isLoggedIn: true
          });
        }, 1000);
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; password: string }>) => {
      const user = state.users.find(u => 
        u.username === action.payload.username && 
        u.password === action.payload.password
      );
      
      if (user) {
        state.currentUser = { ...user, isLoggedIn: true };
      }
    },
    logout: (state) => {
      if (state.currentUser) {
        state.currentUser.isLoggedIn = false;
        state.currentUser = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
        state.currentUser = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;