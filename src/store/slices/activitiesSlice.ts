import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActivityLog } from '../../types';

interface ActivitiesState {
  items: ActivityLog[];
}

const initialState: ActivitiesState = {
  items: [],
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    logActivity: (state, action: PayloadAction<ActivityLog>) => {
      state.items.unshift(action.payload); // Add to beginning (most recent first)
    },
    clearActivities: (state) => {
      state.items = [];
    }
  },
});

export const { logActivity, clearActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer;
