import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workspacesReducer from './slices/workspacesSlice';
import projectsReducer from './slices/projectsSlice';
import tasksReducer from './slices/tasksSlice';
import uiReducer from './slices/uiSlice';

// Load state from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('kanbalt_state');
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    
    // Migration/Fix: Ensure ui.taskModal exists if state was saved before it was added
    if (state && state.ui && !state.ui.taskModal) {
      state.ui.taskModal = {
        isOpen: false,
        taskId: null,
        defaultStatus: 'todo',
      };
    }
    
    return state;
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

// Save state to local storage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('kanbalt_state', serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const preloadedState = loadState();

const rootReducer = combineReducers({
  auth: authReducer,
  workspaces: workspacesReducer,
  projects: projectsReducer,
  tasks: tasksReducer,
  ui: uiReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloadedState as any,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
