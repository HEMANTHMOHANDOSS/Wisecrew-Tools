
import React, { useState } from 'react';
import { Button, Input, ToolLayout, TabNavigation } from '../components/SharedUI';
import { GraduationCap, Clock, Percent, Calculator, CalendarDays, BookOpen, UserCheck, Plus, Trash2, Calendar, LayoutGrid, ClipboardList, Lightbulb } from 'lucide-react';
import { Assignment } from '../types';
import { generateAIContent } from '../services/geminiService';

const StudentTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState('internal');

  const tabs = [
    { id: 'internal', label: 'Internal Marks', icon: BookOpen },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'flashcard', label: 'Flashcards', icon: LayoutGrid },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'ideas', label: 'Project Ideas', icon: Lightbulb },
    { id: 'exam', label: 'Exam Countdown', icon: CalendarDays },
    { id: 'sgpa', label: 'Subject SGPA', icon: Calculator },
    { id: 'cgpa', label: 'Semester CGPA', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'grade', label: 'Grade Target', icon: Percent },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
       <TabNavigation tabs={tabs} activeTab={activeTool} onTabChange={setActiveTool} />
      <div className="min-h-[500px]">
        {activeTool === 'internal' && <InternalMarksCalc />}
        {activeTool === 'timetable' && <TimeTableGen />}
        {activeTool === 'flashcard' && <Flashcards />}
        {activeTool === 'assignments' && <AssignmentTracker />}
        {activeTool === 'ideas' && <ProjectIdeaGen />}
        {activeTool === 'exam' && <ExamCountdown />}
        {activeTool === 'sgpa' && <SubjectSGPACalculator />}
        {activeTool === 'cgpa' && <SemesterCGPACalculator />}
        {activeTool === 'attendance' && <AttendanceCalc />}
        {activeTool === 'grade' && <GradeTargetCalc />}
      </div>
    </div>
  );
};

const ProjectIdeaGen = () => {
  const [domain, setDomain] = useState('');
  const [ideas, setIdeas] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if(!domain) return;
    setLoading(true);
    const res = await generateAIContent(`Give me 5 unique project ideas for ${domain} students.`, "You are a creative mentor.");
    setIdeas(res);
    setLoading(false);
  }

  return (
    <ToolLayout id="project-ideas" name="Project Idea Generator" description="Get unique project ideas with AI." icon={Lightbulb}>
       <div className="space-y-4">
         <div className="flex gap-2">
            <Input placeholder="Enter Domain (e.g. Web Dev, ML, History)" value={domain} onChange={e => setDomain(e.target.value)} />
            <Button onClick={generate} disabled={loading}>{loading ? 'Thinking...' : 'Generate'}</Button>
         </div>
         {ideas && <div className="glass-panel p-6 rounded-xl whitespace-pre-wrap">{ideas}</div>}
       </div>
    </ToolLayout>
  )
}

const AssignmentTracker = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');

  const add = () => {
    if(!title) return;
    setAssignments([...assignments, { id: Date.now().toString(), title, subject, dueDate: '2025-05-20', status: 'pending' }]);
    setTitle('');
  };

  const remove = (id: string) => setAssignments(assignments.filter(a => a.id !== id));

  return (
    <ToolLayout id="assignments" name="Assignment Tracker" description="Track due dates." icon={ClipboardList}>
       <div className="space-y-4">
          <div className="flex gap-2">
             <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-1/3" />
             <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="flex-1" />
             <Button onClick={add}>Add</Button>
          </div>
          <div className="space-y-2">
             {assignments.map(a => (
               <div key={a.id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">{a.title}</h4>
                    <p className="text-sm text-gray-400">{a.subject}</p>
                  </div>
                  <button onClick={() => remove(a.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
               </div>
             ))}
          </div>
       </div>
    </ToolLayout>
  )
}

const TimeTableGen = () => {
  return (
    <ToolLayout id="timetable" name="Timetable Generator" description="Organize your weekly schedule." icon={Calendar}>
       <div className="text-center p-12 border-2 border-dashed border-white/10 rounded-xl">
          <p className="text-gray-400">Interactive Weekly Planner (Drag & Drop)</p>
          <div className="grid grid-cols-5 gap-2 mt-4">
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
               <div key={d} className="glass-panel p-2 text-center">
                 <div className="font-bold border-b border-white/10 mb-2">{d}</div>
                 <div className="text-xs text-gray-500 h-24 flex items-center justify-center">Add Class</div>
               </div>
             ))}
          </div>
       </div>
    </ToolLayout>
  )
};

