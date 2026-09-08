import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addWorkspace, updateWorkspace } from '../../store/slices/workspacesSlice';
import { Modal } from '../../components/ui/modal';
import { v4 as uuidv4 } from 'uuid';
import { Workspace } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workspaceToEdit?: Workspace | null;
}

export function WorkspaceModal({ isOpen, onClose, workspaceToEdit }: Props) {
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (workspaceToEdit) {
      setName(workspaceToEdit.name);
    } else {
      setName('');
    }
  }, [workspaceToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (workspaceToEdit) {
       dispatch(updateWorkspace({ id: workspaceToEdit.id, changes: { name: name.trim() } }));
    } else {
       dispatch(addWorkspace({
         id: uuidv4(), 
         name: name.trim(), 
         members: [], 
         defaultView: 'kanban', 
         createdAt: new Date().toISOString()
       }));
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={workspaceToEdit ? "Workspace settings" : "Create workspace"}>
       <form onSubmit={handleSubmit} className="space-y-5">
         <div className="space-y-1.5">
           <label className="text-sm font-medium text-ink">Workspace name</label>
           <input 
             autoFocus 
             required 
             value={name} 
             onChange={e => setName(e.target.value)} 
             className="w-full bg-paper border border-line rounded-md py-2 px-3 text-sm focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all" 
             placeholder="e.g. Design Team" 
           />
         </div>
         <div className="flex justify-end gap-2 pt-2">
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
             {workspaceToEdit ? 'Save changes' : 'Create workspace'}
           </button>
         </div>
       </form>
    </Modal>
  );
}
