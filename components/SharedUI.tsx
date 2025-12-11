
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LucideIcon, Share2, RefreshCw, Star, Info, ArrowLeft, Home, ChevronRight, Globe, Check, Palette, Languages, History, Download, Image as ImageIcon, Copy, Mic, Trophy, Medal } from 'lucide-react';
import { AppTheme, AppLanguage, HistoryItem, UserProfile } from '../types';
import jsPDF from 'jspdf';

// --- Auth Context ---
interface AuthContextType {
  user: UserProfile | null;
  login: (name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user_profile_v2');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user_profile_v2', JSON.stringify(user));
    } else {
      localStorage.removeItem('user_profile_v2');
    }
  }, [user]);

  const login = (name: string) => {
    // Simulate login/signup
    const newUser: UserProfile = {
      name: name || 'User',
      email: '',
      role: 'Free Plan',
      theme: 'glass',
      language: 'en',
      history: [],
      xp: 0,
      level: 1,
      badges: []
    };
    // Check if there was old XP data to migrate
    const oldXp = localStorage.getItem('user_xp');
    if (oldXp) newUser.xp = Number(oldXp);
    
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Context Hooks ---
export const useTheme = () => {
  const [theme, setTheme] = useState<AppTheme>(() => (localStorage.getItem('app_theme') as AppTheme) || 'glass');
  
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    document.documentElement.className = theme;
    if (theme === 'light') {
      document.body.style.background = 'linear-gradient(to bottom, #F7F9FC, #ECEFF3)';
    } else if (theme === 'dark') {
      document.body.style.background = '#0f172a';
    } else if (theme === 'amoled') {
      document.body.style.background = '#000000';
    } else {
      document.body.style.background = 'linear-gradient(135deg, #0f172a 0%, #172554 40%, #1e3a8a 80%, #0f172a 100%)';
    }
  }, [theme]);

  return { theme, setTheme };
};

// --- Language Hook ---
export const useLanguage = () => {
  const [language, setLanguage] = useState<AppLanguage>(() => (localStorage.getItem('app_lang') as AppLanguage) || 'en');
  
  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  const t = (key: string) => {
    // Simple mock dictionary for demo purposes
    const dict: any = {
      'en': { 'Dashboard': 'Dashboard', 'Tools': 'Tools' },
      'hi': { 'Dashboard': 'डैशबोर्ड', 'Tools': 'उपकरण' },
      'ta': { 'Dashboard': 'டாஷ்போர்டு', 'Tools': 'கருவிகள்' },
      'te': { 'Dashboard': 'డాష్‌బోర్డ్', 'Tools': 'సాధనాలు' },
    };
    return dict[language]?.[key] || key;
  };

  return { language, setLanguage, t };
};

// --- Gamification Hook ---
export const useGamification = () => {
  const { user, updateUser, isAuthenticated } = useAuth();

  const xp = user?.xp || 0;
  const level = Math.floor(Math.sqrt(xp) / 10) + 1;

  const awardXP = (amount: number) => {
    if (!isAuthenticated || !user) return; // Only award XP if logged in

    const newXp = xp + amount;
    const newLevel = Math.floor(Math.sqrt(newXp) / 10) + 1;
    
    updateUser({ xp: newXp, level: newLevel });
  };

  return { xp, level, awardXP };
};

// --- Helper for Favorites ---
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id) 
      ? favorites.filter(f => f !== id) 
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
};

// --- Helper for History ---
export const useHistory = () => {
  const { isAuthenticated } = useAuth();
  
  const addToHistory = (toolId: string, toolName: string, result: string) => {
    if (!isAuthenticated) return; // Don't save history for guests
    
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      toolId,
      toolName,
      result: String(result),
      timestamp: Date.now()
    };
    // In a real app, this would sync to the user profile in AuthContext or backend
    const currentHistory = JSON.parse(localStorage.getItem('tool_history') || '[]');
    const newHistory = [newItem, ...currentHistory].slice(0, 50); // Keep last 50
    localStorage.setItem('tool_history', JSON.stringify(newHistory));
  };
  return { addToHistory };
};

// --- Helper for Recents ---
export const useRecents = (toolId?: string, toolName?: string, path?: string) => {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated && toolId && toolName && path) {
      const saved = localStorage.getItem('recents');
      let recents = saved ? JSON.parse(saved) : [];
      recents = recents.filter((r: any) => r.id !== toolId);
      recents.unshift({ id: toolId, name: toolName, path });
      recents = recents.slice(0, 8);
      localStorage.setItem('recents', JSON.stringify(recents));
    }
  }, [toolId, toolName, path, isAuthenticated]);
};

