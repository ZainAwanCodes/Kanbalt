import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addComment } from '../../store/slices/commentsSlice';
import { logActivity } from '../../store/slices/activitiesSlice';
import { v4 as uuidv4 } from 'uuid';
import { MessageSquare, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskCommentsProps {
  taskId: string;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  const dispatch = useAppDispatch();
  const { items: comments } = useAppSelector(state => state.comments);
  const { mockUsers, currentUser } = useAppSelector(state => state.auth);
  const taskComments = comments.filter(c => c.taskId === taskId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    const commentId = uuidv4();
    const now = new Date().toISOString();

    dispatch(addComment({
      id: commentId,
      taskId,
      userId: currentUser.id,
      content: newComment.trim(),
      createdAt: now,
      updatedAt: now,
    }));

    // Mock an activity log
    dispatch(logActivity({
      id: uuidv4(),
      workspaceId: '', // Ideally we'd pass workspaceId down, but let's leave it empty or get it from active project
      taskId,
      userId: currentUser.id,
      action: 'commented',
      details: 'Added a comment',
      createdAt: now,
    }));

    setNewComment('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-ink font-medium">
        <MessageSquare className="w-4 h-4 text-ink-soft" />
        <h3>Comments</h3>
        <span className="bg-stone/20 text-ink-soft text-xs px-2 py-0.5 rounded-full ml-2">
          {taskComments.length}
        </span>
      </div>

      <div className="space-y-4">
        {taskComments.map(comment => {
          const user = mockUsers.find(u => u.id === comment.userId);
          return (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-stone/20 flex items-center justify-center text-sm font-medium text-ink shrink-0">
                {user?.avatar || user?.name.charAt(0) || '?'}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{user?.name || 'Unknown'}</span>
                  <span className="text-xs text-ink-soft">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-sm text-ink bg-paper p-3 rounded-md border border-line rounded-tl-none">
                  {comment.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 items-end pt-2">
        <div className="w-8 h-8 rounded-full bg-stone/20 flex items-center justify-center text-sm font-medium text-ink shrink-0 mb-1">
          {currentUser?.avatar || currentUser?.name.charAt(0)}
        </div>
        <div className="flex-1 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask a question or post an update..."
            className="w-full min-h-[40px] bg-paper border border-line rounded-md py-2 px-3 pr-10 text-sm focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all resize-y"
          />
          <button 
            type="submit"
            disabled={!newComment.trim()}
            className="absolute right-2 bottom-2 p-1.5 bg-cobalt text-white rounded-md hover:bg-cobalt-dark disabled:opacity-50 disabled:hover:bg-cobalt transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
