import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    id: number;
    email: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthState {
  user: { id: number; email: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoaded: boolean; // ✅ new
}


const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoaded: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: AuthState['user']; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoaded = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    loadAuthFromStorage: (state, action: PayloadAction<{ user: AuthState['user']; token: string } | null>) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
      state.isLoaded = true; // ✅ mark it ready regardless
    }
  },
});

export const { loginSuccess, logout, loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
