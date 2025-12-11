
import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Input, CurrencySelector, useCurrency, useAuth, useFavorites, useHistory } from '../components/SharedUI';
import { User, Star, Clock, Settings, Shield, Save, RefreshCw, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { currency, setCurrency, supportedCurrencies } = useCurrency();
  const { user, updateUser, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [recents, setRecents] = useState<any[]>([]);

  useEffect(() => {
    const recs = localStorage.getItem('recents');
    if (recs) setRecents(JSON.parse(recs));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const clearRecents = () => {
    localStorage.removeItem('recents');
    setRecents([]);
  };

  if (!user) return null; // Should be handled by router protection, but failsafe

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            My Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage your preferences and saved tools.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleLogout} className="text-sm px-4">
             <LogOut className="w-4 h-4" /> Sign Out
          </Button>
          <Button variant={isEditing ? "primary" : "secondary"} onClick={() => setIsEditing(!isEditing)} className="text-sm px-4">
            {isEditing ? <><Save className="w-4 h-4" /> Done Editing</> : <><Settings className="w-4 h-4" /> Edit Profile</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="text-center h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(56,189,248,0.3)] border-4 border-[#0f172a]">
                <span className="text-4xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              
              {isEditing ? (
                <div className="space-y-3 mb-6 px-4">
                  <Input 
                    value={user.name} 
                    onChange={e => updateUser({ name: e.target.value })} 
                    className="text-center"
                    placeholder="Your Name"
                  />
                  <div className="text-left">
                    <label className="text-xs text-gray-400 ml-1 mb-1 block">Preferred Currency</label>
                    <Select 
                      value={currency} 
                      onChange={e => setCurrency(e.target.value)}
                    >
                      {supportedCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </Select>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                  <div className="flex justify-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-semibold border border-cyan-500/30">
                      {user.role}
                    </span>
                    <span className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-xs font-semibold border border-white/10 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> {currency}
                    </span>
                  </div>
                </>
              )}
              
              <div className="mt-8 space-y-4 text-left">
                <div className="glass-panel p-4 rounded-xl flex justify-between items-center group hover:bg-white/5 transition-colors">
                  <span className="text-gray-400 text-sm flex items-center gap-2 group-hover:text-cyan-400 transition-colors"><Star className="w-4 h-4" /> Favorites</span>
                  <span className="font-bold text-white bg-white/5 px-2 py-1 rounded-lg">{favorites.length}</span>
                </div>
                <div className="glass-panel p-4 rounded-xl flex justify-between items-center group hover:bg-white/5 transition-colors">
                  <span className="text-gray-400 text-sm flex items-center gap-2 group-hover:text-cyan-400 transition-colors"><Clock className="w-4 h-4" /> Recent Tools</span>
                  <span className="font-bold text-white bg-white/5 px-2 py-1 rounded-lg">{recents.length}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Favorites */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <h2 className="text-xl font-bold text-white">Your Favorite Tools</h2>
            </div>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favorites.map(fid => (
                  <div key={fid} className="glass-panel p-4 rounded-xl border-l-4 border-yellow-400 flex justify-between items-center group hover:bg-white/5 transition-all">
                    <span className="font-semibold capitalize text-white group-hover:text-yellow-200 transition-colors">{fid.replace(/-/g, ' ')}</span>
                    <Link to={`/finance`} className="text-xs bg-white/10 hover:bg-yellow-500/20 hover:text-yellow-200 px-3 py-1.5 rounded-lg transition-colors font-medium">
                      Open
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-xl text-center text-gray-500 border border-dashed border-white/10">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>No favorites yet. Star tools to see them here.</p>
              </div>
            )}
          </div>

          {/* Recents */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Recently Used</h2>
              </div>
              {recents.length > 0 && (
                <button onClick={clearRecents} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Clear History
                </button>
              )}
            </div>
            
            {recents.length > 0 ? (
              <div className="space-y-3">
                {recents.map((tool: any, idx) => (
                  <Link to={tool.path || '#'} key={idx} className="glass-panel p-4 rounded-xl flex justify-between items-center hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all">
                         <Clock className="w-4 h-4" />
                       </div>
                       <div>
                         <span className="font-medium text-gray-200 group-hover:text-white transition-colors block">{tool.name}</span>
                         <span className="text-xs text-gray-500">Last used recently</span>
                       </div>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 text-sm font-medium px-3 py-1 bg-cyan-500/10 rounded-lg">Open</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-xl text-center text-gray-500 border border-dashed border-white/10">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>No history yet. Start using tools!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
