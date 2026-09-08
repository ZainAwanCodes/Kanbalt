import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { addWorkspace } from '../../store/slices/workspacesSlice';
import { addProject, setActiveProject } from '../../store/slices/projectsSlice';
import { cn } from '../../lib/utils';
import { v4 as uuidv4 } from 'uuid';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { isSidebarOpen } = useAppSelector(state => state.ui);
  const { items: workspaces } = useAppSelector(state => state.workspaces);
  const { items: projects, activeProjectId } = useAppSelector(state => state.projects);
  const { currentUser } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  // Seed default data if empty
  useEffect(() => {
    if (workspaces.length === 0 && currentUser) {
      const wsId = uuidv4();
      const projId = uuidv4();
      dispatch(addWorkspace({ 
        id: wsId, 
        name: `${currentUser.name}'s Workspace`, 
        members: [{ userId: currentUser.id, role: 'owner' }], 
        defaultView: 'kanban', 
        createdAt: new Date().toISOString() 
      }));
      dispatch(addProject({ 
        id: projId, 
        workspaceId: wsId, 
        name: "Welcome to Kanbalt", 
        description: "Get started by exploring tasks or creating your own project.",
        members: [currentUser.id], 
        isArchived: false, 
        createdAt: new Date().toISOString(), 
        color: "bg-cobalt" 
      }));
      dispatch(setActiveProject(projId));
    } else if (projects.length > 0 && !activeProjectId && workspaces.length > 0) {
      // Auto-select first project of active workspace if none selected
      const firstProj = projects.find(p => p.workspaceId === workspaces[0]?.id && !p.isArchived);
      if (firstProj) {
        dispatch(setActiveProject(firstProj.id));
      }
    }
  }, [workspaces.length, projects.length, currentUser, dispatch, activeProjectId]);

  return (
    <div className="min-h-screen flex w-full bg-paper text-ink font-body overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-20 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 h-screen",
          isSidebarOpen ? "md:ml-64" : "md:ml-16"
        )}
      >
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto bg-paper">
          {children}
        </main>
      </div>
    </div>
  );
}
