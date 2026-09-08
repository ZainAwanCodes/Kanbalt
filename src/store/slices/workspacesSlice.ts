import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workspace } from '../../types';

interface WorkspacesState {
  items: Workspace[];
  activeWorkspaceId: string | null;
}

const initialState: WorkspacesState = {
  items: [],
  activeWorkspaceId: null,
};

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    addWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.items.push(action.payload);
      if (!state.activeWorkspaceId) {
        state.activeWorkspaceId = action.payload.id;
      }
    },
    updateWorkspace: (state, action: PayloadAction<{ id: string; changes: Partial<Workspace> }>) => {
      const index = state.items.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.changes };
      }
    },
    deleteWorkspace: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(w => w.id !== action.payload);
      if (state.activeWorkspaceId === action.payload) {
        state.activeWorkspaceId = state.items.length > 0 ? state.items[0].id : null;
      }
    },
    setActiveWorkspace: (state, action: PayloadAction<string>) => {
      state.activeWorkspaceId = action.payload;
    },
  },
});

export const { addWorkspace, updateWorkspace, deleteWorkspace, setActiveWorkspace } = workspacesSlice.actions;
export default workspacesSlice.reducer;
