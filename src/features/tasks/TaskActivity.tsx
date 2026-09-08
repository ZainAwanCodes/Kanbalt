import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';

interface TaskActivityProps {
  taskId: string;
}

export function TaskActivity({ taskId }: TaskActivityProps) {
  const { items: activities } = useAppSelector(state => state.activities);
  const { mockUsers } = useAppSelector(state => state.auth);
  
  const taskActivities = activities
    .filter(a => a.taskId === taskId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (taskActivities.length === 0) return null;

  return (
    <div className="space-y-4 pt-6 border-t border-line mt-6">
      <div className="flex items-center gap-2 text-ink font-medium">
        <Activity className="w-4 h-4 text-ink-soft" />
        <h3 className="text-sm">Activity</h3>
      </div>
      
      <div className="space-y-3">
        {taskActivities.map(activity => {
          const user = mockUsers.find(u => u.id === activity.userId);
          
          return (
            <div key={activity.id} className="flex gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-stone/20 flex items-center justify-center text-xs font-medium text-ink shrink-0 mt-0.5">
                {user?.avatar || user?.name.charAt(0) || '?'}
              </div>
              <div>
                <span className="font-semibold text-ink">{user?.name || 'Unknown'}</span>{' '}
                <span className="text-ink-soft">{activity.details || `performed ${activity.action}`}</span>
                <div className="text-xs text-ink-soft/70 mt-0.5">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
