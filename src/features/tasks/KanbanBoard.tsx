import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { Task, TaskStatus } from '../../types';
import { updateTask } from '../../store/slices/tasksSlice';
import { openTaskModal } from '../../store/slices/uiSlice';
import { addToast } from '../../store/slices/toastSlice';
import { logActivity } from '../../store/slices/activitiesSlice';
import { v4 as uuidv4 } from 'uuid';

const COLUMNS = [
  { id: 'todo' as TaskStatus, title: 'To Do', color: 'bg-stone' },
  { id: 'in-progress' as TaskStatus, title: 'In Progress', color: 'bg-cobalt' },
  { id: 'done' as TaskStatus, title: 'Done', color: 'bg-moss' }
];

export function KanbanBoard({ projectTasks }: { projectTasks: Task[] }) {
  const dispatch = useAppDispatch();
  const { items: allTasks } = useAppSelector(state => state.tasks);
  const { currentUser } = useAppSelector(state => state.auth);

  const handleCreateTask = useCallback((status: TaskStatus) => {
    dispatch(openTaskModal({ taskId: null, defaultStatus: status }));
  }, [dispatch]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination, source } = result;
    
    if (destination.droppableId !== source.droppableId) {
      const newStatus = destination.droppableId as TaskStatus;
      const oldStatus = source.droppableId as TaskStatus;
      
      // Optimistic Update
      dispatch(updateTask({ id: draggableId, changes: { status: newStatus } }));
      
      // Activity Log
      if (currentUser) {
        dispatch(logActivity({
          id: uuidv4(),
          workspaceId: '',
          taskId: draggableId,
          userId: currentUser.id,
          action: 'status_changed',
          details: `status to ${newStatus}`,
          createdAt: new Date().toISOString()
        }));
      }

      // Add Undo Toast
      dispatch(addToast({
        message: `Task moved to ${newStatus.replace('-', ' ')}`,
        type: 'success',
        undoAction: {
          type: 'tasks/updateTask',
          payload: { id: draggableId, changes: { status: oldStatus } }
        }
      }));
    }
  }, [dispatch, currentUser]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 h-full min-w-max pb-4 px-1">
        {COLUMNS.map(col => (
          <KanbanColumn 
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            tasks={projectTasks}
            allTasks={allTasks}
            onAddTask={handleCreateTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
