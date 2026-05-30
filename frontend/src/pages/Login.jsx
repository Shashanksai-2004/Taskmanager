import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, CheckSquare } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // already logged in — send them to the dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login(form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen flex">
      {/* left side - decorative panel, hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: 'linear-gradient(140deg, #1d4ed8 0%, #1e40af 35%, #0d9488 100%)',
        }}
      >
        {/* grid pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)' }} />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <CheckSquare size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">TaskFlow</span>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-5 text-white drop-shadow-sm">
              Your workspace,<br />
              <span className="opacity-80">organized.</span>
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-md opacity-90">
              Organize your work with a Kanban board. Drag, drop, and get things done.
            </p>
          </motion.div>

          <div className="mt-10 space-y-3.5">
            {[
              { icon: '⚡', text: 'Fast task management' },
              { icon: '🎯', text: 'Kanban board with drag & drop' },
              { icon: '🔒', text: 'JWT authentication' },
              { icon: '📱', text: 'Works on all devices' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-blue-100 opacity-90">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
            <p className="text-sm text-white italic opacity-90">"TaskFlow changed how our team manages sprints. Really clean UI."</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold text-white">A</div>
              <div>
                <p className="text-xs font-semibold text-white">Alex M.</p>
                <p className="text-[10px] text-blue-200 opacity-70">Product Manager</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* right side - login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12"
        style={{ background: 'var(--c-bg)' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* show logo on mobile only */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #0d9488)' }}>
              <CheckSquare size={15} className="text-white" />
            </div>
            <span className="font-bold text-base" style={{ color: '#1d4ed8' }}>TaskFlow</span>
          </div>

          <h2 className="text-2xl font-black mb-1" style={{ color: 'var(--c-text-1)' }}>Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--c-text-3)' }}>Sign in to your account to continue</p>

          <div className="rounded-2xl p-7" style={{ background: 'var(--c-bg-card)', border: '1.5px solid var(--c-border)', boxShadow: 'var(--shadow-md)' }}>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="login-email" className="input-label flex items-center gap-1.5">
                  <Mail size={11} style={{ color: '#1d4ed8' }} /> Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`input-field ${errors.email ? '!border-red-400 focus:!ring-red-200' : ''}`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-500">⚠ {errors.email}</p>}
              </div>

              <div>
                <label htmlFor="login-password" className="input-label flex items-center gap-1.5">
                  <Lock size={11} style={{ color: '#1d4ed8' }} /> Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`input-field ${errors.password ? '!border-red-400' : ''}`}
                />
                {errors.password && <p className="mt-1.5 text-xs text-red-500">⚠ {errors.password}</p>}
              </div>

              <motion.button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary w-full py-3 mt-1 text-base"
              >
                {loading ? <><Loader size="sm" /> Signing in…</> : <><span>Sign In</span><ArrowRight size={16} /></>}
              </motion.button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: 'var(--c-text-3)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold transition-colors" style={{ color: 'var(--c-primary)' }}>
                Create one free →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
