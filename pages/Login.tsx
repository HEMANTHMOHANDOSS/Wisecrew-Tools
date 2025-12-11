
import React, { useState } from 'react';
import { Button, Input, Card } from '../components/SharedUI';
import { User, Lock, Mail, Check, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../components/SharedUI';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login process
    login(name || 'User');
    navigate('/dashboard');
  };

  const benefits = [
    "Sync your settings across devices",
    "Track your streaks and earn XP",
    "Save your tool results and history",
    "Access personalized dashboard analytics",
    "Pin your favorite tools for quick access"
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Benefits Section */}
        <div className="space-y-8 order-2 md:order-1">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              Unlock the full power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">WiseTools</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Create a free account to get a personalized experience and keep your data safe.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="p-6 glass-panel rounded-2xl border-l-4 border-cyan-500">
            <p className="text-cyan-300 italic">"WiseTools Hub is the best all-in-one utility platform I've used. The student tools saved my semester!"</p>
            <p className="text-sm text-gray-500 mt-2">— Alex T., Student</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="order-1 md:order-2">
          <Card className="border-t-4 border-cyan-500 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-sm text-gray-400 mt-2">
                {isSignup ? 'Join thousands of users today.' : 'Sign in to access your dashboard.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="relative group">
                   <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                   <Input 
                      placeholder="Full Name" 
                      className="pl-10" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignup}
                   />
                </div>
              )}
              
              <div className="relative group">
                 <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                 <Input 
                    type="email" 
                    placeholder="Email Address" 
                    className="pl-10" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                 />
              </div>

              <div className="relative group">
                 <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                 <Input 
                    type="password" 
                    placeholder="Password" 
                    className="pl-10" 
                    required 
                 />
              </div>

              <Button type="submit" className="w-full mt-4 group">
                {isSignup ? 'Create Free Account' : 'Sign In'} 
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                {isSignup ? "Already have an account?" : "Don't have an account?"}
                <button 
                  onClick={() => setIsSignup(!isSignup)} 
                  className="ml-2 text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
