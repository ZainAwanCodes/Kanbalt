import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewType, TaskStatus } from '../../types';

interface UiState {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  isCommandPaletteOpen: boolean;
  globalView: ViewType;
  taskModal: {
    isOpen: boolean;
    taskId: string | null;
    defaultStatus: TaskStatus;
  };
}

const initialState: UiState = {
  theme: 'light',
  isSidebarOpen: true,
  isCommandPaletteOpen: false,
  globalView: 'kanban',
  taskModal: {
    isOpen: false,
    taskId: null,
    defaultStatus: 'todo',
  }
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
    },
    openTaskModal: (state, action: PayloadAction<{ taskId?: string | null; defaultStatus?: TaskStatus }>) => {
      state.taskModal.isOpen = true;
      state.taskModal.taskId = action.payload.taskId || null;
      state.taskModal.defaultStatus = action.payload.defaultStatus || 'todo';
    },
    closeTaskModal: (state) => {
      state.taskModal.isOpen = false;
      state.taskModal.taskId = null;
    }
  },
});

export const { toggleTheme, setSidebarOpen, setCommandPaletteOpen, setGlobalView, openTaskModal, closeTaskModal } = uiSlice.actions;
export default uiSlice.reducer;
