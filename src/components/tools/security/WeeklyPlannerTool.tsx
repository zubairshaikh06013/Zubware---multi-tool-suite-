import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Tag, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

interface WeeklyPlannerToolProps {
  onShowToast: (message: string) => void;
}

interface PlannerTask {
  id: string;
  text: string;
  completed: boolean;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'Work' | 'Personal' | 'Health' | 'Study' | 'Finance';
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type DayName = typeof DAYS[number];

const DEFAULT_PLAN: Record<DayName, PlannerTask[]> = {
  Monday: [
    { id: '1', text: 'Team sprint planning & roadmap review', completed: true, priority: 'high', category: 'Work' },
    { id: '2', text: 'Review pull requests and code review backlog', completed: false, priority: 'medium', category: 'Work' }
  ],
  Tuesday: [
    { id: '3', text: 'Infrastructure security audit', completed: false, priority: 'urgent', category: 'Work' },
    { id: '4', text: '45-minute cardio workout & hydration', completed: true, priority: 'medium', category: 'Health' }
  ],
  Wednesday: [
    { id: '5', text: 'Deploy production release v2.4', completed: false, priority: 'high', category: 'Work' },
    { id: '6', text: 'Read 2 chapters on distributed databases', completed: false, priority: 'low', category: 'Study' }
  ],
  Thursday: [
    { id: '7', text: 'Client performance metrics presentation', completed: false, priority: 'high', category: 'Work' }
  ],
  Friday: [
    { id: '8', text: 'Weekly retrospective & documentation updates', completed: false, priority: 'medium', category: 'Work' },
    { id: '9', text: 'Review personal monthly budget & savings', completed: false, priority: 'medium', category: 'Finance' }
  ],
  Saturday: [
    { id: '10', text: 'Outdoor hiking or family gathering', completed: false, priority: 'low', category: 'Personal' }
  ],
  Sunday: [
    { id: '11', text: 'Prep meals and review schedule for next week', completed: false, priority: 'medium', category: 'Personal' }
  ]
};

export const WeeklyPlannerTool: React.FC<WeeklyPlannerToolProps> = ({ onShowToast }) => {
  const [planner, setPlanner] = useState<Record<DayName, PlannerTask[]>>(() => {
    try {
      const saved = localStorage.getItem('zubware-weekly-planner');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PLAN;
  });

  const [inputDay, setInputDay] = useState<DayName>('Monday');
  const [inputTask, setInputTask] = useState<string>('');
  const [inputPriority, setInputPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');
  const [inputCategory, setInputCategory] = useState<'Work' | 'Personal' | 'Health' | 'Study' | 'Finance'>('Work');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('zubware-weekly-planner', JSON.stringify(planner));
    } catch {}
  }, [planner]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTask.trim()) return;

