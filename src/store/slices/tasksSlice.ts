import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';

interface TasksState {
  items: Task[];
  selectedTaskIds: string[]; // For bulk actions
  searchQuery: string;
}

const initialState: TasksState = {
  items: [],
  selectedTaskIds: [],
  searchQuery: '',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<{ id: string; changes: Partial<Task> }>) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.changes };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload && t.parentTaskId !== action.payload); // cascade delete subtasks
      state.selectedTaskIds = state.selectedTaskIds.filter(id => id !== action.payload);
    },
    toggleTaskSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedTaskIds.indexOf(action.payload);
      if (index === -1) {
        state.selectedTaskIds.push(action.payload);
      } else {
        state.selectedTaskIds.splice(index, 1);
      }
    },
    clearTaskSelection: (state) => {
      state.selectedTaskIds = [];
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    }
  },
});

export const { addTask, updateTask, deleteTask, toggleTaskSelection, clearTaskSelection, setSearchQuery } = tasksSlice.actions;
export default tasksSlice.reducer;
