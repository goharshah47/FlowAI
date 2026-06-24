import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  User, 
  Check, 
  Paperclip, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  Plus, 
  X,
  UserPlus,
  HelpCircle
} from 'lucide-react';
import { Task, TeamMember } from '../types';

interface TaskBoardScreenProps {
  tasks: Task[];
  team: TeamMember[];
  onUpdateTasks: (updatedTasks: Task[]) => void;
  onSelectTask: (task: Task | null) => void;
  selectedTask: Task | null;
}

export default function TaskBoardScreen({
  tasks,
  team,
  onUpdateTasks,
  onSelectTask,
  selectedTask,
}: TaskBoardScreenProps) {
  
  const [newCommentText, setNewCommentText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<'backlog' | 'in_progress' | 'review' | 'completed'>('backlog');

  const statuses: ('backlog' | 'in_progress' | 'review' | 'completed')[] = [
    'backlog',
    'in_progress',
    'review',
    'completed'
  ];

  const getStatusLabel = (status: string) => {
    if (status === 'in_progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Quick drag simulation or status shift
  const moveTaskStatus = (taskId: string, nextStatus: 'backlog' | 'in_progress' | 'review' | 'completed') => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return { 
          ...t, 
          status: nextStatus,
          activityTimeline: [
            { id: `act-${Date.now()}`, user: 'Gohar Shah (You)', action: `moved task to ${getStatusLabel(nextStatus)}`, timestamp: 'Just now' },
            ...t.activityTimeline
          ]
        };
      }
      return t;
    });
    onUpdateTasks(updated);
    
    // If the active open task is the one we moved, sync selection
    if (selectedTask && selectedTask.id === taskId) {
      onSelectTask({ ...selectedTask, status: nextStatus });
    }
  };

  // Add Comment simulation
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTask) return;

    const newComment = {
      id: `c-new-${Date.now()}`,
      author: 'Gohar Shah (You)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // standard high quality profile pic
      text: newCommentText,
      timestamp: 'Just now'
    };

    const updatedTask = {
      ...selectedTask,
      comments: [...selectedTask.comments, newComment],
      activityTimeline: [
        { id: `act-comm-${Date.now()}`, user: 'Gohar Shah (You)', action: 'added a comment', timestamp: 'Just now' },
        ...selectedTask.activityTimeline
      ]
    };

    const updatedAllTasks = tasks.map(t => t.id === selectedTask.id ? updatedTask : t);
    onUpdateTasks(updatedAllTasks);
    onSelectTask(updatedTask);
    setNewCommentText('');
  };

  // Approve AI Suggestion to reassign Sarah
  const handleApproveAssignment = () => {
    if (!selectedTask) return;

    // AI recommendation is usually to assign Sarah Chen
    const updatedTask: Task = {
      ...selectedTask,
      ownerId: 'sarah',
      activityTimeline: [
        { id: `act-assign-${Date.now()}`, user: 'FlowAI', action: 'assigned task to Sarah Chen based on previous similar tasks completed', timestamp: 'Just now' },
        ...selectedTask.activityTimeline
      ]
    };

    const updatedAllTasks = tasks.map(t => t.id === selectedTask.id ? updatedTask : t);
    onUpdateTasks(updatedAllTasks);
    onSelectTask(updatedTask);
  };

  // Create task simulation
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${tasks.length + 1}`,
      title: newTaskTitle,
      ownerId: 'john', // default backend assignee
      dueDate: '2026-07-15',
      priority: 'medium',
      status: newTaskStatus,
      aiImpactScore: 54,
      aiConfidence: 81,
      aiReason: 'New backlog item. Low priority baseline assessment.',
      description: 'Custom task created by administrator. Set appropriate sprint definitions and metadata parameters.',
      comments: [],
      attachments: [],
      activityTimeline: [
        { id: `act-cre-${Date.now()}`, user: 'Gohar Shah (You)', action: 'created task', timestamp: 'Just now' }
      ]
    };

    onUpdateTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] gap-6 overflow-hidden animate-fade-in">
      
      {/* Kanban Board Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Kanban title + action */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-sans text-base font-bold text-slate-900">Sprint 4 Sprintboard</h2>
            <p className="text-[11px] text-slate-500">Monitor and modify tasks. Click to view deep AI assessments.</p>
          </div>
          
          <button 
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-1 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-600 transition shadow-sm active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Quick Task creation popup drawer */}
        {isAddingTask && (
          <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Add New Sprint Item</span>
                <button type="button" onClick={() => setIsAddingTask(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Task title (e.g. Add payment callbacks)"
                className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-sky-500"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
              <div className="flex items-center justify-between">
                <select 
                  className="rounded border border-slate-200 p-1 text-xs text-slate-600 outline-none"
                  value={newTaskStatus}
                  onChange={(e: any) => setNewTaskStatus(e.target.value)}
                >
                  <option value="backlog">Backlog</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsAddingTask(false)} className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-50 rounded">Cancel</button>
                  <button type="submit" className="bg-slate-900 text-white px-3 py-1 text-xs font-semibold rounded hover:bg-slate-800 transition">Save Task</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Kanban Board columns scroll */}
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start">
          {statuses.map((status) => {
            const statusTasks = tasks.filter((t) => t.status === status);
            return (
              <div key={status} className="flex flex-col h-full w-72 shrink-0 rounded-2xl bg-slate-50 border border-slate-200/50 p-3">
                
                {/* Column header */}
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 capitalize">{getStatusLabel(status)}</span>
                    <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-600">
                      {statusTasks.length}
                    </span>
                  </div>
                  
                  {/* Plus button inside list */}
                  <button 
                    onClick={() => { setNewTaskStatus(status); setIsAddingTask(true); }}
                    className="rounded p-1 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Cards container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {statusTasks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white/40 p-6 text-center text-[11px] text-slate-400 font-medium">
                      No items in {status}
                    </div>
                  ) : (
                    statusTasks.map((task) => {
                      const owner = team.find((m) => m.id === task.ownerId);
                      return (
                        <div
                          key={task.id}
                          onClick={() => onSelectTask(task)}
                          className={`group rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm hover:border-sky-400 hover:shadow-md transition-all cursor-pointer ${
                            selectedTask?.id === task.id ? 'ring-2 ring-sky-400 border-sky-400' : ''
                          }`}
                        >
                          {/* Priority, due date */}
                          <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
                            <span className={`font-semibold uppercase tracking-wider ${
                              task.priority === 'high' 
                                ? 'text-red-600' 
                                : task.priority === 'medium' 
                                  ? 'text-amber-600' 
                                  : 'text-slate-500'
                            }`}>
                              {task.priority}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5 text-slate-400" />
                              {task.dueDate}
                            </span>
                          </div>

                          {/* Task title */}
                          <h3 className="mt-1.5 font-sans text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-sky-600 transition-colors">
                            {task.title}
                          </h3>

                          {/* AI Impact score segment */}
                          <div className="mt-3 rounded bg-slate-50 p-1.5 border border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">AI Impact Score:</span>
                            <span className={`font-mono font-bold px-1 rounded ${
                              task.aiImpactScore > 80 
                                ? 'bg-red-50 text-red-600' 
                                : task.aiImpactScore > 60 
                                  ? 'bg-amber-50 text-amber-600' 
                                  : 'bg-sky-50 text-sky-600'
                            }`}>
                              {task.aiImpactScore}%
                            </span>
                          </div>

                          {/* Assignee & Move indicators */}
                          <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2">
                            {owner ? (
                              <div className="flex items-center gap-1.5">
                                <img src={owner.avatarUrl} alt={owner.name} className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200" />
                                <span className="text-[10px] font-medium text-slate-600">{owner.name.split(' ')[0]}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400">Unassigned</span>
                            )}

                            {/* Quick status cycle button */}
                            <select
                              value={task.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => moveTaskStatus(task.id, e.target.value as any)}
                              className="rounded border border-slate-100 p-0.5 text-[9px] font-bold text-slate-500 hover:bg-slate-50 outline-none"
                            >
                              <option value="backlog">Backlog</option>
                              <option value="in_progress">Active</option>
                              <option value="review">Review</option>
                              <option value="completed">Done</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Detail & AI Recommendation Panel (Side drawer) */}
      {selectedTask ? (
        <div className="w-80 shrink-0 border-l border-slate-200 bg-white p-4.5 flex flex-col h-full overflow-y-auto space-y-4 shadow-2xl animate-slide-in">
          
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 font-mono">
              {selectedTask.id.toUpperCase()}
            </span>
            <button 
              onClick={() => onSelectTask(null)}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Task Core Title */}
          <div className="space-y-1.5">
            <h3 className="font-sans text-sm font-bold text-slate-900 leading-snug">{selectedTask.title}</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Status:</span>
              <span className="rounded bg-slate-100 px-2 py-0.2 text-[10px] font-bold text-slate-700 capitalize">
                {getStatusLabel(selectedTask.status)}
              </span>
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Description</p>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              {selectedTask.description}
            </p>
          </div>

          {/* AI Recommendation Section */}
          <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-3 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
              <Sparkles className="h-4 w-4 text-sky-500 animate-pulse" />
              <span>AI Assignee Advisor</span>
            </div>

            {selectedTask.ownerId !== 'sarah' ? (
              <div className="space-y-2.5">
                <p className="text-[11px] leading-relaxed text-sky-700">
                  <strong>Assign Sarah Chen</strong> because she resolved 4 similar redirected OAuth loop problems in previous sprint tracks with a 94% velocity success.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button 
                    onClick={handleApproveAssignment}
                    className="flex-1 rounded bg-sky-500 py-1 text-center text-[10px] font-bold text-white hover:bg-sky-600 transition"
                  >
                    Approve Assignment
                  </button>
                  <button className="rounded bg-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-300 transition">
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <Check className="h-4 w-4" />
                <span>Assignee updated to Sarah Chen. Optimal alignment reached.</span>
              </div>
            )}
          </div>

          {/* Attachments Section */}
          <div className="space-y-1.5 text-xs">
            <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Attachments</p>
            {selectedTask.attachments.length === 0 ? (
              <p className="text-[10px] text-slate-400">No attachments uploaded.</p>
            ) : (
              <div className="space-y-1">
                {selectedTask.attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2 hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-semibold text-[10px] text-slate-700 line-clamp-1">{file.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 shrink-0">{file.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments list & Form */}
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Discussion</p>
            
            <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
              {selectedTask.comments.map((comm) => (
                <div key={comm.id} className="space-y-1 border-b border-slate-100 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img src={comm.avatarUrl} alt={comm.author} className="h-4 w-4 rounded-full object-cover" />
                      <span className="font-bold text-[10px] text-slate-700">{comm.author}</span>
                    </div>
                    <span className="text-[8px] text-slate-400">{comm.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal pl-5">{comm.text}</p>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Write comment..."
                className="flex-1 rounded-lg border border-slate-200 p-1.5 text-[11px] outline-none focus:border-sky-500"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!newCommentText.trim()}
                className="bg-slate-900 text-white rounded-lg p-1.5 hover:bg-slate-800 disabled:opacity-40 transition"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

        </div>
      ) : (
        <div className="hidden w-80 shrink-0 flex-col items-center justify-center border-l border-slate-200 bg-white p-6 text-center text-slate-400 lg:flex">
          <Sparkles className="h-10 w-10 text-slate-200 animate-pulse mb-3" />
          <p className="text-xs font-semibold text-slate-600">No task selected</p>
          <p className="text-[10px] mt-1 leading-relaxed max-w-[200px]">Click any card on the sprint board to analyze AI recommendations and task dependencies.</p>
        </div>
      )}

    </div>
  );
}
