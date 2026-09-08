import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCommandPaletteOpen, openTaskModal, setGlobalView, setProfileModalOpen } from '../../store/slices/uiSlice';
import { setActiveProject } from '../../store/slices/projectsSlice';
import { Search, Folder, CheckSquare, Calendar, List, Columns, X, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CommandPalette() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.ui.isCommandPaletteOpen);
  const { items: projects } = useAppSelector(state => state.projects);
  const { items: tasks } = useAppSelector(state => state.tasks);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(setCommandPaletteOpen(true));
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        dispatch(setCommandPaletteOpen(false));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  const actions = [
    { id: 'view-kanban', title: 'Go to Kanban View', icon: <Columns className="w-4 h-4 text-cobalt" />, action: () => dispatch(setGlobalView('kanban')) },
    { id: 'view-list', title: 'Go to List View', icon: <List className="w-4 h-4 text-cobalt" />, action: () => dispatch(setGlobalView('list')) },
    { id: 'view-calendar', title: 'Go to Calendar View', icon: <Calendar className="w-4 h-4 text-cobalt" />, action: () => dispatch(setGlobalView('calendar')) },
    { id: 'profile-settings', title: 'Profile Settings', icon: <User className="w-4 h-4 text-cobalt" />, action: () => dispatch(setProfileModalOpen(true)) },
  ];

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(q));
  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(q));
  const filteredActions = actions.filter(a => a.title.toLowerCase().includes(q));

  const items = [
    ...(q ? filteredTasks.slice(0, 5).map(t => ({
      ...t,
      type: 'task',
      title: t.title,
      icon: undefined,
      action: () => dispatch(openTaskModal({ taskId: t.id }))
    })) : []),
    ...filteredProjects.slice(0, 5).map(p => ({
      ...p,
      type: 'project',
      title: p.name,
      icon: undefined,
      action: () => dispatch(setActiveProject(p.id))
    })),
    ...(q ? [] : filteredActions).map(a => ({
      ...a,
      type: 'action',
      title: a.title,
      icon: a.icon
    }))
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = items[selectedIndex];
      if (item && item.action) {
        item.action();
        dispatch(setCommandPaletteOpen(false));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div 
        className="fixed inset-0 bg-stone/50 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(setCommandPaletteOpen(false))}
      />
      <div 
        className="relative w-full max-w-2xl bg-paper border border-line rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        role="dialog"
      >
        <div className="flex items-center px-4 border-b border-line">
          <Search className="w-5 h-5 text-ink-soft shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, tasks, or commands..."
            className="w-full bg-transparent border-none py-4 px-3 text-ink placeholder:text-stone focus:outline-none focus:ring-0 text-base"
          />
          <button 
            onClick={() => dispatch(setCommandPaletteOpen(false))}
            className="p-1 rounded-md text-ink-soft hover:bg-stone/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {items.length === 0 ? (
            <div className="py-12 text-center text-ink-soft text-sm">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item, index) => {
                const isSelected = index === selectedIndex;
                
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      if (item.action) item.action();
                      dispatch(setCommandPaletteOpen(false));
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                      isSelected ? "bg-cobalt/10 text-cobalt" : "text-ink hover:bg-stone/5"
                    )}
                  >
                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-stone/10 text-ink-soft">
                      {item.type === 'project' && <Folder className="w-4 h-4" />}
                      {item.type === 'task' && <CheckSquare className="w-4 h-4" />}
                      {item.type === 'action' && item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-ink-soft mt-0.5 capitalize">
                        {item.type}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-xs font-medium text-cobalt shrink-0 ml-4">
                        Jump to
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-line bg-paper-2 flex items-center gap-4 text-xs text-ink-soft font-medium">
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-stone/20 text-ink font-sans">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-stone/20 text-ink font-sans">↓</kbd> to navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-stone/20 text-ink font-sans">Enter</kbd> to select</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-stone/20 text-ink font-sans">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
