/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import AuthSwitch from './components/ui/auth-switch';
import { AppLayout } from './components/layout/AppLayout';
import { TaskModal } from './features/tasks/TaskModal';
import { KanbanBoard } from './features/tasks/KanbanBoard';
import { ListView } from './features/tasks/ListView';
import { CalendarView } from './features/tasks/CalendarView';
import { ToastContainer } from './components/ui/ToastContainer';
import { setGlobalView, setAssigneeFilter, setSortConfig } from './store/slices/uiSlice';
import { cn } from './lib/utils';
import { Filter, ArrowUpDown } from 'lucide-react';

export default function App() {
  const { isAuthenticated, mockUsers } = useAppSelector(state => state.auth);
  const { items: projects, activeProjectId } = useAppSelector(state => state.projects);
  const { items: tasks } = useAppSelector(state => state.tasks);
  const uiState = useAppSelector(state => state.ui);
  const { globalView } = uiState;
  const { searchQuery, assigneeId, sortBy, sortOrder } = uiState.filters || {
    searchQuery: '',
    assigneeId: null,
    sortBy: 'none',
    sortOrder: 'desc'
  };
  const dispatch = useAppDispatch();
  
  const activeProject = useMemo(() => 
    projects.find(p => p.id === activeProjectId), 
  [projects, activeProjectId]);

  const projectTasks = useMemo(() => {
    let filtered = tasks.filter(t => t.projectId === activeProjectId && !t.parentTaskId);
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    
    if (assigneeId) {
      filtered = filtered.filter(t => t.assigneeId === assigneeId);
    }

    if (sortBy !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === 'date') {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
        if (sortBy === 'priority') {
          const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
          const pA = priorityWeights[a.priority] || 0;
          const pB = priorityWeights[b.priority] || 0;
          return sortOrder === 'asc' ? pA - pB : pB - pA;
        }
        return 0;
      });
    }

    return filtered;
  }, [tasks, activeProjectId, searchQuery, assigneeId, sortBy, sortOrder]);

  const toggleSort = (type: 'date' | 'priority') => {
    if (sortBy === type) {
      if (sortOrder === 'desc') {
        dispatch(setSortConfig({ sortBy: type, sortOrder: 'asc' }));
      } else {
        dispatch(setSortConfig({ sortBy: 'none', sortOrder: 'desc' }));
      }
    } else {
      dispatch(setSortConfig({ sortBy: type, sortOrder: 'desc' }));
    }
  };

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
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-4 shrink-0 gap-4">
               <div>
                 <h1 className="text-3xl font-heading font-bold text-ink">{activeProject.name}</h1>
                 {activeProject.description && (
                   <p className="text-ink-soft mt-1">{activeProject.description}</p>
                 )}
               </div>
               
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm font-medium">
                 {/* Filters & Sorting */}
                 <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                   <div className="relative group">
                     <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-line text-ink-soft hover:text-ink hover:border-stone/40 transition-all bg-paper">
                       <Filter className="w-3.5 h-3.5" />
                       <span className="whitespace-nowrap">{assigneeId ? 'Filtered' : 'Assignee'}</span>
                     </button>
                     <div className="absolute top-full left-0 mt-1 w-48 bg-paper-2 border border-line rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1">
                       <button 
                         onClick={() => dispatch(setAssigneeFilter(null))}
                         className={cn("w-full text-left px-3 py-1.5 text-sm hover:bg-stone/10", !assigneeId && "text-cobalt font-medium")}
                       >
                         All Assignees
                       </button>
                       {mockUsers.map(u => (
                         <button 
                           key={u.id}
                           onClick={() => dispatch(setAssigneeFilter(u.id))}
                           className={cn("w-full text-left px-3 py-1.5 text-sm hover:bg-stone/10", assigneeId === u.id && "text-cobalt font-medium")}
                         >
                           {u.name}
                         </button>
                       ))}
                     </div>
                   </div>

                   <button 
                     onClick={() => toggleSort('date')}
                     className={cn(
                       "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-ink-soft hover:text-ink transition-all whitespace-nowrap bg-paper",
                       sortBy === 'date' ? "border-cobalt/50 text-cobalt bg-cobalt/5" : "border-line hover:border-stone/40"
                     )}
                   >
                     <ArrowUpDown className="w-3.5 h-3.5" />
                     Due Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                   </button>
                   
                   <button 
                     onClick={() => toggleSort('priority')}
                     className={cn(
                       "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-ink-soft hover:text-ink transition-all whitespace-nowrap bg-paper",
                       sortBy === 'priority' ? "border-cobalt/50 text-cobalt bg-cobalt/5" : "border-line hover:border-stone/40"
                     )}
                   >
                     <ArrowUpDown className="w-3.5 h-3.5" />
                     Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
                   </button>
                 </div>

                 {/* View Tabs */}
                 <div className="flex items-center gap-4 border-l border-line pl-4">
                   <button 
                     onClick={() => dispatch(setGlobalView('kanban'))}
                     className={cn(
                       "pb-4 md:-mb-[17px] whitespace-nowrap transition-colors",
                       globalView === 'kanban' ? "text-ink border-b-2 border-cobalt" : "text-ink-soft hover:text-ink"
                     )}
                   >
                     Kanban
                   </button>
                   <button 
                     onClick={() => dispatch(setGlobalView('list'))}
                     className={cn(
                       "pb-4 md:-mb-[17px] whitespace-nowrap transition-colors",
                       globalView === 'list' ? "text-ink border-b-2 border-cobalt" : "text-ink-soft hover:text-ink"
                     )}
                   >
                     List
                   </button>
                   <button 
                     onClick={() => dispatch(setGlobalView('calendar'))}
                     className={cn(
                       "pb-4 md:-mb-[17px] whitespace-nowrap transition-colors",
                       globalView === 'calendar' ? "text-ink border-b-2 border-cobalt" : "text-ink-soft hover:text-ink"
                     )}
                   >
                     Calendar
                   </button>
                 </div>
               </div>
            </div>
            
            <div className="flex-1 overflow-x-auto overflow-y-hidden mt-6 pb-4">
              {globalView === 'kanban' && (
                <KanbanBoard projectTasks={projectTasks} />
              )}
              {globalView === 'list' && (
                <div className="h-full overflow-auto rounded-md border border-line bg-paper-2">
                  <div className="min-w-[800px] flex items-center p-4 border-b border-line text-xs font-semibold text-ink-soft uppercase tracking-wider sticky top-0 bg-paper-2 z-10 shadow-sm">
                    <div className="flex-1 pl-2">Task Name</div>
                    <div className="w-32">Status</div>
                    <div className="w-32">Priority</div>
                    <div className="w-32">Assignee</div>
                    <div className="w-32 text-right pr-4">Due Date</div>
                  </div>
                  {projectTasks.length === 0 ? (
                    <div className="p-8 text-center text-ink-soft">No tasks found matching criteria.</div>
                  ) : (
                    <div className="divide-y divide-line">
                      {projectTasks.map(task => (
                        <div 
                          key={task.id} 
                          onClick={() => dispatch(openTaskModal({ taskId: task.id }))}
                          className="min-w-[800px] flex items-center p-4 hover:bg-stone/5 cursor-pointer transition-colors group"
                        >
                          <div className="flex-1 pl-2 font-medium text-sm text-ink group-hover:text-cobalt transition-colors">{task.title}</div>
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
                                {mockUsers.find(u => u.id === task.assigneeId)?.name.split(' ').map(n => n[0]).join('')}
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
              )}
              {globalView === 'calendar' && (
                <div className="h-full p-1">
                  <CalendarView tasks={projectTasks} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Global Task Modal */}
      <TaskModal />
      <ToastContainer />
    </AppLayout>
  );
}

