export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  workload: number; // percentage (e.g. 85 = 85% capacity)
  status: 'active' | 'overloaded' | 'available' | 'offline';
  tasksCount: number;
  recentContribution: string;
}

export interface TaskComment {
  id: string;
  author: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface TaskActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  ownerId: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'backlog' | 'in_progress' | 'review' | 'completed';
  aiImpactScore: number; // 0-100%
  aiReason: string;
  aiConfidence: number; // 0-100%
  description: string;
  comments: TaskComment[];
  attachments: TaskAttachment[];
  activityTimeline: TaskActivity[];
}

export interface Project {
  id: string;
  name: string;
  healthScore: number;
  timelineStatus: string;
  teamActivity: string;
  aiConfidenceScore: number;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface AIInsight {
  id: string;
  type: 'risk' | 'recommendation' | 'workload' | 'deadline';
  title: string;
  description: string;
  confidence: number;
  reason?: string;
  impactLevel: 'high' | 'medium' | 'low';
  status: 'pending' | 'resolved' | 'dismissed';
  suggestedAction?: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  confidence?: number;
  reasoning?: string[];
  suggestedActions?: string[];
  requiresApproval?: boolean;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  connected: boolean;
  category: 'issue_tracker' | 'communication' | 'code_repository' | 'design' | 'knowledge_base';
  syncStatus?: string;
  dataPointsImported?: number;
}
