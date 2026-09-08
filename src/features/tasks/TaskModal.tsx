import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addTask, updateTask, deleteTask } from '../../store/slices/tasksSlice';
import { closeTaskModal } from '../../store/slices/uiSlice';
import { Modal } from '../../components/ui/modal';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { 
  AlignLeft, Calendar, CheckSquare, ChevronDown, 
  Circle, Clock, Flag, LayoutList, Square, Trash2, X, AlertCircle, User
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function TaskModal() {
  const dispatch = useAppDispatch();
  const rawTaskModal = useAppSelector(state => state.ui.taskModal);
  const { items: tasks } = useAppSelector(state => state.tasks);
  const { items: projects, activeProjectId } = useAppSelector(state => state.projects);
  const { mockUsers, currentUser } = useAppSelector(state => state.auth);

  // Safe destructure with fallback
  const taskModal = rawTaskModal || { isOpen: false, taskId: null, defaultStatus: 'todo' };

  const activeProject = projects.find(p => p.id === activeProjectId);
  const taskToEdit = tasks.find(t => t.id === taskModal.taskId);
  const subtasks = tasks.filter(t => t.parentTaskId === taskModal.taskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  
  // Subtask local state for quick inline adds
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (taskModal.isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setStatus(taskToEdit.status);
        setPriority(taskToEdit.priority);
        setAssigneeId(taskToEdit.assigneeId || '');
        setDueDate(taskToEdit.dueDate || '');
      } else {
        setTitle('');
        setDescription('');
        setStatus(taskModal.defaultStatus);
        setPriority('medium');
        setAssigneeId(currentUser?.id || '');
        setDueDate('');
      }
      setNewSubtaskTitle('');
    }
  }, [taskModal.isOpen, taskToEdit, taskModal.defaultStatus, currentUser]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !activeProjectId) return;

    if (taskToEdit) {
      dispatch(updateTask({
        id: taskToEdit.id,
        changes: {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          assigneeId: assigneeId || undefined,
          dueDate: dueDate || undefined,
          updatedAt: new Date().toISOString()
        }
      }));
    } else {
      dispatch(addTask({
        id: uuidv4(),
        projectId: activeProjectId,
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId: assigneeId || undefined,
        labels: [],
        dueDate: dueDate || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }
    dispatch(closeTaskModal());
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !activeProjectId) return;

    // If creating a new task, we must save the parent task first to get an ID.
    let parentId = taskModal.taskId;
    
    if (!parentId) {
      parentId = uuidv4();
      dispatch(addTask({
        id: parentId,
        projectId: activeProjectId,
        title: title.trim() || 'Untitled Task',
        description: description.trim(),
        status,
        priority,
        assigneeId: assigneeId || undefined,
        labels: [],
        dueDate: dueDate || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      // Update UI state to switch from "create" to "edit" mode behind the scenes
      // Wait, we need to hack around this by just closing and reopening? 
      // Better: we just save the task and close the modal, requesting them to save first.
      alert("Please save the main task first before adding subtasks.");
      return;
    }

    dispatch(addTask({
      id: uuidv4(),
      projectId: activeProjectId,
      parentTaskId: parentId,
      title: newSubtaskTitle.trim(),
      status: 'todo',
      priority: 'medium',
      labels: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (subtask: Task) => {
    const newStatus = subtask.status === 'done' ? 'todo' : 'done';
    dispatch(updateTask({ id: subtask.id, changes: { status: newStatus } }));
  };

  if (!taskModal.isOpen) return null;

  return (
    <Modal 
      isOpen={taskModal.isOpen} 
      onClose={() => dispatch(closeTaskModal())} 
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSave} className="flex flex-col md:flex-row h-full min-h-[500px] max-h-[85vh]">
        {/* Main Content Area (Left) */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto border-r border-line">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-ink-soft font-medium">
              <div className={cn("w-2 h-2 rounded-[3px]", activeProject?.color || 'bg-cobalt')} />
              <span>{activeProject?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {taskToEdit && (
                <button 
                  type="button"
                  onClick={() => {
                    dispatch(deleteTask(taskToEdit.id));
                    dispatch(closeTaskModal());
                  }}
                  className="p-1.5 text-ink-soft hover:text-amber hover:bg-amber/10 rounded-md transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button 
                type="button"
                onClick={() => dispatch(closeTaskModal())}
                className="p-1.5 text-ink-soft hover:text-ink hover:bg-stone/20 rounded-md transition-colors md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full bg-transparent font-heading text-3xl font-bold text-ink focus:outline-none placeholder:text-stone"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-ink font-medium">
                <AlignLeft className="w-4 h-4 text-ink-soft" />
                <h3>Description</h3>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details to this task..."
                className="w-full min-h-[120px] bg-paper border border-line rounded-md p-3 text-sm focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all resize-y"
              />
            </div>

            {/* Subtasks (Only show if editing an existing task, to simplify data flow) */}
            {taskToEdit ? (
              <div className="space-y-3 pt-4 border-t border-line">
                <div className="flex items-center gap-2 text-ink font-medium">
                  <LayoutList className="w-4 h-4 text-ink-soft" />
                  <h3>Subtasks</h3>
                  <span className="bg-stone/20 text-ink-soft text-xs px-2 py-0.5 rounded-full ml-2">
                    {subtasks.filter(s => s.status === 'done').length} / {subtasks.length}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {subtasks.map(st => (
                    <div key={st.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-stone/10 group transition-colors">
                      <button 
                        type="button"
                        onClick={() => toggleSubtask(st)}
                        className={cn(
                          "shrink-0 transition-colors",
                          st.status === 'done' ? "text-moss" : "text-stone hover:text-cobalt"
                        )}
                      >
                        {st.status === 'done' ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                      <span className={cn(
                        "flex-1 text-sm transition-all",
                        st.status === 'done' ? "text-ink-soft line-through" : "text-ink"
                      )}>
                        {st.title}
                      </span>
                      <button 
                        type="button"
                        onClick={() => dispatch(deleteTask(st.id))}
                        className="opacity-0 group-hover:opacity-100 p-1 text-ink-soft hover:text-amber rounded transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask(e);
                      }
                    }}
                    placeholder="Add a subtask..."
                    className="flex-1 bg-transparent border-b border-transparent hover:border-line focus:border-cobalt focus:outline-none py-1 text-sm transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={handleAddSubtask}
                    disabled={!newSubtaskTitle.trim()}
                    className="px-3 py-1 text-xs font-medium bg-stone/20 text-ink hover:bg-stone/30 rounded-md transition-colors disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-line flex items-start gap-2 p-3 bg-amber/5 rounded-md text-amber text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Save this task first to enable subtasks and checklist tracking.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Properties (Right) */}
        <div className="w-full md:w-64 bg-paper-2 p-6 flex flex-col gap-6 shrink-0">
          <div className="hidden md:flex justify-end mb-2">
            <button 
              type="button"
              onClick={() => dispatch(closeTaskModal())}
              className="p-1.5 text-ink-soft hover:text-ink hover:bg-stone/20 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-2">Properties</h4>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-soft flex items-center gap-2">
                <Circle className="w-3.5 h-3.5" /> Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full appearance-none bg-paper border border-line rounded-md py-2 pl-3 pr-8 text-sm text-ink focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all cursor-pointer"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft pointer-events-none" />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-soft flex items-center gap-2">
                <Flag className="w-3.5 h-3.5" /> Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full appearance-none bg-paper border border-line rounded-md py-2 pl-3 pr-8 text-sm text-ink focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft pointer-events-none" />
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-soft flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Assignee
              </label>
              <div className="relative">
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full appearance-none bg-paper border border-line rounded-md py-2 pl-3 pr-8 text-sm text-ink focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {mockUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft pointer-events-none" />
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-soft flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-paper border border-line rounded-md py-2 px-3 text-sm text-ink focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all"
              />
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-line flex gap-2">
            <button 
              type="button" 
              onClick={() => dispatch(closeTaskModal())} 
              className="flex-1 py-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2 bg-cobalt hover:bg-cobalt-dark text-white rounded-md text-sm font-medium transition-colors"
            >
              {taskToEdit ? 'Save task' : 'Create task'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
