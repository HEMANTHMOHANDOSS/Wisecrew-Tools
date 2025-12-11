import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, GraduationCap, Briefcase, Coffee, RefreshCw, Bot, 
  ArrowRight, Search, Zap, Clock, Star, Sparkles
} from 'lucide-react';
import { Card, Tooltip, safeJSONParse } from '../components/SharedUI';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [recents, setRecents] = useState<any[]>([]);

  useEffect(() => {
    const r = safeJSONParse('recents', []);
    setRecents(r.slice(0, 4)); // Show top 4
  }, []);

  const categories = [
    { id: 'finance', name: 'Finance Tools', icon: Calculator, path: '/finance', desc: 'EMI, Expense, Interest, SIP, Salary' },
    { id: 'student', name: 'Student Tools', icon: GraduationCap, path: '/student', desc: 'CGPA, Attendance, Grades, Exam Timer' },
    { id: 'productivity', name: 'Productivity', icon: Briefcase, path: '/productivity', desc: 'Todo, Pomodoro, Habits, Notes' },
    { id: 'daily', name: 'Daily Life', icon: Coffee, path: '/daily', desc: 'Age, BMI, Split Bill, Life Progress' },
    { id: 'converters', name: 'Converters', icon: RefreshCw, path: '/converters', desc: 'Length, Weight, Speed, Currency' },
    { id: 'ai', name: 'AI Assistant', icon: Bot, path: '/ai', desc: 'Writer, Email Gen, Topic Explainer' },
  ];

  const popularTools = [
    { name: 'EMI Calculator', path: '/finance', cat: 'Finance' },
    { name: 'CGPA Calculator', path: '/student', cat: 'Student' },
    { name: 'AI Writer', path: '/ai', cat: 'AI' },
    { name: 'Expense Tracker', path: '/finance', cat: 'Finance' },
    { name: 'Age Calculator', path: '/daily', cat: 'Daily' },
    { name: 'Pomodoro Timer', path: '/productivity', cat: 'Productivity' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase();
    if (q.includes('student') || q.includes('cgpa') || q.includes('exam')) navigate('/student');
    else if (q.includes('finance') || q.includes('emi') || q.includes('loan') || q.includes('expense')) navigate('/finance');
    else if (q.includes('product') || q.includes('todo') || q.includes('habit')) navigate('/productivity');
    else if (q.includes('daily') || q.includes('age') || q.includes('bmi')) navigate('/daily');
    else if (q.includes('ai') || q.includes('write') || q.includes('bot')) navigate('/ai');
    else if (q.includes('convert') || q.includes('unit') || q.includes('currency')) navigate('/converters');
    else if (q) navigate('/finance'); // Default fallback
  };

  const filteredCategories = activeFilter === 'All' 
    ? categories 
    : categories.filter(c => c.name.includes(activeFilter) || c.desc.includes(activeFilter));

  return (
    <div className="space-y-24 animate-fade-in pb-12">
      {/* Hero Section */}
      <section className="text-center py-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse-glow"></div>
        
        <div className="animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> The Ultimate Tool Collection
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight text-white tracking-tight">
            WiseTools <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-shimmer bg-[length:200%_100%]">Hub</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Empower your daily life with our suite of smart calculators, converters, and AI-driven assistants.
          </p>

          <div className="max-w-xl mx-auto mb-12 relative group z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
            <form onSubmit={handleSearch} className="relative transform transition-transform duration-300 hover:scale-[1.02]">
              <input 
                type="text" 
                placeholder="What tool do you need today?" 
                className="w-full bg-[#0f172a]/90 backdrop-blur-xl border border-white/20 pl-14 pr-6 py-5 rounded-full text-lg shadow-2xl text-white placeholder-gray-500 focus:border-cyan-500/50 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-cyan-400 transition-colors" />
            </form>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/finance" className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white shadow-lg hover:shadow-cyan-500/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2">
              Explore Tools <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/dashboard" className="px-8 py-4 glass-panel rounded-xl font-bold text-white hover:bg-white/10 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2">
              My Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Recents Section */}
      {recents.length > 0 && (
        <section className="animate-fade-in max-w-6xl mx-auto" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-2 mb-6 px-2">
            <Clock className="text-cyan-400 w-5 h-5" />
            <h2 className="text-2xl font-bold text-white">Pick up where you left off</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recents.map((tool, i) => (
               <Link 
                 to={tool.path || '#'} 
                 key={i} 
                 className="glass-panel p-4 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-all group border-l-4 border-transparent hover:border-cyan-500 hover:translate-x-1"
               >
                 <div className="bg-white/5 p-2 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                   <Clock className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
                 </div>
                 <span className="font-medium text-gray-200 group-hover:text-white transition-colors truncate">{tool.name}</span>
               </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter & Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-white/10 pb-6">
           <div>
             <h2 className="text-3xl font-bold text-white font-display mb-2">Browse Categories</h2>
             <p className="text-gray-400">Find the perfect tool for your needs</p>
           </div>
           
           <div className="flex flex-wrap gap-2">
             {['All', 'Finance', 'Student', 'Productivity', 'Daily'].map(filter => (
               <button 
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                   activeFilter === filter 
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20 scale-105' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                 }`}
               >
                 {filter}
               </button>
             ))}
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <Link to={cat.path} key={cat.id} className="group block h-full">
              <div className="glass-card h-full p-8 rounded-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-white/5 group-hover:border-cyan-500/30 bg-gradient-to-b from-white/[0.03] to-transparent">
                
                {/* Background Icon Watermark */}
                <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 transform group-hover:scale-125 group-hover:rotate-12 pointer-events-none">
                  <cat.icon className="w-48 h-48" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-500">
                      <cat.icon className="w-7 h-7 text-cyan-300 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">{cat.name}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6 flex-grow group-hover:text-gray-300 transition-colors">{cat.desc}</p>
                  
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-auto">
                    <div className="w-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-700 ease-out"></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-12 max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8 px-4">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
             <Zap className="text-yellow-400 fill-yellow-400 w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold text-white">Trending Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {popularTools.map((tool, i) => (
            <Link key={i} to={tool.path} className="glass-panel p-5 rounded-xl flex items-center justify-between group hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 border border-white/5 hover:border-white/20">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-sm font-bold text-gray-300 border border-white/10 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-all">
                   {tool.name.charAt(0)}
                 </div>
                 <div>
                   <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors">{tool.name}</h4>
                   <p className="text-xs text-gray-500 group-hover:text-gray-400">{tool.cat}</p>
                 </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                 <ArrowRight className="w-4 h-4 text-cyan-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;