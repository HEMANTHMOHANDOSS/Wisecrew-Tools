import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, Home, Calculator, GraduationCap, Briefcase, 
  Coffee, RefreshCw, Bot, Github, Twitter, LayoutDashboard, Info, Mail,
  Palette, Globe, Lock, User, Languages, Sun, Moon, LogIn,
  Linkedin, Instagram, Youtube, Heart, ExternalLink, ChevronRight
} from 'lucide-react';
import { useTheme, XPDisplay, useLanguage, useAuth } from './SharedUI';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] : []),
    { name: 'Finance', path: '/finance', icon: Calculator },
    { name: 'Student', path: '/student', icon: GraduationCap },
    { name: 'Productivity', path: '/productivity', icon: Briefcase },
    { name: 'Personal', path: '/personal', icon: User },
    { name: 'Developer', path: '/developer', icon: Lock },
    { name: 'Daily', path: '/daily', icon: Coffee },
    { name: 'AI Tools', path: '/ai', icon: Bot },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase();
    // Enhanced Search Logic
    if(q.includes('emi') || q.includes('loan')) navigate('/finance');
    else if(q.includes('gst') || q.includes('tax')) navigate('/finance');
    else if(q.includes('sip') || q.includes('invest')) navigate('/finance');
    else if(q.includes('todo') || q.includes('task')) navigate('/productivity');
    else if(q.includes('pomodoro') || q.includes('timer')) navigate('/productivity');
    else if(q.includes('age') || q.includes('bmi')) navigate('/daily');
    else if(q.includes('qr') || q.includes('json')) navigate('/developer');
    else if(q.includes('gpa') || q.includes('grade')) navigate('/student');
    else if(q.includes('fuel') || q.includes('bill')) navigate('/personal');
    else if(q.includes('ai') || q.includes('write')) navigate('/ai');
    else navigate('/finance');
    setIsMenuOpen(false);
    setSearchQuery('');
  };

  const toggleTheme = () => {
    const themes: any = ['glass', 'light', 'dark', 'amoled'];
    const currentIdx = themes.indexOf(theme);
    const nextTheme = themes[(currentIdx + 1) % themes.length];
    setTheme(nextTheme);
  };

  const toggleLang = () => {
    const langs: any = ['en', 'hi', 'ta', 'te'];
    const currentIdx = langs.indexOf(language);
    setLanguage(langs[(currentIdx + 1) % langs.length]);
  };

  const footerLinks = {
    categories: [
      { name: 'Finance Tools', path: '/finance' },
      { name: 'Student Tools', path: '/student' },
      { name: 'Productivity', path: '/productivity' },
      { name: 'Personal Utilities', path: '/personal' },
      { name: 'Developer Tools', path: '/developer' },
      { name: 'Daily & Converters', path: '/daily' },
    ],
    support: [
      { name: 'Help Center', path: '/help-center' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Report a Bug', path: '/report-bug' },
      { name: 'Request Feature', path: '/request-feature' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms of Service', path: '/terms-of-service' },
      { name: 'Cookie Policy', path: '/cookie-policy' },
      { name: 'Disclaimer', path: '/disclaimer' },
    ]
  };

  return (
    <div className={`flex flex-col min-h-screen font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200 theme-${theme}`}>
      {/* Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-panel border-b border-white/10 py-2 shadow-lg backdrop-blur-xl bg-opacity-80' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center h-14">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-2 rounded-lg group-hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all duration-300 transform group-hover:rotate-12 flex items-center justify-center">
              <Bot className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:to-cyan-200 transition-colors hidden sm:block pt-1">
              WiseTools Hub
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden xl:flex items-center relative group mx-4">
             <form onSubmit={handleSearch} className="relative flex items-center w-full">
               <div className="absolute left-3.5 flex items-center justify-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
               </div>
               <input 
                 type="text" 
                 placeholder="Search tools (e.g. Loan, BMI)..." 
                 className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 h-10 text-sm w-64 focus:w-80 focus:bg-white/10 focus:border-cyan-500/50 transition-all duration-300 outline-none text-white placeholder-gray-400 shadow-sm"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </form>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
               <XPDisplay />
            ) : null}
            
            <div className="flex items-center gap-1 mx-2">
              {navLinks.slice(0, 5).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 group h-9 ${
                    location.pathname === link.path 
                      ? 'bg-white/10 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${location.pathname === link.path ? 'text-cyan-400' : ''}`} />
                  <span className="relative">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-white/10 mx-1"></div>

            <div className="flex items-center gap-3 pl-2">
              <button 
                onClick={toggleLang} 
                className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors border border-transparent" 
                title={`Language: ${language.toUpperCase()}`}
              >
                <Languages className="w-4 h-4" />
              </button>
              
              <button 
                onClick={toggleTheme} 
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 border shadow-sm
                  ${theme === 'light' 
                    ? 'bg-white border-gray-200 text-gray-900 shadow-md hover:bg-gray-50 hover:scale-110 hover:shadow-lg' 
                    : 'bg-white/5 border-white/10 text-cyan-300 hover:bg-white/10 hover:scale-110 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  }
                `} 
                title={`Theme: ${theme}`}
              >
                {theme === 'light' 
                  ? <Sun className="w-5 h-5 fill-current" /> 
                  : <Moon className="w-5 h-5 fill-current" />
                }
              </button>

              {/* Login / Profile Button */}
              {isAuthenticated ? (
                <Link to="/dashboard" className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px] cursor-pointer hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all">
                   <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{user?.name?.charAt(0) || 'U'}</span>
                   </div>
                </Link>
              ) : (
                <Link 
                  to="/signin" 
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {isAuthenticated && <XPDisplay />}
            <button 
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden glass-panel border-t border-white/10 absolute w-full top-full left-0 p-4 flex flex-col space-y-2 animate-slide-up shadow-2xl max-h-[80vh] overflow-y-auto">
             <form onSubmit={handleSearch} className="mb-4">
               <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Search tools..." 
                   className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-cyan-500 outline-none"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               </div>
             </form>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`p-3 rounded-xl flex items-center space-x-3 transition-colors ${
                   location.pathname === link.path 
                    ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/30' 
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}

            <div className="border-t border-white/10 my-2"></div>
            
            {!isAuthenticated && (
               <Link 
                  to="/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 rounded-xl flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold"
               >
                 <LogIn className="w-4 h-4" />
                 <span>Sign In / Create Account</span>
               </Link>
            )}

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={toggleTheme} className="p-3 bg-white/5 rounded-xl text-gray-300 flex items-center justify-center gap-2">
                 {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} Theme
              </button>
              <button onClick={toggleLang} className="p-3 bg-white/5 rounded-xl text-gray-300 flex items-center justify-center gap-2">
                 <Languages className="w-4 h-4" /> {language.toUpperCase()}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-12 px-4 container mx-auto relative z-10">
        {children}
      </main>

      {/* Redesigned Footer */}
      <footer className={`mt-auto relative pt-16 pb-8 border-t transition-all duration-300 ${
        theme === 'light' 
          ? 'bg-gradient-to-t from-[#E6EEFA] to-[#F7FAFF] border-blue-100/50 text-slate-600' 
          : 'glass-panel border-white/10 text-gray-400'
      }`}>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Col 1: Brand */}
            <div className="space-y-6">
              <Link 
                to="/" 
                onClick={scrollToTop}
                className="flex items-center space-x-3 group w-fit"
              >
                <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-2 rounded-lg shadow-lg shadow-cyan-500/20">
                  <Bot className="text-white w-6 h-6" />
                </div>
                <span className={`text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme==='light' ? 'from-slate-800 to-slate-600' : 'from-white to-gray-300'}`}>
                  WiseTools Hub
                </span>
              </Link>
              <p className={`leading-relaxed text-sm ${theme==='light' ? 'text-slate-500' : 'text-gray-400'}`}>
                The ultimate utility platform for students, professionals, and developers. Secure, fast, and free.
              </p>
              <Link 
                to="/finance" 
                onClick={scrollToTop}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  theme === 'light' 
                    ? 'bg-white border border-slate-200 text-slate-700 hover:border-cyan-400 hover:text-cyan-600 shadow-sm' 
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-cyan-500/50'
                }`}
              >
                Explore Tools <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Col 2: Categories */}
            <div>
              <h4 className={`font-bold mb-6 ${theme==='light'?'text-slate-800':'text-white'}`}>Categories</h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.categories.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      onClick={scrollToTop}
                      className={`hover:translate-x-1 transition-transform inline-block ${theme==='light'?'hover:text-cyan-600':'hover:text-cyan-400'}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Support & Legal */}
            <div className="grid grid-cols-1 gap-8">
               <div>
                  <h4 className={`font-bold mb-4 ${theme==='light'?'text-slate-800':'text-white'}`}>Support</h4>
                  <ul className="space-y-2 text-sm">
                    {footerLinks.support.map((link) => (
                      <li key={link.name}>
                        <Link 
                          to={link.path} 
                          onClick={scrollToTop}
                          className={`hover:underline ${theme==='light'?'hover:text-cyan-600':'hover:text-cyan-400'}`}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
               </div>
               <div>
                  <h4 className={`font-bold mb-4 ${theme==='light'?'text-slate-800':'text-white'}`}>Legal</h4>
                  <ul className="space-y-2 text-sm">
                    {footerLinks.legal.map((link) => (
                      <li key={link.name}>
                        <Link 
                          to={link.path} 
                          onClick={scrollToTop}
                          className={`hover:underline ${theme==='light'?'hover:text-cyan-600':'hover:text-cyan-400'}`}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
               </div>
            </div>

            {/* Col 4: Language & Social */}
            <div>
               <h4 className={`font-bold mb-6 ${theme==='light'?'text-slate-800':'text-white'}`}>Settings & Social</h4>
               
               <div className="flex flex-wrap gap-2 mb-8">
                  {['en', 'ta', 'hi'].map((lang) => (
                    <button 
                      key={lang}
                      onClick={() => setLanguage(lang as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase transition-all border ${
                        language === lang 
                          ? 'bg-cyan-500 text-white border-cyan-500' 
                          : theme === 'light' 
                            ? 'bg-white text-slate-600 border-slate-200 hover:border-cyan-400' 
                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
               </div>

               <div className="flex gap-3">
                  {[
                    { Icon: Linkedin, href: '#' },
                    { Icon: Instagram, href: '#' },
                    { Icon: Youtube, href: '#' },
                    { Icon: Twitter, href: '#' }
                  ].map(({ Icon, href }, i) => (
                    <a 
                      key={i} 
                      href={href} 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        theme === 'light' 
                          ? 'bg-white border border-slate-200 text-slate-600 hover:text-cyan-600 hover:shadow-md' 
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
               </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs ${
            theme === 'light' ? 'border-blue-200 text-slate-500' : 'border-white/5 text-gray-500'
          }`}>
            <div className="flex items-center gap-1">
              © {new Date().getFullYear()} WiseTools Hub. All rights reserved.
            </div>
            
            <a 
              href="https://wisecrew.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                 theme === 'light' 
                   ? 'bg-white border border-slate-200 hover:shadow-sm text-slate-600' 
                   : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'
              }`}
            >
              Built by <span className="font-bold text-cyan-500">WiseCrew Solutions</span> <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;