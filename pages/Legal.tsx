import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Cookie, AlertCircle } from 'lucide-react';
import { Button } from '../components/SharedUI';

const LegalLayout: React.FC<{ 
  title: string; 
  icon?: React.ElementType;
  lastUpdated?: string; 
  children: React.ReactNode 
}> = ({ title, icon: Icon, lastUpdated, children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={handleBack} 
        className="mb-8 pl-0 hover:bg-transparent text-gray-400 hover:text-cyan-400 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>
      
      <div className="glass-panel p-8 md:p-12 rounded-2xl border-t-4 border-cyan-500 shadow-xl relative overflow-hidden">
        {Icon && (
          <div className="absolute top-8 right-8 text-cyan-500/10 pointer-events-none">
            <Icon className="w-32 h-32" />
          </div>
        )}
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-4 text-white light:text-slate-800">{title}</h1>
          {lastUpdated && <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-white/10">Last updated: {lastUpdated}</p>}
          
          <div className="space-y-6 text-gray-300 light:text-slate-600 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicy: React.FC = () => (
  <LegalLayout title="Privacy Policy" lastUpdated="December 2025" icon={Shield}>
    <p>WiseTools Hub (“we”, “our”, “us”) provides utility tools for personal, academic, and professional use. This Privacy Policy explains how we collect, use, and protect your data.</p>
    
    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">1. Data We Collect</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Personal info (only when you log in):</strong> name, email, preferences.</li>
      <li><strong>Non-personal info:</strong> device, browser, tool usage patterns.</li>
      <li><strong>Cookies:</strong> for theme, login session, and preferences.</li>
      <li>No sensitive data collected (no bank details, passwords, Aadhaar, etc.).</li>
    </ul>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">2. How We Use Data</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li>Provide tool functionality.</li>
      <li>Improve UI and performance.</li>
      <li>Save history and preferences (only for logged-in users).</li>
      <li>Analytics to improve user experience.</li>
      <li>We <strong>NEVER</strong> sell or share your data.</li>
    </ul>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">3. Cookies</h3>
    <p>Used for personalization, theme settings, and login. Can be disabled anytime via your browser settings.</p>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">4. Security</h3>
    <p>We use encryption, secure tokens, and restricted access to protect your information.</p>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">5. Third-Party Services</h3>
    <p>We may use services like Google Analytics and optional login providers to enhance functionality.</p>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">6. User Rights</h3>
    <p>You may request deletion, view, or modification of your data at any time.</p>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">7. Contact</h3>
    <p>If you have any questions, please contact us at <a href="mailto:support@wisecrewsolutions.com" className="text-cyan-400 hover:underline">support@wisecrewsolutions.com</a>.</p>
  </LegalLayout>
);

export const TermsOfService: React.FC = () => (
  <LegalLayout title="Terms of Service" lastUpdated="December 2025" icon={FileText}>
    <p>By using WiseTools Hub, you agree to the following terms:</p>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">1. Platform Usage</h3>
    <p>Tools are provided for convenience. Do not misuse or attempt unauthorized access to our services.</p>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">2. Accounts</h3>
    <p>Login is optional. Users are responsible for keeping their credentials secure.</p>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">3. Accuracy</h3>
    <p>Tools provide estimates only. WiseTools Hub is not liable for any loss based on tool results or calculations.</p>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">4. Ownership</h3>
    <p>Logos, UI, tool logic, and site content belong to WiseCrew Solutions.</p>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">5. Liability</h3>
    <p>We provide services “as is” without warranties of any kind.</p>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">6. Changes</h3>
    <p>We may update tools, features, or terms at any time without prior notice.</p>
  </LegalLayout>
);

export const CookiePolicy: React.FC = () => (
  <LegalLayout title="Cookie Policy" lastUpdated="December 2025" icon={Cookie}>
    <p>We use cookies to improve your experience on WiseTools Hub. Here is how we use them:</p>

    <h3 className="text-xl font-bold text-white light:text-slate-800 mt-6">Types of Cookies</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Essential:</strong> Required for login, security, and basic site functionality.</li>
      <li><strong>Preferences:</strong> Store your theme choice (Light/Dark) and language settings.</li>
      <li><strong>Analytics:</strong> Help us understand how users interact with our tools to improve them.</li>
    </ul>

    <p className="mt-6">Users may disable cookies in their browser settings, but please note that some features (like saved history or themes) may not work correctly.</p>
  </LegalLayout>
);

export const Disclaimer: React.FC = () => (
  <LegalLayout title="Disclaimer" icon={AlertCircle}>
    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-6 text-yellow-200 light:text-yellow-800">
      <strong>Important:</strong> Please read carefully before using our financial or health tools.
    </div>

    <p>WiseTools Hub provides general-purpose calculators and utilities for informational purposes only.</p>
    
    <ul className="list-disc pl-5 space-y-4 mt-4">
      <li>Results from financial tools (EMI, SIP, Tax) may not be 100% accurate due to changing market conditions or regulations. They should not be considered as professional financial advice.</li>
      <li>Health tools (BMI, etc.) are estimates and should not replace professional medical advice.</li>
      <li>Use all tools at your own risk. We do not provide financial, legal, or academic guarantees.</li>
    </ul>
  </LegalLayout>
);