import { Menu, Search, Bell } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { items: projects, activeProjectId } = useAppSelector(state => state.projects);
  const { currentUser } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <header className="h-14 border-b border-line bg-paper-2 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick} 
          className="md:hidden p-1.5 -ml-1.5 text-ink-soft hover:text-ink hover:bg-stone/20 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
           {activeProject ? (
             <>
               <div className={`w-2.5 h-2.5 rounded-[3px] ${activeProject.color || 'bg-cobalt'}`} />
               <span className="text-ink font-semibold">{activeProject.name}</span>
               {activeProject.description && (
                 <span className="hidden md:inline text-ink-soft text-sm font-normal truncate max-w-[300px] ml-2 border-l border-line pl-3">
                   {activeProject.description}
                 </span>
               )}
             </>
           ) : (
             <span className="text-ink-soft font-medium text-sm">Select a project</span>
           )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {activeProject && (
          <button className="hidden sm:block px-4 py-1.5 bg-cobalt hover:bg-cobalt-dark text-white rounded-md text-sm font-medium transition-colors">
            New task
          </button>
        )}
        
        <div className="h-6 w-px bg-line hidden sm:block mx-1"></div>
        
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-ink-soft hover:text-ink hover:bg-stone/10 rounded-md transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-ink-soft hover:text-ink hover:bg-stone/10 rounded-md transition-colors">
            <Bell className="w-4 h-4" />
          </button>
        </div>
        
        <button 
          onClick={() => dispatch(logout())}
          className="text-sm font-medium text-ink-soft hover:text-ink transition-colors px-2 hidden md:block"
        >
          Sign out
        </button>
        
        <div className="w-8 h-8 rounded-[8px] bg-stone/30 text-ink flex items-center justify-center font-semibold text-sm shrink-0">
          {currentUser?.avatar || currentUser?.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
