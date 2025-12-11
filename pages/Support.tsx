import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/SharedUI';
import { ArrowLeft, MessageCircle, HelpCircle, Bug, Lightbulb, Mail } from 'lucide-react';

interface SupportProps {
  staticType?: string;
}

const Support: React.FC<SupportProps> = ({ staticType }) => {
  const { type: paramType } = useParams<{ type: string }>();
  const navigate = useNavigate();
  
  // Use prop if available, otherwise fall back to url param, default to help
  const type = staticType || paramType || 'help';

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getContent = () => {
    switch (type) {
      case 'help':
        return { title: 'Help Center', icon: HelpCircle, text: 'Find guides and tutorials on how to use our calculators and tools.' };
      case 'faq':
        return { title: 'Frequently Asked Questions', icon: MessageCircle, text: 'Answers to common questions about accounts, privacy, and tool accuracy.' };
      case 'contact':
        return { title: 'Contact Us', icon: Mail, text: 'Reach out to our support team for assistance.' };
      case 'bug':
        return { title: 'Report a Bug', icon: Bug, text: 'Found something broken? Let us know and we’ll fix it.' };
      case 'feature':
        return { title: 'Request a Feature', icon: Lightbulb, text: 'Have an idea for a new tool? We’d love to hear it!' };
      default:
        return { title: 'Support', icon: HelpCircle, text: 'How can we help you today?' };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 animate-fade-in text-center">
       <Button 
        variant="ghost" 
        onClick={handleBack} 
        className="mb-8 hover:bg-transparent text-gray-400 hover:text-cyan-400 absolute top-24 left-4 md:left-auto cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="glass-panel p-12 rounded-2xl border-t-4 border-cyan-500 shadow-2xl">
         <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="w-10 h-10 text-cyan-400" />
         </div>
         <h1 className="text-3xl font-bold text-white light:text-slate-800 mb-4">{content.title}</h1>
         <p className="text-gray-400 light:text-slate-600 mb-8 text-lg">{content.text}</p>
         
         <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400">This feature is coming soon.</p>
            <p className="mt-2 font-semibold text-cyan-400">Contact: support@wisecrewsolutions.com</p>
         </div>
      </div>
    </div>
  );
};

export default Support;