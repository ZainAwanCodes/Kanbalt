import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addProject, updateProject, setActiveProject } from '../../store/slices/projectsSlice';
import { Modal } from '../../components/ui/modal';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

const COLORS = [
  'bg-cobalt', 
  'bg-moss', 
  'bg-amber', 
  'bg-stone', 
  'bg-indigo-500', 
  'bg-rose-500',
  'bg-teal-500'
];

export function ProjectModal({ isOpen, onClose, projectToEdit }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  
  const dispatch = useAppDispatch();
  const { activeWorkspaceId } = useAppSelector(state => state.workspaces);
  
  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description || '');
      setColor(projectToEdit.color || COLORS[0]);
    } else {
      setName('');
      setDescription('');
      setColor(COLORS[0]);
    }
  }, [projectToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspaceId || !name.trim()) return;

    if (projectToEdit) {
       dispatch(updateProject({ 
         id: projectToEdit.id, 
         changes: { name: name.trim(), description: description.trim(), color } 
       }));
    } else {
       const newId = uuidv4();
       dispatch(addProject({
         id: newId, 
         workspaceId: activeWorkspaceId, 
         name: name.trim(), 
         description: description.trim(), 
         color, 
         members: [], 
         isArchived: false, 
         createdAt: new Date().toISOString()
       }));
       dispatch(setActiveProject(newId));
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={projectToEdit ? "Edit project" : "New project"}>
       <form onSubmit={handleSubmit} className="space-y-5">
         <div className="space-y-1.5">
           <label className="text-sm font-medium text-ink">Project name</label>
           <input 
             autoFocus 
             required 
             value={name} 
             onChange={e => setName(e.target.value)} 
             className="w-full bg-paper border border-line rounded-md py-2 px-3 text-sm focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all" 
             placeholder="e.g. Q3 Roadmap" 
           />
         </div>
         
         <div className="space-y-1.5">
           <label className="text-sm font-medium text-ink flex items-baseline justify-between">
             Description 
             <span className="text-ink-soft text-xs font-normal">Optional</span>
           </label>
           <textarea 
             value={description} 
             onChange={e => setDescription(e.target.value)} 
             className="w-full bg-paper border border-line rounded-md py-2 px-3 text-sm focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all resize-none h-24" 
             placeholder="Briefly describe this project..." 
           />
         </div>

         <div className="space-y-2">
           <label className="text-sm font-medium text-ink">Project color tag</label>
           <div className="flex items-center gap-3">
             {COLORS.map(c => (
               <button 
                 type="button" 
                 key={c} 
                 onClick={() => setColor(c)} 
                 className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${c} ${color === c ? 'ring-2 ring-offset-2 ring-paper-2 scale-110' : 'hover:scale-110'}`} 
               />
             ))}
           </div>
         </div>

         <div className="flex justify-end gap-2 pt-4">
           <button 
             type="button" 
             onClick={onClose} 
             className="px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
           >
             Cancel
           </button>
           <button 
             type="submit" 
             className="px-4 py-2 bg-cobalt hover:bg-cobalt-dark text-white rounded-md text-sm font-medium transition-colors"
           >
             {projectToEdit ? 'Save changes' : 'Create project'}
           </button>
         </div>
       </form>
    </Modal>
  );
}
