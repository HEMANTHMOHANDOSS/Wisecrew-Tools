import React, { useState } from 'react';
import { generateAIContent } from '../services/geminiService';
import { Card, Button, Input, Select, TabNavigation, ToolLayout } from '../components/SharedUI';
import { Bot, Sparkles, Send, Copy, Loader2, FileText, Mail, BookOpen, Briefcase } from 'lucide-react';

const AIToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rewrite');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [customParams, setCustomParams] = useState({
    tone: 'Professional',
    length: 'Medium',
    recipient: 'Hiring Manager'
  });

  const toolConfig: any = {
    rewrite: {
      title: "AI Text Rewriter",
      icon: FileText,
      placeholder: "Paste text to rewrite...",
      prompt: (text: string) => `Rewrite the following text to be more ${customParams.tone}: "${text}"`
    },
    email: {
      title: "Email Generator",
      icon: Mail,
      placeholder: "Describe the email (e.g., Requesting a sick leave)...",
      prompt: (text: string) => `Write a ${customParams.tone} email to ${customParams.recipient}. Context: ${text}`
    },
    explain: {
      title: "Topic Explainer",
      icon: BookOpen,
      placeholder: "What topic should I explain? (e.g., Quantum Physics)...",
      prompt: (text: string) => `Explain "${text}" simply for a general audience. Use analogies.`
    },
    resume: {
      title: "Resume Bullet Points",
      icon: Briefcase,
      placeholder: "Describe your job role and achievements...",
      prompt: (text: string) => `Generate impactful resume bullet points for: ${text}. Use action verbs.`
    }
  };

  const tabs = Object.keys(toolConfig).map(key => ({
     id: key,
     label: toolConfig[key].title,
     icon: toolConfig[key].icon
  }));

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');
    
    const config = toolConfig[activeTab];
    const prompt = config.prompt(input);
    const result = await generateAIContent(prompt, "You are a helpful, professional AI assistant.");
    
    setOutput(result);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const config = toolConfig[activeTab];

  return (
    <div className="space-y-8 animate-fade-in">
       <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={(id) => { setActiveTab(id); setOutput(''); }} />

      <ToolLayout id={`ai-${activeTab}`} name={config.title} description="Powered by Gemini AI" icon={Bot}>
        <div className="space-y-6">
            {/* Options based on mode */}
            <div className="flex gap-4">
              <Select 
                value={customParams.tone} 
                onChange={(e) => setCustomParams({...customParams, tone: e.target.value})}
                label="Tone"
              >
                <option value="Professional">Professional</option>
                <option value="Casual">Casual</option>
                <option value="Friendly">Friendly</option>
                <option value="Formal">Formal</option>
              </Select>
              {activeTab === 'email' && (
                <Input 
                  label="Recipient" 
                  value={customParams.recipient}
                  onChange={(e) => setCustomParams({...customParams, recipient: e.target.value})}
                />
              )}
            </div>

            <textarea 
              className="w-full glass-input p-4 rounded-xl min-h-[150px] resize-y"
              placeholder={config.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            
            <div className="flex justify-end">
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Sparkles className="w-4 h-4" /> <span>Generate Magic</span></>}
              </Button>
            </div>

            {/* Output */}
            {output && (
              <div className="glass-panel p-6 rounded-2xl relative animate-slide-up border border-cyan-500/20">
                 <div className="absolute top-4 right-4">
                   <button onClick={copyToClipboard} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                     <Copy className="w-4 h-4" />
                   </button>
                 </div>
                 <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2"><Bot className="w-4 h-4" /> AI Result:</h3>
                 <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-200 leading-relaxed">
                   {output}
                 </div>
              </div>
            )}
        </div>
      </ToolLayout>
    </div>
  );
};

export default AIToolsPage;