const Flashcards = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <ToolLayout id="flashcard" name="Flashcard Creator" description="Study efficiently with cards." icon={LayoutGrid}>
       <div className="flex flex-col items-center gap-8">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-md h-64 glass-panel rounded-2xl flex items-center justify-center cursor-pointer perspective-1000 transition-all hover:scale-105"
          >
             <p className="text-2xl font-bold">{isFlipped ? "Answer: Paris" : "Question: Capital of France?"}</p>
          </div>
          <div className="flex gap-4">
             <Button variant="secondary">Prev</Button>
             <Button variant="secondary">Next</Button>
          </div>
       </div>
    </ToolLayout>
  )
};

const InternalMarksCalc = () => {
  const [assignments, setAssignments] = useState(20); const [midTerm, setMidTerm] = useState(40); const [attendance, setAttendance] = useState(5); 
  const total = assignments + midTerm + attendance; const max = 20 + 50 + 5; const percentage = (total / max) * 100;
  const reset = () => { setAssignments(20); setMidTerm(40); setAttendance(5); };
  return (
    <ToolLayout id="internal-marks" name="Internal Marks Calculator" description="Calculate your internal assessment score." icon={BookOpen} result={percentage.toFixed(1) + '%'} onReset={reset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"><div className="space-y-4"><Input label="Assignments Score" subLabel="Max 20" type="number" value={assignments} onChange={e => setAssignments(Number(e.target.value))} /><Input label="Mid-Term Score" subLabel="Max 50" type="number" value={midTerm} onChange={e => setMidTerm(Number(e.target.value))} /><Input label="Attendance Score" subLabel="Max 5" type="number" value={attendance} onChange={e => setAttendance(Number(e.target.value))} /></div><div className="text-center"><div className="relative w-48 h-48 mx-auto flex items-center justify-center"><div className="absolute inset-0 rounded-full border-8 border-white/5"></div><div className="absolute inset-0 rounded-full border-8 border-cyan-500 border-l-transparent transition-all duration-1000" style={{ transform: `rotate(${percentage * 3.6}deg)` }}></div><div><h2 className="text-4xl font-bold text-white">{total}</h2><p className="text-sm text-gray-400">out of {max}</p></div></div><p className="mt-4 text-cyan-300 font-semibold">{percentage.toFixed(1)}% Score</p></div></div>
    </ToolLayout>
  )
};

const ExamCountdown = () => {
  const [examDate, setExamDate] = useState(''); const [timeLeft, setTimeLeft] = useState<{days: number, hours: number} | null>(null);
  React.useEffect(() => { if(!examDate) return; const interval = setInterval(() => { const now = new Date().getTime(); const exam = new Date(examDate).getTime(); const dist = exam - now; if (dist < 0) { setTimeLeft(null); } else { setTimeLeft({ days: Math.floor(dist / (1000 * 60 * 60 * 24)), hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) }); } }, 1000); return () => clearInterval(interval); }, [examDate]);
  const reset = () => setExamDate('');
  return (
    <ToolLayout id="exam-countdown" name="Exam Countdown" description="Track time remaining for your exams." icon={CalendarDays} onReset={reset}>
       <div className="max-w-md mx-auto text-center space-y-8"><Input type="date" label="Select Exam Date" value={examDate} onChange={e => setExamDate(e.target.value)} />{timeLeft ? (<div className="grid grid-cols-2 gap-4"><div className="glass-panel p-6 rounded-xl bg-cyan-900/20 border-cyan-500/30"><span className="text-4xl font-bold text-white">{timeLeft.days}</span><p className="text-cyan-400 text-sm uppercase tracking-wider">Days</p></div><div className="glass-panel p-6 rounded-xl bg-blue-900/20 border-blue-500/30"><span className="text-4xl font-bold text-white">{timeLeft.hours}</span><p className="text-blue-400 text-sm uppercase tracking-wider">Hours</p></div></div>) : (<div className="p-8 text-gray-500 border border-dashed border-white/10 rounded-xl">{examDate ? "Exam Finished! 🎉" : "Set a date to start countdown"}</div>)}</div>
    </ToolLayout>
  )
};

const SubjectSGPACalculator = () => {
  const [subjects, setSubjects] = useState([{ credit: 3, grade: 9 }]); const addSubject = () => setSubjects([...subjects, { credit: 3, grade: 9 }]); const removeSubject = (i: number) => setSubjects(subjects.filter((_, idx) => idx !== i)); const updateSubject = (i: number, f: 'credit' | 'grade', v: number) => { const newS = [...subjects]; newS[i] = { ...newS[i], [f]: v }; setSubjects(newS); };
  const totalCredits = subjects.reduce((a, b) => a + b.credit, 0); const totalPoints = subjects.reduce((a, b) => a + (b.credit * b.grade), 0); const sgpa = totalCredits ? totalPoints / totalCredits : 0;
  const reset = () => setSubjects([{ credit: 3, grade: 9 }]);
  return (
    <ToolLayout id="sgpa" name="SGPA Calculator" description="Calculate SGPA based on credits and grades." icon={Calculator} result={sgpa.toFixed(2)} onReset={reset}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-4">{subjects.map((s, i) => (<div key={i} className="flex gap-2 items-end"><div className="flex-1"><Input label={i===0?"Credits":""} type="number" value={s.credit} onChange={e => updateSubject(i, 'credit', Number(e.target.value))} /></div><div className="flex-1"><Input label={i===0?"Grade Point":""} type="number" value={s.grade} onChange={e => updateSubject(i, 'grade', Number(e.target.value))} /></div><button onClick={() => removeSubject(i)} className="p-3 mb-1 text-red-400 hover:bg-white/10 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>))}<Button onClick={addSubject} variant="secondary" className="w-full text-sm"><Plus className="w-4 h-4 mr-2" /> Add Subject</Button></div><div className="glass-panel p-6 rounded-xl flex flex-col justify-center text-center"><p className="text-gray-400">Your SGPA</p><h2 className="text-5xl font-bold text-cyan-400 mt-2">{sgpa.toFixed(2)}</h2></div></div>
    </ToolLayout>
  )
};

