import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewType, TaskStatus } from '../../types';

interface UiState {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  isCommandPaletteOpen: boolean;
  isProfileModalOpen: boolean;
  globalView: ViewType;
  taskModal: {
    isOpen: boolean;
    taskId: string | null;
    defaultStatus: TaskStatus;
  };
  filters: {
    searchQuery: string;
    assigneeId: string | null;
    sortBy: 'date' | 'priority' | 'none';
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: UiState = {
  theme: 'light',
  isSidebarOpen: true,
  isCommandPaletteOpen: false,
  isProfileModalOpen: false,
  globalView: 'kanban',
  taskModal: {
    isOpen: false,
    taskId: null,
    defaultStatus: 'todo',
  },
  filters: {
    searchQuery: '',
    assigneeId: null,
    sortBy: 'none',
    sortOrder: 'desc',
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
    setProfileModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isProfileModalOpen = action.payload;
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
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setAssigneeFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.assigneeId = action.payload;
    },
    setSortConfig: (state, action: PayloadAction<{ sortBy: 'date' | 'priority' | 'none', sortOrder: 'asc' | 'desc' }>) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    }
  },
});

export const { 
  toggleTheme, 
  setSidebarOpen, 
  setCommandPaletteOpen, 
  setProfileModalOpen,
  setGlobalView, 
  openTaskModal, 
  closeTaskModal,
  setSearchQuery,
  setAssigneeFilter,
  setSortConfig
} = uiSlice.actions;
export default uiSlice.reducer;
