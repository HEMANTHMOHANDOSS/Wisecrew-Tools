import React from 'react';
import { Card } from '../components/SharedUI';
import { Target, Lightbulb, Users, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-fade-in pb-12">
      {/* Hero */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-white">
          Empowering Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Digital Life</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          WiseTools Hub isn't just a calculator app. It's a comprehensive suite of smart utilities designed to simplify complex tasks in finance, education, and daily productivity.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-t-4 border-cyan-500">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
            <Target className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            To provide accessible, accurate, and beautiful tools that help people make better financial decisions, boost productivity, and solve daily problems instantly without friction.
          </p>
        </Card>
        <Card className="border-t-4 border-blue-500">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
            <Lightbulb className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
          <p className="text-gray-400 leading-relaxed">
            We envision a world where essential digital utilities are unified in one premium, ad-free, and intelligent platform that adapts to the user's needs.
          </p>
        </Card>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>
        <div className="space-y-12 relative z-10">
          {[
            { year: '2023', title: 'The Inception', desc: 'WiseTools concept was born from a need for better financial calculators.' },
            { year: '2024', title: 'Platform Launch', desc: 'Released the first version with core Finance and Student tools.' },
            { year: '2025', title: 'AI Integration', desc: 'Integrated Gemini AI to power smart writing and explanation tools.' },
          ].map((item, idx) => (
            <div key={idx} className={`flex items-center justify-between ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
               <div className="w-5/12"></div>
               <div className="w-8 h-8 rounded-full bg-cyan-500 border-4 border-[#0f172a] shadow-[0_0_15px_#38bdf8]"></div>
               <div className={`w-5/12 glass-panel p-6 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                 <span className="text-cyan-400 font-bold text-xl mb-2 block">{item.year}</span>
                 <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                 <p className="text-gray-400 text-sm">{item.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <span className="text-gray-300">Built with passion by <span className="text-white font-bold">WiseCrew Solutions</span></span>
        </div>
      </div>
    </div>
  );
};

export default About;
