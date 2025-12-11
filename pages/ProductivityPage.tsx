import React, { useState, useEffect } from 'react';
import { Button, Input, ToolLayout, TabNavigation, ResultCard, Select, safeJSONParse } from '../components/SharedUI';
import { Check, Trash2, Clock, Play, Pause, RotateCcw, Download, ListTodo, Activity, StickyNote, Target, CalendarClock } from 'lucide-react';
import { Todo, Habit, Goal, TimeBlock } from '../types';
import jsPDF from 'jspdf';

const ProductivityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('todo');
  
  const tabs = [
    { id: 'todo', label: 'Task Master', icon: ListTodo },
    { id: 'timeblock', label: 'Time Blocking', icon: CalendarClock },
    { id: 'pomodoro', label: 'Pomodoro', icon: Clock },
    { id: 'goals', label: 'Goal Planner', icon: Target },
    { id: 'habit', label: 'Habit Tracker', icon: Activity },
    { id: 'notes', label: 'Daily Notes', icon: StickyNote },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
       <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
       {activeTab === 'todo' && <TodoApp />}
       {activeTab === 'timeblock' && <TimeBlocking />}
       {activeTab === 'pomodoro' && <PomodoroTimer />}
       {activeTab === 'goals' && <GoalPlanner />}
       {activeTab === 'habit' && <HabitTracker />}
       {activeTab === 'notes' && <DailyNotes />}
    </div>
  );
};

