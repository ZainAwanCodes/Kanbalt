/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAppSelector } from './store/hooks';
import AuthSwitch from './components/ui/auth-switch';
import { AppLayout } from './components/layout/AppLayout';

export default function App() {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { items: projects, activeProjectId } = useAppSelector(state => state.projects);
  const activeProject = projects.find(p => p.id === activeProjectId);
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-ink font-body p-6">
        <div className="w-full max-w-md mb-8 text-center space-y-2">
          <div className="w-12 h-12 bg-cobalt text-white rounded-[10px] flex items-center justify-center text-2xl font-heading font-bold mx-auto mb-4">
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
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* View Shell / Phase 2 Success UI */}
            <div className="flex items-end justify-between border-b border-line pb-4">
               <div>
                 <h1 className="text-3xl font-heading font-bold text-ink">{activeProject.name}</h1>
                 {activeProject.description && (
                   <p className="text-ink-soft mt-1">{activeProject.description}</p>
                 )}
               </div>
               
               <div className="flex items-center gap-4 text-sm font-medium">
                 <button className="text-ink border-b-2 border-cobalt pb-4 -mb-[17px]">Kanban</button>
                 <button className="text-ink-soft hover:text-ink transition-colors pb-4 -mb-[17px]">List</button>
                 <button className="text-ink-soft hover:text-ink transition-colors pb-4 -mb-[17px]">Calendar</button>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kanban Column Placeholders - to be built in Phase 4 */}
              {[
                { title: 'To Do', color: 'bg-stone' },
                { title: 'In Progress', color: 'bg-cobalt' },
                { title: 'Done', color: 'bg-moss' }
              ].map(col => (
                <div key={col.title} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 px-1">
                    <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                    <h2 className="font-heading font-medium text-ink text-sm">{col.title}</h2>
                    <span className="text-ink-soft text-sm ml-auto bg-stone/20 px-2 py-0.5 rounded-full">0</span>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full h-12 border border-dashed border-line rounded-md text-ink-soft hover:text-ink hover:border-cobalt/50 hover:bg-cobalt/5 transition-colors flex items-center justify-center text-sm font-medium">
                      + Add task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