    const newTask: PlannerTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: inputTask.trim(),
      completed: false,
      priority: inputPriority,
      category: inputCategory
    };

    setPlanner((prev) => ({
      ...prev,
      [inputDay]: [...(prev[inputDay] || []), newTask]
    }));

    setInputTask('');
    onShowToast(`Task added to ${inputDay}!`);
  };

  const toggleTask = (day: DayName, taskId: string) => {
    setPlanner(prev => ({
      ...prev,
      [day]: (prev[day] || []).map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const removeTask = (day: DayName, taskId: string) => {
    setPlanner(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(t => t.id !== taskId)
    }));
  };

  const moveTaskToNextDay = (currentDay: DayName, taskId: string) => {
    const currentIndex = DAYS.indexOf(currentDay);
    const nextDay = DAYS[(currentIndex + 1) % DAYS.length];
    const taskToMove = (planner[currentDay] || []).find(t => t.id === taskId);
    if (!taskToMove) return;

    setPlanner(prev => ({
      ...prev,
      [currentDay]: (prev[currentDay] || []).filter(t => t.id !== taskId),
      [nextDay]: [...(prev[nextDay] || []), taskToMove]
    }));

    onShowToast(`Moved task to ${nextDay}!`);
  };

  // Productivity Metrics
  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    DAYS.forEach(d => {
      const list = planner[d] || [];
      total += list.length;
      completed += list.filter(t => t.completed).length;
    });
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pct, remaining: total - completed };
  }, [planner]);

  const copyMarkdown = () => {
    const lines = [
      `# Weekly Agenda & Goals`,
      `Productivity Progress: ${stats.completed}/${stats.total} (${stats.pct}%)`,
      ``
    ];

    DAYS.forEach(day => {
      lines.push(`## ${day}`);
      const tasks = planner[day] || [];
      if (tasks.length === 0) {
        lines.push(`*No tasks scheduled*`);
      } else {
        tasks.forEach(t => {
          lines.push(`- [${t.completed ? 'x' : ' '}] [${t.priority.toUpperCase()}] [${t.category}] ${t.text}`);
        });
      }
      lines.push(``);
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    onShowToast('Copied weekly plan as Markdown checklist!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPlan = () => {
    const data = JSON.stringify(planner, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly_agenda_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded weekly plan backup JSON!');
  };

  const clearCompleted = () => {
    setPlanner(prev => {
      const updated = { ...prev };
      DAYS.forEach(d => {
        updated[d] = (updated[d] || []).filter(t => !t.completed);
      });
      return updated;
    });
    onShowToast('Cleared all completed tasks!');
  };

  const getPriorityBadge = (priority: PlannerTask['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400">URGENT</span>;
      case 'high':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">HIGH</span>;
      case 'medium':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">MED</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-500">LOW</span>;
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🗓️</span> Weekly Goal, Sprint & Task Planner
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize your 7-day schedule with priorities, tags, task rollover, and productivity metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={copyMarkdown}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Markdown</span>
          </button>

          <button
            onClick={downloadPlan}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={clearCompleted}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 text-xs font-semibold transition-all"
          >
            Clear Completed
          </button>
        </div>
      </div>

      {/* Progress & Metric Tracker */}
      <div className="glass-card p-5 rounded-3xl border border-indigo-500/20 bg-indigo-50/20 dark:bg-slate-900/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Weekly Sprint Progress: {stats.completed} of {stats.total} Tasks Completed ({stats.pct}%)
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {stats.remaining} Remaining
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="glass-card p-4 rounded-3xl flex flex-wrap gap-2.5 items-center">
        <select
          value={inputDay}
          onChange={(e) => setInputDay(e.target.value as DayName)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={inputPriority}
          onChange={(e) => setInputPriority(e.target.value as any)}
          className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
        >
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={inputCategory}
          onChange={(e) => setInputCategory(e.target.value as any)}
          className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Health">Health</option>
          <option value="Study">Study</option>
          <option value="Finance">Finance</option>
        </select>

        <input
          type="text"
          value={inputTask}
          onChange={(e) => setInputTask(e.target.value)}
          placeholder="New task, milestone, or goal..."
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </form>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DAYS.map((day) => {
          const tasks = planner[day] || [];
          const dayCompleted = tasks.filter(t => t.completed).length;

          return (
            <div key={day} className="glass-card p-4 rounded-3xl space-y-3 flex flex-col justify-between border border-slate-200 dark:border-slate-800">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    {day}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {dayCompleted}/{tasks.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[140px]">
                  {tasks.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic pt-4 text-center">No tasks scheduled.</p>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-2.5 rounded-2xl border text-xs flex flex-col gap-1.5 transition-all ${
                          task.completed
                            ? 'bg-emerald-500/5 dark:bg-emerald-950/15 border-emerald-500/20 text-slate-400'
                            : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => toggleTask(day, task.id)}
                            className="mt-0.5 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform cursor-pointer"
                          >
                            {task.completed ? (
                              <CheckSquare className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          <span className={`flex-1 font-medium leading-relaxed ${task.completed ? 'line-through text-slate-400' : ''}`}>
                            {task.text}
                          </span>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => moveTaskToNextDay(day, task.id)}
                              className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                              title="Move to Next Day"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeTask(day, task.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] pt-1">
                          <span className="font-semibold text-slate-400">{task.category}</span>
                          {getPriorityBadge(task.priority)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