const SemesterCGPACalculator = () => {
  const [sems, setSems] = useState([{ sgpa: 8.5 }]); const addSem = () => setSems([...sems, { sgpa: 8.5 }]); const updateSem = (i: number, v: number) => { const n = [...sems]; n[i].sgpa = v; setSems(n); }
  const cgpa = sems.reduce((a, b) => a + b.sgpa, 0) / sems.length; const reset = () => setSems([{ sgpa: 8.5 }]);
  return (
    <ToolLayout id="cgpa" name="CGPA Calculator" description="Calculate Cumulative GPA across semesters." icon={GraduationCap} result={cgpa.toFixed(2)} onReset={reset}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-4">{sems.map((s, i) => (<Input key={i} label={`Semester ${i+1} SGPA`} type="number" value={s.sgpa} onChange={e => updateSem(i, Number(e.target.value))} />))}<Button onClick={addSem} variant="secondary" className="w-full">Add Semester</Button></div><div className="glass-panel p-6 rounded-xl flex flex-col justify-center text-center"><p className="text-gray-400">Cumulative CGPA</p><h2 className="text-5xl font-bold text-green-400 mt-2">{cgpa.toFixed(2)}</h2></div></div>
    </ToolLayout>
  )
};

const AttendanceCalc = () => {
  const [attended, setAttended] = useState(20); const [total, setTotal] = useState(25); const percentage = (attended / total) * 100;
  const bunk = Math.floor((attended - (0.75 * total)) / 0.75); const need = Math.ceil(((0.75 * total) - attended) / 0.25);
  const reset = () => { setAttended(20); setTotal(25); };
  return (
    <ToolLayout id="attendance" name="Attendance Manager" description="Check if you can bunk or need to attend." icon={UserCheck} result={percentage.toFixed(1) + '%'} onReset={reset}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-4"><Input label="Classes Attended" type="number" value={attended} onChange={e => setAttended(Number(e.target.value))} /><Input label="Total Classes" type="number" value={total} onChange={e => setTotal(Number(e.target.value))} /></div><div className="glass-panel p-6 rounded-xl space-y-4"><div className="text-center"><p className="text-gray-400">Current Attendance</p><h2 className={`text-4xl font-bold mt-1 ${percentage >= 75 ? 'text-green-400' : 'text-red-400'}`}>{percentage.toFixed(1)}%</h2></div><div className="p-3 bg-white/5 rounded-lg text-center text-sm">{percentage >= 75 ? `You can bunk ${bunk} classes safely.` : `You need to attend ${need} more classes to hit 75%.`}</div></div></div>
    </ToolLayout>
  )
};

const GradeTargetCalc = () => {
  const [current, setCurrent] = useState(70); const [weight, setWeight] = useState(60); const [target, setTarget] = useState(80);
  const finalWeight = 100 - weight; const needed = (target - (current * weight / 100)) / (finalWeight / 100); const reset = () => { setCurrent(70); setWeight(60); setTarget(80); };
  return (
    <ToolLayout id="grade" name="Grade Target Calculator" description="What score do you need on your final exam?" icon={Percent} result={needed.toFixed(1)} onReset={reset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-4"><Input label="Current Grade (%)" type="number" value={current} onChange={e => setCurrent(Number(e.target.value))} /><Input label="Current Weight (%)" type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} /><Input label="Target Grade (%)" type="number" value={target} onChange={e => setTarget(Number(e.target.value))} /></div><div className="glass-panel p-6 rounded-xl flex flex-col justify-center text-center"><p className="text-gray-400">Score Needed on Final</p><h2 className={`text-4xl font-bold mt-2 ${needed > 100 ? 'text-red-400' : 'text-cyan-400'}`}>{needed.toFixed(1)}%</h2>{needed > 100 && <p className="text-xs text-red-300 mt-2">Impossible unless extra credit!</p>}</div></div>
    </ToolLayout>
  )
};

export default StudentTools;
