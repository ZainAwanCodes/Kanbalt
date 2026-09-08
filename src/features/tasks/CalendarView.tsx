import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { openTaskModal } from '../../store/slices/uiSlice';
import { Task } from '../../types';
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';
import { cn } from '../../lib/utils';

export function CalendarView({ tasks }: { tasks: Task[] }) {
  const dispatch = useAppDispatch();
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start on Monday
  
  const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  return (
    <div className="h-full flex flex-col rounded-md border border-line bg-paper overflow-hidden">
      <div className="grid grid-cols-7 border-b border-line bg-paper-2 shrink-0">
        {days.map((day, i) => (
          <div key={i} className="p-3 text-center border-r border-line last:border-r-0">
            <div className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1">
              {format(day, 'EEE')}
            </div>
            <div className={cn(
              "text-sm font-medium w-7 h-7 mx-auto flex items-center justify-center rounded-full",
              isSameDay(day, new Date()) ? "bg-cobalt text-white" : "text-ink"
            )}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex-1 grid grid-cols-7 overflow-y-auto">
        {days.map((day, i) => {
          const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
          
          return (
            <div key={i} className="min-h-[150px] p-2 border-r border-line last:border-r-0 bg-stone/5">
              <div className="space-y-2">
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => dispatch(openTaskModal({ taskId: task.id }))}
                    className={cn(
                      "text-xs p-2 rounded-md border shadow-sm cursor-pointer hover:shadow transition-all truncate group",
                      task.status === 'done' ? "bg-paper/50 border-line text-ink-soft line-through" : "bg-paper border-cobalt/20 text-ink hover:border-cobalt/50"
                    )}
                  >
                    <span className="group-hover:text-cobalt transition-colors">{task.title}</span>
                  </div>
                ))}
                
                {dayTasks.length === 0 && (
                  <div className="text-[10px] text-ink-soft/50 text-center pt-4">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
