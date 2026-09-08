import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  mockUsers: User[]; // Used to simulate switching between users
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  mockUsers: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        // Also update in mockUsers list so UI reflects globally
        const index = state.mockUsers.findIndex(u => u.id === state.currentUser!.id);
        if (index !== -1) {
          state.mockUsers[index] = { ...state.mockUsers[index], ...action.payload };
        }
      }
    },
    addMockUser: (state, action: PayloadAction<User>) => {
      state.mockUsers.push(action.payload);
    },
    setMockUsers: (state, action: PayloadAction<User[]>) => {
      state.mockUsers = action.payload;
    }
  },
});

export const { login, logout, updateProfile, addMockUser, setMockUsers } = authSlice.actions;
export default authSlice.reducer;
