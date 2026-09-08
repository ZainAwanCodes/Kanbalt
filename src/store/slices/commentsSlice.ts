import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '../../types';

interface CommentsState {
  items: Comment[];
}

const initialState: CommentsState = {
  items: [],
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<Comment>) => {
      state.items.push(action.payload);
    },
    updateComment: (state, action: PayloadAction<{ id: string; content: string; updatedAt: string }>) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index].content = action.payload.content;
        state.items[index].updatedAt = action.payload.updatedAt;
      }
    },
    deleteComment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(c => c.id !== action.payload);
    },
  },
});

export const { addComment, updateComment, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;
