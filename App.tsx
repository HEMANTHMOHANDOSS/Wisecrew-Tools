import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './components/SharedUI';
import { Loader2 } from 'lucide-react';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const About = lazy(() => import('./pages/About'));
const FinancePage = lazy(() => import('./pages/FinancePage'));
const StudentTools = lazy(() => import('./pages/StudentTools'));
const ProductivityPage = lazy(() => import('./pages/ProductivityPage'));
const DailyPage = lazy(() => import('./pages/DailyPage'));
const Converters = lazy(() => import('./pages/Converters'));
const AIToolsPage = lazy(() => import('./pages/AIToolsPage'));
const PersonalTools = lazy(() => import('./pages/PersonalTools'));
const DeveloperTools = lazy(() => import('./pages/DeveloperTools'));
const Login = lazy(() => import('./pages/Login'));
const Support = lazy(() => import('./pages/Support'));

// Correctly lazy load named exports from Legal.tsx
const PrivacyPolicy = lazy(() => import('./pages/Legal').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/Legal').then(module => ({ default: module.TermsOfService })));
const CookiePolicy = lazy(() => import('./pages/Legal').then(module => ({ default: module.CookiePolicy })));
const Disclaimer = lazy(() => import('./pages/Legal').then(module => ({ default: module.Disclaimer })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
      <p className="text-gray-400 font-medium animate-pulse">Loading WiseTools...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/about" element={<About />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/student" element={<StudentTools />} />
        <Route path="/productivity" element={<ProductivityPage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/personal" element={<PersonalTools />} />
        <Route path="/developer" element={<DeveloperTools />} />
        <Route path="/converters" element={<Converters />} />
        <Route path="/ai" element={<AIToolsPage />} />
        
        {/* Support Routes - Explicit paths */}
        <Route path="/help-center" element={<Support staticType="help" />} />
        <Route path="/faq" element={<Support staticType="faq" />} />
        <Route path="/contact" element={<Support staticType="contact" />} />
        <Route path="/report-bug" element={<Support staticType="bug" />} />
        <Route path="/request-feature" element={<Support staticType="feature" />} />
        
        {/* Fallback for legacy support links if any */}
        <Route path="/support/:type" element={<Support />} />
        
        {/* Legal Routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        {/* Fallback - Redirects unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;