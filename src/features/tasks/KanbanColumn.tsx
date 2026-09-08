import React, { useMemo } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { openTaskModal } from '../../store/slices/uiSlice';
import { Task, TaskStatus } from '../../types';
import { CheckSquare } from 'lucide-react';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  allTasks: Task[]; // Need all tasks to count subtasks (or could calculate this before passing down)
  onAddTask: (status: TaskStatus) => void;
}

export const KanbanColumn = React.memo(function KanbanColumn({ 
  id, 
  title, 
  color, 
  tasks, 
  allTasks, 
  onAddTask 
}: KanbanColumnProps) {
  const dispatch = useAppDispatch();
  const colTasks = useMemo(() => tasks.filter(t => t.status === id), [tasks, id]);

  return (
    <div className="flex flex-col gap-4 w-80 shrink-0 h-full">
      <div className="flex items-center gap-2 px-1">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <h2 className="font-heading font-medium text-ink text-sm">{title}</h2>
        <span className="text-ink-soft text-sm ml-auto bg-stone/20 px-2 py-0.5 rounded-full">
          {colTasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2 min-h-[100px]">
        {colTasks.map(task => {
          // Optimized: Only filter when task or allTasks change, but doing it inline is fine for this scale. 
          // Ideally subtask count is pre-calculated but we'll do it here for now.
          const subtasksCount = allTasks.filter(t => t.parentTaskId === task.id).length;
          const completedSubtasks = allTasks.filter(t => t.parentTaskId === task.id && t.status === 'done').length;
          
          return (
            <div 
              key={task.id}
              onClick={() => dispatch(openTaskModal({ taskId: task.id }))}
              className="bg-paper-2 rounded-md border border-line shadow-sm p-4 hover:border-cobalt/40 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-medium text-ink leading-snug group-hover:text-cobalt transition-colors">
                  {task.title}
                </h3>
                {task.priority === 'urgent' && <div className="w-2 h-2 rounded-full bg-amber shrink-0 mt-1"></div>}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-[6px] bg-stone/20 text-ink flex items-center justify-center font-semibold text-[10px]">
                    {task.assigneeId ? 'AC' : '?'}
                  </div>
                  {subtasksCount > 0 && (
                    <div className="flex items-center gap-1 text-xs font-medium text-ink-soft">
                      <CheckSquare className="w-3.5 h-3.5" />
                      {completedSubtasks}/{subtasksCount}
                    </div>
                  )}
                </div>
                {task.dueDate && (
                  <span className="text-[10px] font-medium text-ink-soft bg-stone/20 px-1.5 py-0.5 rounded">
                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <button 
          onClick={() => onAddTask(id)}
          className="w-full h-10 border border-dashed border-line rounded-md text-ink-soft hover:text-ink hover:border-cobalt/50 hover:bg-cobalt/5 transition-colors flex items-center justify-center text-sm font-medium"
        >
          + Add task
        </button>
      </div>
    </div>
  );
});
