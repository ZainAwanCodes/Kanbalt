import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openTaskModal } from '../../store/slices/uiSlice';
import { Task } from '../../types';
import { cn } from '../../lib/utils';

export function ListView({ tasks }: { tasks: Task[] }) {
  const dispatch = useAppDispatch();
  const { mockUsers } = useAppSelector(state => state.auth);

  return (
    <div className="h-full overflow-auto rounded-md border border-line bg-paper-2">
      <div className="min-w-[800px] flex items-center p-4 border-b border-line text-xs font-semibold text-ink-soft uppercase tracking-wider sticky top-0 bg-paper-2 z-10 shadow-sm">
        <div className="flex-1 pl-2">Task Name</div>
        <div className="w-32">Status</div>
        <div className="w-32">Priority</div>
        <div className="w-32">Assignee</div>
        <div className="w-32 text-right pr-4">Due Date</div>
      </div>
      {tasks.length === 0 ? (
        <div className="p-8 text-center text-ink-soft">No tasks found matching criteria.</div>
      ) : (
        <div className="divide-y divide-line">
          {tasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => dispatch(openTaskModal({ taskId: task.id }))}
              className="min-w-[800px] flex items-center p-4 hover:bg-stone/5 cursor-pointer transition-colors group bg-paper"
            >
              <div className={cn(
                "flex-1 pl-2 font-medium text-sm transition-colors",
                task.status === 'done' ? "text-ink-soft line-through" : "text-ink group-hover:text-cobalt"
              )}>
                {task.title}
              </div>
              <div className="w-32">
                <span className="text-xs px-2 py-1 bg-stone/10 rounded-full">{task.status}</span>
              </div>
              <div className="w-32 flex items-center gap-1.5">
                {task.priority === 'urgent' && <div className="w-1.5 h-1.5 rounded-full bg-amber" />}
                <span className="text-sm text-ink-soft capitalize">{task.priority}</span>
              </div>
              <div className="w-32">
                {task.assigneeId ? (
                  <div className="w-6 h-6 rounded bg-stone/20 text-ink flex items-center justify-center font-semibold text-[10px]" title={mockUsers.find(u => u.id === task.assigneeId)?.name}>
                    {mockUsers.find(u => u.id === task.assigneeId)?.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                ) : (
                  <span className="text-sm text-ink-soft">--</span>
                )}
              </div>
              <div className="w-32 text-right pr-4 text-sm text-ink-soft">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '--'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
