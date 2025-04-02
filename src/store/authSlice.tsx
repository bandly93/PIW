import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    id: number;
    email: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoaded: false,
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

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoaded = true;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    loadAuthFromStorage: (
      state,
      action: PayloadAction<{ user: AuthState['user']; token: string } | null>
    ) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
      state.isLoaded = true;
    },
  },
});

export const { loginSuccess, logout, loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
