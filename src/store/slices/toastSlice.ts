import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
  undoAction?: { type: string; payload: any };
}

interface ToastState {
  items: ToastMessage[];
}

const initialState: ToastState = {
  items: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      if (state.items.length >= 3) {
        state.items.shift();
      }
      state.items.push({ ...action.payload, id: uuidv4() });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
