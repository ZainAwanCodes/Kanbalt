/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import AuthSwitch from './components/ui/auth-switch';
import { AppLayout } from './components/layout/AppLayout';
import { TaskModal } from './features/tasks/TaskModal';
import { KanbanColumn } from './features/tasks/KanbanColumn';
import { openTaskModal } from './store/slices/uiSlice';
import { TaskStatus } from './types';

const COLUMNS = [
  { id: 'todo' as TaskStatus, title: 'To Do', color: 'bg-stone' },
  { id: 'in-progress' as TaskStatus, title: 'In Progress', color: 'bg-cobalt' },
  { id: 'done' as TaskStatus, title: 'Done', color: 'bg-moss' }
];

export default function App() {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { items: projects, activeProjectId } = useAppSelector(state => state.projects);
  const { items: tasks } = useAppSelector(state => state.tasks);
  const dispatch = useAppDispatch();
  
  const activeProject = useMemo(() => 
    projects.find(p => p.id === activeProjectId), 
  [projects, activeProjectId]);

  const projectTasks = useMemo(() => 
    tasks.filter(t => t.projectId === activeProjectId && !t.parentTaskId),
  [tasks, activeProjectId]);

  const handleCreateTask = useCallback((status: TaskStatus) => {
    dispatch(openTaskModal({ taskId: null, defaultStatus: status }));
  }, [dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-ink font-body p-6">
        <div className="w-full max-w-md mb-8 text-center space-y-2">
          <div className="w-12 h-12 bg-cobalt text-white rounded-[10px] flex items-center justify-center text-2xl font-heading font-bold mx-auto mb-4 shadow-sm">
            K
          </div>
          <h1 className="text-3xl font-heading font-bold text-ink tracking-tight">Kanbalt</h1>
          <p className="text-ink-soft">A seamless workspace for your team.</p>
        </div>
        <AuthSwitch />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
        {!activeProject ? (
           <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
             <div className="w-16 h-16 bg-stone/20 rounded-[10px] flex items-center justify-center mb-2">
               <span className="text-2xl">📋</span>
             </div>
             <h2 className="text-2xl font-heading font-bold text-ink">No Project Selected</h2>
             <p className="text-ink-soft max-w-readable">
               Select a project from the sidebar or create a new one to start managing your tasks.
             </p>
           </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* View Shell / Phase 2 & 3 Success UI */}
            <div className="flex items-end justify-between border-b border-line pb-4 shrink-0">
               <div>
                 <h1 className="text-3xl font-heading font-bold text-ink">{activeProject.name}</h1>
                 {activeProject.description && (
                   <p className="text-ink-soft mt-1">{activeProject.description}</p>
                 )}
               </div>
               
               <div className="flex items-center gap-4 text-sm font-medium overflow-x-auto no-scrollbar px-1">
                 <button className="text-ink border-b-2 border-cobalt pb-4 -mb-[17px] whitespace-nowrap">Kanban</button>
                 <button className="text-ink-soft hover:text-ink transition-colors pb-4 -mb-[17px] whitespace-nowrap">List</button>
                 <button className="text-ink-soft hover:text-ink transition-colors pb-4 -mb-[17px] whitespace-nowrap">Calendar</button>
               </div>
            </div>
            
            <div className="flex-1 overflow-x-auto overflow-y-hidden mt-6 pb-4">
              <div className="flex gap-6 h-full min-w-max">
                {/* Kanban Column Structure */}
                {COLUMNS.map(col => (
                  <KanbanColumn 
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    color={col.color}
                    tasks={projectTasks}
                    allTasks={tasks}
                    onAddTask={handleCreateTask}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Global Task Modal */}
      <TaskModal />
    </AppLayout>
  );
}

