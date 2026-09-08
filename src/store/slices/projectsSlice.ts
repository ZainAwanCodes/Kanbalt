import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../types';

interface ProjectsState {
  items: Project[];
  activeProjectId: string | null;
}

const initialState: ProjectsState = {
  items: [],
  activeProjectId: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.items.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<{ id: string; changes: Partial<Project> }>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.changes };
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
      if (state.activeProjectId === action.payload) {
        state.activeProjectId = null;
      }
    },
    archiveProject: (state, action: PayloadAction<string>) => {
      const project = state.items.find(p => p.id === action.payload);
      if (project) {
        project.isArchived = true;
      }
    },
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
    },
  },
});

export const { addProject, updateProject, deleteProject, archiveProject, setActiveProject } = projectsSlice.actions;
export default projectsSlice.reducer;
