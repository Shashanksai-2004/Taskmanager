import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const pageVariants = {
  initial: { opacity: 0 },
  in:      { opacity: 1 },
  out:     { opacity: 0 },
};
const pageTransition = { duration: 0.25, ease: 'easeInOut' };

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{ minHeight: '100vh' }}
      >
        <Routes location={location}>
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/"          element={<Navigate to="/dashboard" replace />} />
          <Route path="*"          element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          style: {
            background: 'rgba(10,14,28,0.95)',
            color: '#e2e8f0',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: '500',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            padding: '12px 16px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          duration: 3000,
        }}
      />
      <AnimatedRoutes />
    </AuthProvider>
  );
}

export default App;