const TimeBlocking = () => {
  const [blocks, setBlocks] = useState<TimeBlock[]>(() => {
    return safeJSONParse('timeblocks', []);
  });
  const [time, setTime] = useState('09:00');
  const [task, setTask] = useState('');
  const [type, setType] = useState<'work'|'break'|'personal'>('work');

  useEffect(() => localStorage.setItem('timeblocks', JSON.stringify(blocks)), [blocks]);

  const addBlock = () => {
    if(!task) return;
    setBlocks([...blocks, { id: Date.now().toString(), time, task, type }].sort((a,b) => a.time.localeCompare(b.time)));
    setTask('');
  };

  const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));

  return (
    <ToolLayout id="time-blocking" name="Time Blocking Planner" description="Schedule your day in blocks." icon={CalendarClock}>
       <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
             <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-32" />
             <Input placeholder="Task description..." value={task} onChange={e => setTask(e.target.value)} className="flex-1" />
             <Select value={type} onChange={e => setType(e.target.value as any)} className="w-32">
                <option value="work">Work</option>
                <option value="break">Break</option>
                <option value="personal">Personal</option>
             </Select>
             <Button onClick={addBlock}>Add</Button>
          </div>
          <div className="space-y-3">
             {blocks.map(b => (
               <div key={b.id} className={`glass-panel p-4 rounded-xl flex items-center justify-between border-l-4 ${b.type === 'work' ? 'border-cyan-500' : b.type === 'break' ? 'border-green-500' : 'border-purple-500'}`}>
                  <div className="flex gap-4 items-center">
                     <span className="font-mono text-cyan-300 font-bold">{b.time}</span>
                     <span className="text-white">{b.task}</span>
                  </div>
                  <button onClick={() => removeBlock(b.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
               </div>
             ))}
             {blocks.length === 0 && <p className="text-center text-gray-500">No blocks added.</p>}
          </div>
       </div>
    </ToolLayout>
  )
}

const GoalPlanner = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState('');
  
  const addGoal = () => {
    if(!title) return;
    setGoals([...goals, { id: Date.now().toString(), title, deadline: '2025-12-31', progress: 0 }]);
    setTitle('');
  };

  const updateProgress = (id: string, val: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress: val } : g));
  };

  return (
    <ToolLayout id="goals" name="Goal Planner" description="Set and track long-term goals." icon={Target}>
       <div className="max-w-xl mx-auto space-y-6">
          <div className="flex gap-2">
             <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="New Goal..." />
             <Button onClick={addGoal}>Add</Button>
          </div>
          <div className="space-y-4">
             {goals.map(g => (
               <div key={g.id} className="glass-panel p-4 rounded-xl space-y-2">
                  <div className="flex justify-between font-bold"><span>{g.title}</span><span>{g.progress}%</span></div>
                  <input type="range" min="0" max="100" value={g.progress} onChange={e => updateProgress(g.id, Number(e.target.value))} className="w-full" />
               </div>
             ))}
          </div>
       </div>
    </ToolLayout>
  )
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    return safeJSONParse('todos', []);
  });
  const [input, setInput] = useState('');
  useEffect(() => localStorage.setItem('todos', JSON.stringify(todos)), [todos]);
  const addTodo = (e: React.FormEvent) => { e.preventDefault(); if (!input.trim()) return; setTodos([...todos, { id: Date.now().toString(), text: input, completed: false, priority: 'medium' }]); setInput(''); };
  const toggleTodo = (id: string) => { setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); };
  const deleteTodo = (id: string) => { setTodos(todos.filter(t => t.id !== id)); };
  const reset = () => { if(confirm("Clear all tasks?")) setTodos([]); };
  const exportPDF = () => { const doc = new jsPDF(); doc.text("My To-Do List", 10, 10); todos.forEach((t, i) => { doc.text(`${i + 1}. [${t.completed ? 'x' : ' '}] ${t.text}`, 10, 20 + (i * 10)); }); doc.save("todos.pdf"); };
  return (
    <ToolLayout id="todo" name="Task Master" description="Stay organized with a clean, efficient to-do list." icon={ListTodo} onReset={reset}>
      <div className="max-w-xl mx-auto space-y-6">
        <form onSubmit={addTodo} className="flex gap-2"><Input placeholder="Add a new task..." value={input} onChange={e => setInput(e.target.value)} className="flex-1" /><Button type="submit"><div className="w-5 h-5 flex items-center justify-center font-bold">+</div></Button></form>
        <div className="space-y-3">{todos.length === 0 && <p className="text-center text-gray-500 italic">No tasks yet. Add one above!</p>}{todos.map(todo => (<div key={todo.id} className={`glass-panel p-4 rounded-xl flex items-center justify-between group transition-all ${todo.completed ? 'opacity-50' : ''}`}><div className="flex items-center gap-3"><button onClick={() => toggleTodo(todo.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${todo.completed ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500 hover:border-cyan-400'}`}>{todo.completed && <Check className="w-3 h-3 text-white" />}</button><span className={`${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>{todo.text}</span></div><button onClick={() => deleteTodo(todo.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button></div>))}</div>
        {todos.length > 0 && (<div className="flex justify-end pt-4 border-t border-white/10"><Button variant="secondary" onClick={exportPDF} className="text-xs px-4 py-2 h-auto"><Download className="w-3 h-3 mr-2" /> Save as PDF</Button></div>)}
      </div>
    </ToolLayout>
  );
};

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  useEffect(() => { let interval: any; if (isRunning && timeLeft > 0) { interval = setInterval(() => setTimeLeft((t) => t - 1), 1000); } else if (timeLeft === 0) { setIsRunning(false); } return () => clearInterval(interval); }, [isRunning, timeLeft]);
  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => { setIsRunning(false); setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60); };
  const setModeAndReset = (m: 'work' | 'break') => { setMode(m); setTimeLeft(m === 'work' ? 25 * 60 : 5 * 60); setIsRunning(false); };
  const formatTime = (seconds: number) => { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`; };
  return (
    <ToolLayout id="pomodoro" name="Pomodoro Focus" description="Boost productivity with focused work sessions." icon={Clock} onReset={resetTimer}>
      <div className="flex flex-col items-center justify-center space-y-8 py-8">
        <div className="flex gap-4 p-1 bg-white/5 rounded-full"><button onClick={() => setModeAndReset('work')} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'work' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Focus</button><button onClick={() => setModeAndReset('break')} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'break' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Break</button></div>
        <div className="relative w-64 h-64 flex items-center justify-center"><div className="absolute inset-0 rounded-full border-8 border-white/5"></div><div className="absolute inset-0 rounded-full border-8 border-cyan-400 border-t-transparent transition-all duration-1000" style={{ transform: `rotate(${-(timeLeft / (mode === 'work' ? 1500 : 300)) * 360}deg)` }}></div><div className="text-6xl font-bold font-display text-white tabular-nums tracking-wider">{formatTime(timeLeft)}</div></div>
        <div className="flex gap-4"><Button onClick={toggleTimer} className={`w-16 h-16 rounded-full flex items-center justify-center p-0 ${isRunning ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'}`}>{isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}</Button><Button onClick={resetTimer} variant="secondary" className="w-16 h-16 rounded-full flex items-center justify-center p-0"><RotateCcw className="w-6 h-6" /></Button></div>
      </div>
    </ToolLayout>
  );
};

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(() => { return safeJSONParse('habits', []); });
  const [newHabit, setNewHabit] = useState('');
  useEffect(() => localStorage.setItem('habits', JSON.stringify(habits)), [habits]);
  const addHabit = (e: React.FormEvent) => { e.preventDefault(); if(!newHabit.trim()) return; setHabits([...habits, { id: Date.now().toString(), title: newHabit, streak: 0, completedDates: [] }]); setNewHabit(''); };
  const toggleToday = (id: string) => { const today = new Date().toISOString().split('T')[0]; setHabits(habits.map(h => { if(h.id === id) { const isDone = h.completedDates.includes(today); let newDates = isDone ? h.completedDates.filter(d => d !== today) : [...h.completedDates, today]; let streak = isDone ? Math.max(0, h.streak - 1) : h.streak + 1; return { ...h, completedDates: newDates, streak }; } return h; })); };
  const deleteHabit = (id: string) => setHabits(habits.filter(h => h.id !== id));
  const reset = () => { if(confirm("Delete all habits?")) setHabits([]); };
  const today = new Date().toISOString().split('T')[0];
  return (
    <ToolLayout id="habit-tracker" name="Habit Tracker" description="Build good habits and track streaks." icon={Activity} onReset={reset}>
       <div className="max-w-xl mx-auto space-y-6">
          <form onSubmit={addHabit} className="flex gap-2"><Input placeholder="New Habit (e.g., Read 30 mins)..." value={newHabit} onChange={e => setNewHabit(e.target.value)} className="flex-1" /><Button type="submit">Add</Button></form>
          <div className="grid gap-4">{habits.map(h => { const isDone = h.completedDates.includes(today); return (<div key={h.id} className={`glass-panel p-5 rounded-xl flex items-center justify-between border-l-4 transition-all ${isDone ? 'border-green-400 bg-green-500/5' : 'border-gray-600'}`}><div><h3 className="font-bold text-white text-lg">{h.title}</h3><p className="text-sm text-gray-400">Current Streak: <span className="text-cyan-400 font-bold">{h.streak} 🔥</span></p></div><div className="flex items-center gap-3"><button onClick={() => toggleToday(h.id)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-white/10 hover:bg-white/20 text-gray-400'}`}><Check className="w-6 h-6" /></button><button onClick={() => deleteHabit(h.id)} className="text-gray-600 hover:text-red-400 p-2"><Trash2 className="w-4 h-4" /></button></div></div>); })}</div>
       </div>
    </ToolLayout>
  )
};

const DailyNotes = () => {
  const [note, setNote] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('dailyNote') || '';
  });
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setNote(e.target.value); };
  useEffect(() => { const timer = setTimeout(() => { localStorage.setItem('dailyNote', note); setLastSaved(new Date().toLocaleTimeString()); }, 1000); return () => clearTimeout(timer); }, [note]);
  const reset = () => { if(confirm("Clear note?")) setNote(''); };
  return (
    <ToolLayout id="notes" name="Daily Scratchpad" description="A simple auto-saving notepad for your thoughts." icon={StickyNote} onReset={reset}>
       <div className="max-w-2xl mx-auto h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-2 px-2"><span className="text-xs text-gray-400 uppercase tracking-widest">Auto-saving...</span>{lastSaved && <span className="text-xs text-green-400">Saved at {lastSaved}</span>}</div>
          <textarea className="flex-1 w-full glass-input rounded-xl p-6 text-lg leading-relaxed resize-none focus:ring-2 ring-cyan-500/30 outline-none" placeholder="Start typing your thoughts here..." value={note} onChange={handleChange}></textarea>
       </div>
    </ToolLayout>
  )
};

export default ProductivityPage;