import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// ✅ Import the centralized API engine
import api from '@/lib/axios';

// 1. ✅ FIXED: Fetch Profile without userId (backend extracts from JWT)
export const fetchProfileDetails = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // ✅ Use relative URL - axios baseURL will be prepended
      // Backend extracts userId from Authorization header JWT token
      const response = await api.get('/patient-profile');
      return response.data.data || response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch profile');
    }
  }
);

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  sessionRestored: false, // Track if session restoration attempt completed
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called after Login or Silent Refresh
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload;
      state.token = accessToken;
      // Merge existing user data with new data (preserves fields if backend returns partial data)
      state.user = { ...state.user, ...user }; 
      state.isAuthenticated = true;
      state.sessionRestored = true;
    },
    // Called on Logout
    logoutSuccess: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.sessionRestored = true;
    },
    // Called when user updates profile form
    updateUserData: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    // ✅ NEW: Mark session restoration as complete (even if failed)
    sessionRestorationComplete: (state) => {
      state.sessionRestored = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Profile Fetch Lifecycle
      .addCase(fetchProfileDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfileDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update user with fresh profile details from backend
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(fetchProfileDetails.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setCredentials, logoutSuccess, updateUserData, sessionRestorationComplete } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectSessionRestored = (state) => state.auth.sessionRestored;

export default authSlice.reducer;