// --- Helper for Currency ---
export const useCurrency = () => {
  const supportedCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'AED', 'JPY', 'SGD'];
  
  // Force INR default initially unless saved
  const [currency, setCurrencyState] = useState<string>(() => {
    const saved = localStorage.getItem('wise_currency');
    return saved || 'INR'; 
  });

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    localStorage.setItem('wise_currency', c);
    window.dispatchEvent(new Event('currencyChange'));
  };

  useEffect(() => {
    const handleStorage = () => {
       const saved = localStorage.getItem('wise_currency');
       if(saved && saved !== currency) setCurrencyState(saved);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('currencyChange', handleStorage);
    return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('currencyChange', handleStorage);
    };
  }, [currency]);

  const formatAmount = (amount: number) => {
    let locale = 'en-US';
    if(currency === 'INR') locale = 'en-IN';
    else if(currency === 'EUR') locale = 'de-DE';
    else if(currency === 'GBP') locale = 'en-GB';
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return `${currency} ${amount}`;
    }
  };

  return { currency, setCurrency, formatAmount, supportedCurrencies };
};

// --- Components ---

export const CurrencySelector: React.FC<{ 
  current: string; 
  onChange: (c: string) => void; 
  options: string[] 
}> = ({ current, onChange, options }) => (
  <div className="relative z-20 min-w-[130px] h-[42px] group">
    {/* Invisible Native Select for Functionality (Handles click and dropdown) */}
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-pointer"
      aria-label="Select Currency"
    >
      {options.map(c => (
        <option key={c} value={c} className="bg-[#F9FAFB] text-gray-900 dark:bg-[#0f172a] dark:text-white">
          {c}
        </option>
      ))}
    </select>

    {/* Visible Custom Component (Handles Styling) */}
    <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-between px-3.5 rounded-full border transition-all
      bg-white border-[rgba(0,0,0,0.08)] text-[#1F2937] shadow-sm
      dark:bg-white/10 dark:border-white/10 dark:text-white dark:shadow-none
      group-focus-within:ring-4 group-focus-within:ring-blue-500/10 dark:group-focus-within:ring-cyan-500/30
    ">
      {/* Globe Icon */}
      <Globe className="h-4 w-4 text-gray-500 dark:text-cyan-400 shrink-0" />
      
      {/* Currency Code */}
      <span className="font-bold text-sm mx-auto pt-[1px]">{current}</span>
      
      {/* Single Chevron */}
      <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-400 rotate-90 shrink-0" />
    </div>
  </div>
);

export const TabNavigation: React.FC<{
  tabs: { id: string; label: string; icon?: LucideIcon }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  rightAction?: React.ReactNode;
}> = ({ tabs, activeTab, onTabChange, rightAction }) => (
  <div className="flex flex-col gap-6 mb-8">
     {/* Right Action Container - Now uses flex-wrap to prevent overlap on mobile */}
     {rightAction && (
       <div className="flex justify-end w-full">
         {rightAction}
       </div>
     )}
     <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tab-btn flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl transition-all font-medium text-sm border flex-grow md:flex-grow-0 ${
              activeTab === tab.id 
                ? 'active-tab bg-cyan-600/90 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {tab.icon && <tab.icon className="w-4 h-4 shrink-0" />}
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
     </div>
  </div>
);

export const Card: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  title?: string; 
  icon?: LucideIcon;
  rightAction?: React.ReactNode;
}> = ({ 
  children, className = '', title, icon: Icon, rightAction 
}) => (
  <div className={`glass-card p-6 rounded-2xl relative overflow-hidden group ${className}`}>
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    {title && (
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          {Icon && <div className="p-2 rounded-lg bg-cyan-500/10"><Icon className="w-5 h-5 text-cyan-400" /></div>}
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    )}
    <div className="animate-fade-in">{children}</div>
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }> = ({ 
  children, variant = 'primary', className = '', ...props 
}) => {
  const baseStyles = "relative overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:-translate-y-1 shadow-lg shadow-cyan-900/20",
    secondary: "bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md",
    danger: "bg-red-500/20 text-red-200 hover:bg-red-500/40 border border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button type="button" className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, subLabel?: string, withVoice?: boolean, onVoiceInput?: (txt: string) => void }> = ({ label, subLabel, withVoice, onVoiceInput, className = '', ...props }) => {
  const handleVoice = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if(onVoiceInput) onVoiceInput(transcript);
      };
      recognition.start();
    } else {
      alert("Voice input not supported in this browser.");
    }
  };

  return (
    <div className="w-full group">
      {label && <label className="block text-gray-300 text-sm font-medium mb-2 group-focus-within:text-cyan-400 transition-colors">{label} {subLabel && <span className="text-gray-500 text-xs ml-1 font-normal">({subLabel})</span>}</label>}
      <div className="relative">
        <input 
          className={`w-full glass-input px-4 py-3 rounded-xl transition-all ${className} ${withVoice ? 'pr-10' : ''}`}
          {...props}
        />
        {withVoice && (
          <button type="button" onClick={handleVoice} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors">
            <Mic className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className = '', children, ...props }) => (
  <div className="w-full group">
    {label && <label className="block text-gray-300 text-sm font-medium mb-2 group-focus-within:text-cyan-400 transition-colors">{label}</label>}
    <select 
      className={`w-full glass-input px-4 py-3 rounded-xl transition-all appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

export const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs rounded bg-gray-900 px-2 py-1 text-xs text-white tooltip-text opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-50 border border-white/10 whitespace-nowrap">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 tooltip-arrow"></div>
    </div>
  </div>
);

export const XPDisplay: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { xp, level } = useGamification();
  
  if (!isAuthenticated) return null;

  const progress = (Math.sqrt(xp) % 10) * 10;
  
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black shadow-lg">
        {level}
      </div>
      <div className="flex flex-col w-20">
        <div className="flex justify-between text-[10px] text-gray-300">
           <span>LVL {level}</span>
           <span>{xp} XP</span>
        </div>
        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
           <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  )
}

// --- Tool Layout Component ---

interface ToolLayoutProps {
  id: string;
  name: string;
  description: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  onReset?: () => void;
  result?: string | number;
  rightHeader?: React.ReactNode;
  onCalculate?: () => void;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  id, name, description, icon: Icon, children, onReset, result, rightHeader, onCalculate 
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToHistory } = useHistory();
  const { awardXP } = useGamification();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  
  useRecents(id, name, location.pathname);

  useEffect(() => {
    if(result && result !== 0 && result !== '') {
      addToHistory(id, name, String(result));
      if (isAuthenticated) {
        awardXP(10); // Award XP on result generation only if logged in
      }
    }
  }, [result, isAuthenticated]);

  const handleShare = async () => {
    const text = `WiseTools Hub Report\nTool: ${name}\nResult: ${result}\nLink: ${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'WiseTools Hub', text, url: window.location.href });
        if (isAuthenticated) awardXP(5);
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (isAuthenticated) awardXP(5);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("WiseTools Hub Report", 10, 20);
    doc.setFontSize(14);
    doc.text(`Tool: ${name}`, 10, 40);
    doc.text(`Result: ${result}`, 10, 50);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 70);
    doc.save(`${name.replace(/\s/g, '_')}_Report.pdf`);
    if (isAuthenticated) awardXP(15);
  };

  const handleReset = () => {
    if (onReset) {
      if (navigator.vibrate) navigator.vibrate(50);
      onReset();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const categoryRaw = pathSegments[0] || 'Tools';
  
  // Format category name
  const formatCategory = (cat: string) => {
    if(cat === 'ai') return 'AI Tools';
    if(cat === 'daily') return 'Daily & Converters';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };
  
  const categoryLabel = formatCategory(categoryRaw);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Standardized Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400 light:text-slate-500 mb-6 animate-slide-left overflow-x-auto whitespace-nowrap no-scrollbar pb-1">
        <Link 
          to="/" 
          onClick={scrollToTop} 
          className="flex items-center gap-1 hover:text-cyan-400 light:hover:text-cyan-600 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-600 light:text-slate-400 shrink-0" />
        <Link 
          to={`/${categoryRaw}`} 
          onClick={scrollToTop} 
          className="hover:text-cyan-400 light:hover:text-cyan-600 transition-colors"
        >
          {categoryLabel}
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-600 light:text-slate-400 shrink-0" />
        <span className="font-semibold text-white light:text-slate-900 truncate">{name}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              {Icon && <Icon className="w-8 h-8 text-cyan-400 light:text-cyan-600" />}
              <h1 className="text-3xl md:text-4xl font-bold font-display text-white light:text-slate-900">{name}</h1>
           </div>
           <p className="text-gray-400 light:text-slate-600 max-w-2xl text-lg">{description}</p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
           <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Tooltip text={isFavorite(id) ? "Unfavorite" : "Favorite"}>
                <button 
                  type="button" onClick={() => toggleFavorite(id)}
                  className={`tool-action-btn p-2.5 rounded-xl transition-all ${isFavorite(id) ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  <Star className={`w-5 h-5 ${isFavorite(id) ? 'fill-yellow-400' : ''}`} />
                </button>
              </Tooltip>
            ) : null}
            
            <Tooltip text="Save as PDF">
              <button type="button" onClick={handleDownloadPDF} className="tool-action-btn p-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-cyan-400 transition-all">
                <Download className="w-5 h-5" />
              </button>
            </Tooltip>

            <Tooltip text={copied ? "Copied!" : "Share/Copy"}>
              <button type="button" onClick={handleShare} className={`tool-action-btn p-2.5 rounded-xl transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-cyan-400'}`}>
                {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              </button>
            </Tooltip>

            {onReset && (
              <Tooltip text="Reset">
                <button type="button" onClick={handleReset} className="tool-action-btn p-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-red-400 transition-all active:scale-95">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </Tooltip>
            )}
           </div>
           {rightHeader && <div className="mt-2">{rightHeader}</div>}
        </div>
      </div>

      <div className="glass-panel p-1 rounded-2xl border border-white/10 light:border-slate-200 shadow-2xl">
        <div className="tool-inner-panel p-6 md:p-8 rounded-xl backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ResultCard: React.FC<{ 
  label: string; 
  value: string | number; 
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}> = ({ label, value, subtext, trend, color = 'cyan' }) => (
  <div className={`glass-panel p-6 rounded-xl border-l-4 border-${color}-500/50 hover:bg-white/5 transition-colors`}>
    <p className="text-gray-400 light:text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-2xl font-bold text-white light:text-slate-900`}>{value}</p>
    {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
  </div>
);
