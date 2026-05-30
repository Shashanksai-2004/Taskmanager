import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        style={{ minHeight: '100vh' }}
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

// separate component so it can read theme context
const ThemedToaster = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        style: {
          background: isDark ? '#0d1117' : '#ffffff',
          color: isDark ? '#f1f5f9' : '#0f172a',
          border: isDark ? '1.5px solid rgba(255,255,255,0.08)' : '1.5px solid #dde3f0',
          borderRadius: '14px',
          fontSize: '13px',
          fontWeight: '500',
          boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(15,23,42,0.12)',
          padding: '12px 16px',
        },
        success: { iconTheme: { primary: isDark ? '#34d399' : '#10b981', secondary: isDark ? '#0d1117' : '#fff' } },
        error: { iconTheme: { primary: isDark ? '#f87171' : '#ef4444', secondary: isDark ? '#0d1117' : '#fff' } },
        duration: 3000,
      }}
    />
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedToaster />
        <AnimatedRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
