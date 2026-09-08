import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, Activity, Cloud, CloudOff } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { openTaskModal, setSearchQuery, setCommandPaletteOpen } from '../../store/slices/uiSlice';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { items: projects, activeProjectId } = useAppSelector(state => state.projects);
  const { currentUser, mockUsers } = useAppSelector(state => state.auth);
  const { items: activities } = useAppSelector(state => state.activities);
  const uiState = useAppSelector(state => state.ui);
  const searchQuery = uiState.filters?.searchQuery || '';
  const dispatch = useAppDispatch();
  
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId);

  // Get global recent activities
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <header className="h-14 border-b border-line bg-paper-2 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-40">
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
        {/* Search Input */}
        <div className="hidden md:flex items-center bg-paper border border-line rounded-md px-2 py-1 focus-within:border-cobalt focus-within:ring-1 focus-within:ring-cobalt transition-all w-64">
          <Search className="w-4 h-4 text-ink-soft mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="bg-transparent border-none focus:outline-none text-sm w-full text-ink placeholder:text-stone"
          />
          <div 
            onClick={() => dispatch(setCommandPaletteOpen(true))}
            className="hidden lg:flex items-center gap-1 cursor-pointer"
            title="Open Command Palette"
          >
            <kbd className="px-1.5 py-0.5 rounded bg-stone/20 text-ink-soft font-sans text-[10px] font-medium border border-line">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-stone/20 text-ink-soft font-sans text-[10px] font-medium border border-line">K</kbd>
          </div>
        </div>

        {activeProject && (
          <button 
            onClick={() => dispatch(openTaskModal({ taskId: null, defaultStatus: 'todo' }))}
            className="hidden sm:block px-4 py-1.5 bg-cobalt hover:bg-cobalt-dark text-white rounded-md text-sm font-medium transition-colors whitespace-nowrap"
          >
            New task
          </button>
        )}
        
        <div className="h-6 w-px bg-line hidden sm:block mx-1"></div>
        
        <div className="flex items-center gap-1 relative">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-stone/10 rounded-full text-[11px] font-medium mr-2">
            {isOnline ? (
              <>
                <Cloud className="w-3 h-3 text-moss" />
                <span className="text-ink-soft uppercase tracking-wider">Synced</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3 h-3 text-amber" />
                <span className="text-amber uppercase tracking-wider">Offline</span>
              </>
            )}
          </div>
          <button 
            onClick={() => dispatch(setCommandPaletteOpen(true))}
            className="md:hidden p-1.5 text-ink-soft hover:text-ink hover:bg-stone/10 rounded-md transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsActivityOpen(!isActivityOpen)}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              isActivityOpen ? "bg-stone/20 text-ink" : "text-ink-soft hover:text-ink hover:bg-stone/10"
            )}
          >
            <Bell className="w-4 h-4" />
          </button>
          
          {/* Activity Dropdown */}
          {isActivityOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsActivityOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-paper border border-line rounded-lg shadow-xl z-50 flex flex-col max-h-[400px] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-line flex items-center gap-2">
                  <Activity className="w-4 h-4 text-ink-soft" />
                  <h3 className="text-sm font-semibold text-ink">Recent Activity</h3>
                </div>
                <div className="overflow-y-auto p-2 space-y-1">
                  {recentActivities.length === 0 ? (
                    <div className="py-8 text-center text-ink-soft text-sm">
                      No recent activity.
                    </div>
                  ) : (
                    recentActivities.map(activity => {
                      const user = mockUsers.find(u => u.id === activity.userId);
                      return (
                        <div key={activity.id} className="p-2 hover:bg-stone/5 rounded-md flex gap-3 text-sm transition-colors">
                          <div className="w-6 h-6 rounded-full bg-stone/20 flex items-center justify-center text-xs font-medium text-ink shrink-0 mt-0.5">
                            {user?.avatar || user?.name.charAt(0) || '?'}
                          </div>
                          <div>
                            <span className="font-semibold text-ink">{user?.name || 'Unknown'}</span>{' '}
                            <span className="text-ink-soft">{activity.details || `performed ${activity.action}`}</span>
                            <div className="text-[10px] text-ink-soft/70 mt-0.5">
                              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        <button 
          onClick={() => dispatch(logout())}
          className="text-sm font-medium text-ink-soft hover:text-ink transition-colors px-2 hidden md:block whitespace-nowrap"
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
