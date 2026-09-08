export type Role = 'owner' | 'admin' | 'member' | 'viewer';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ViewType = 'kanban' | 'list' | 'calendar';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface WorkspaceMember {
  userId: string;
  role: Role;
}

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  members: WorkspaceMember[];
  defaultView: ViewType;
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  members: string[]; // User IDs that have access to this project
  isArchived: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  labels: string[];
  dueDate?: string;
  parentTaskId?: string; // For nested subtasks
  attachments?: string[]; // Array of base64 strings
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  projectId?: string;
  taskId?: string;
  userId: string;
  action: 'created' | 'edited' | 'status_changed' | 'commented' | 'deleted';
  details?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'assigned' | 'mention' | 'due_soon';
  linkTo?: string; // e.g., task ID
  createdAt: string;
}
