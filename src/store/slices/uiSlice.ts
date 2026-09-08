import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewType } from '../../types';

interface UiState {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  isCommandPaletteOpen: boolean;
  globalView: ViewType;
}

const initialState: UiState = {
  theme: 'light',
  isSidebarOpen: true,
  isCommandPaletteOpen: false,
  globalView: 'kanban',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.isCommandPaletteOpen = action.payload;
    },
    setGlobalView: (state, action: PayloadAction<ViewType>) => {
      state.globalView = action.payload;
    }
  },
});

export const { toggleTheme, setSidebarOpen, setCommandPaletteOpen, setGlobalView } = uiSlice.actions;
export default uiSlice.reducer;
