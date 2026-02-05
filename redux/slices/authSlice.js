import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

// Fetch Patient Profile
export const fetchProfileDetails = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
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
  role: null, 
  isAuthenticated: false,
  status: 'idle',
  sessionRestored: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user, role } = action.payload;
      state.token = accessToken;
      state.user = { ...state.user, ...user }; 
      
      // ✅ CHANGED: Removed default 'patient'. 
      // If role is undefined, it should be null to prevent access issues.
      state.role = role || user?.role || null; 
      
      state.isAuthenticated = true;
      state.sessionRestored = true;
    },
    logoutSuccess: (state) => {
      state.token = null;
      state.user = null;
      state.role = null; 
      state.isAuthenticated = false;
      state.status = 'idle';
      state.sessionRestored = true;
    },
    updateUserData: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    sessionRestorationComplete: (state) => {
      state.sessionRestored = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfileDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
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
export const selectUserRole = (state) => state.auth.role; 

export default authSlice.reducer;