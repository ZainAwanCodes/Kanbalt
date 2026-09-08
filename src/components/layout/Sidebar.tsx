import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { cn } from '../../lib/utils';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { setActiveWorkspace } from '../../store/slices/workspacesSlice';
import { setActiveProject } from '../../store/slices/projectsSlice';
import { WorkspaceModal } from '../../features/workspaces/WorkspaceModal';
import { ProjectModal } from '../../features/projects/ProjectModal';
import { 
  ChevronDown, Plus, Settings, 
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { Workspace } from '../../types';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
}

export function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const dispatch = useAppDispatch();
  const { isSidebarOpen } = useAppSelector(state => state.ui);
  const { items: workspaces, activeWorkspaceId } = useAppSelector(state => state.workspaces);
  const { items: projects, activeProjectId } = useAppSelector(state => state.projects);
  
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const activeProjects = projects.filter(p => p.workspaceId === activeWorkspaceId && !p.isArchived);

  const [isWsModalOpen, setIsWsModalOpen] = useState(false);
  const [wsToEdit, setWsToEdit] = useState<Workspace | null>(null);
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);

  return (
    <>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-paper-2 border-r border-line transition-all duration-300",
        isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
        !isMobileMenuOpen && !isSidebarOpen ? "md:w-16" : "md:w-64"
      )}>
         {/* Header / Workspace Switcher Trigger */}
         <div className="h-14 border-b border-line flex items-center justify-between px-4">
            <button 
              onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
              className="flex items-center gap-3 w-full overflow-hidden hover:bg-stone/10 p-1.5 -ml-1.5 rounded-md transition-colors text-left"
            >
               <div className="w-8 h-8 rounded-[8px] bg-cobalt text-white flex items-center justify-center font-heading font-bold shrink-0 shadow-sm">
                 {activeWorkspace?.name.charAt(0) || 'K'}
               </div>
               {isSidebarOpen && (
                 <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
                   <span className="font-heading font-semibold text-ink truncate text-sm">
                     {activeWorkspace?.name || 'Select Workspace'}
                   </span>
                   <ChevronDown className="w-4 h-4 text-ink-soft shrink-0" />
                 </div>
               )}
            </button>
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-8">
            {/* Projects Section */}
            <div className="px-3">
               {isSidebarOpen ? (
                 <div className="flex items-center justify-between px-2 mb-3 group">
                   <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Projects</span>
                   <button 
                     onClick={() => setIsProjModalOpen(true)} 
                     className="opacity-0 group-hover:opacity-100 text-ink-soft hover:text-ink hover:bg-stone/20 p-1 rounded-md transition-all"
                   >
                     <Plus className="w-4 h-4" />
                   </button>
                 </div>
               ) : (
                 <div className="flex justify-center mb-4 border-b border-line pb-4">
                   <button 
                     onClick={() => setIsProjModalOpen(true)} 
                     className="text-ink-soft hover:text-ink hover:bg-stone/20 p-2 rounded-md transition-colors"
                     title="Create Project"
                   >
                     <Plus className="w-5 h-5" />
                   </button>
                 </div>
               )}

               <div className="space-y-1">
                 {activeProjects.map(project => (
                   <button
                     key={project.id}
                     onClick={() => {
                       dispatch(setActiveProject(project.id));
                       setIsMobileMenuOpen(false); // Auto close on mobile selection
                     }}
                     className={cn(
                       "w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors group",
                       activeProjectId === project.id 
                         ? "bg-stone/20 text-ink font-medium" 
                         : "text-ink-soft hover:bg-stone/10 hover:text-ink",
                       !isSidebarOpen && "justify-center px-0"
                     )}
                     title={project.name}
                   >
                     <div className={cn("w-2.5 h-2.5 rounded-[3px] shrink-0", project.color || 'bg-cobalt')} />
                     {isSidebarOpen && (
                       <span className="truncate group-hover:translate-x-0.5 transition-transform">
                         {project.name}
                       </span>
                     )}
                   </button>
                 ))}
                 
                 {activeProjects.length === 0 && isSidebarOpen && (
                   <div className="px-2 py-4 text-sm text-ink-soft italic">
                     No projects yet.
                   </div>
                 )}
               </div>
            </div>
         </div>

         {/* Footer Actions */}
         <div className="p-3 border-t border-line flex flex-col gap-1">
            <button 
              onClick={() => { setWsToEdit(activeWorkspace || null); setIsWsModalOpen(true); }} 
              className={cn(
                "flex items-center gap-3 px-2 py-2 rounded-md text-sm text-ink-soft hover:bg-stone/10 hover:text-ink transition-colors", 
                !isSidebarOpen && "justify-center px-0"
              )}
              title="Workspace Settings"
            >
              <Settings className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Settings</span>}
            </button>
            <button 
              onClick={() => dispatch(setSidebarOpen(!isSidebarOpen))} 
              className={cn(
                "hidden md:flex items-center gap-3 px-2 py-2 rounded-md text-sm text-ink-soft hover:bg-stone/10 hover:text-ink transition-colors", 
                !isSidebarOpen && "justify-center px-0"
              )}
              title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4 shrink-0" /> : <PanelLeftOpen className="w-4 h-4 shrink-0" />}
              {isSidebarOpen && <span>Collapse sidebar</span>}
            </button>
         </div>
      </aside>

      {/* Workspace Dropdown Overlay */}
      {isWsDropdownOpen && (
         <div className="fixed inset-0 z-40" onClick={() => setIsWsDropdownOpen(false)}>
            <div 
              className="absolute top-14 left-4 w-64 bg-paper-2 border border-line rounded-[10px] shadow-lg p-2" 
              onClick={e => e.stopPropagation()}
            >
               <div className="text-xs font-semibold text-ink-soft uppercase tracking-wider px-2 py-2">
                 Switch Workspace
               </div>
               <div className="max-h-64 overflow-y-auto space-y-1">
                 {workspaces.map(w => (
                   <button
                     key={w.id}
                     onClick={() => { 
                       dispatch(setActiveWorkspace(w.id)); 
                       setIsWsDropdownOpen(false); 
                     }}
                     className="w-full flex items-center justify-between px-2 py-2 rounded-md text-sm hover:bg-stone/10 transition-colors"
                   >
                     <span className={cn("truncate", activeWorkspaceId === w.id ? "font-semibold text-ink" : "font-medium text-ink-soft")}>
                       {w.name}
                     </span>
                     {activeWorkspaceId === w.id && <div className="w-1.5 h-1.5 rounded-full bg-cobalt shrink-0" />}
                   </button>
                 ))}
               </div>
               <div className="h-px bg-line my-2 mx-1" />
               <button 
                 onClick={() => { 
                   setWsToEdit(null);
                   setIsWsModalOpen(true); 
                   setIsWsDropdownOpen(false); 
                 }} 
                 className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium text-cobalt hover:bg-cobalt/10 transition-colors"
               >
                 <Plus className="w-4 h-4" />
                 <span>Create new workspace</span>
               </button>
            </div>
         </div>
      )}

      {/* Modals */}
      <WorkspaceModal isOpen={isWsModalOpen} onClose={() => { setIsWsModalOpen(false); setWsToEdit(null); }} workspaceToEdit={wsToEdit} />
      <ProjectModal isOpen={isProjModalOpen} onClose={() => setIsProjModalOpen(false)} />
    </>
  );
}
