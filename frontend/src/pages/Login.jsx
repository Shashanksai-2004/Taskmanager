import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

/* Left-side decorative feature list */
const FEATURES = [
  { icon: '⚡', text: 'Lightning-fast task management' },
  { icon: '🎯', text: 'Kanban board with drag & drop' },
  { icon: '🔒', text: 'Secure JWT authentication' },
  { icon: '📱', text: 'Works on all your devices' },
];

const Login = () => {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [errors, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrs(errs); return; }
    setLoading(true);
    try {
      const data = await authService.login(form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrs((p) => ({ ...p, [name]: '' }));
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d1225 0%, #0f172a 40%, #0a0f1e 100%)',
        }}
      >
        {/* Glow orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(50px)' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-lg opacity-60" />
            <div className="relative flex items-center justify-center w-full h-full">
              <Zap size={18} className="text-white" />
            </div>
          </div>
          <span className="text-xl font-bold"
            style={{ background: 'linear-gradient(135deg,#818cf8,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TaskFlow
          </span>
        </div>

        {/* Hero text */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
              ✦ Manage tasks like a pro
            </span>
            <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-5 text-white">
              Your workspace,<br />
              <span style={{ background: 'linear-gradient(135deg,#818cf8 0%,#c4b5fd 50%,#67e8f9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                supercharged.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Organize your work with a beautiful Kanban board. Drag, drop, and get things done.
            </p>
          </motion.div>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 space-y-3.5"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm text-slate-400">{f.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom testimonial */}
        <div className="relative">
          <div className="p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm text-slate-300 italic">"TaskFlow completely changed how our team manages sprints. The drag-and-drop is buttery smooth."</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white">A</div>
              <div>
                <p className="text-xs font-semibold text-slate-300">Alex M.</p>
                <p className="text-[10px] text-slate-600">Product Manager</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12"
        style={{ background: 'rgba(8,11,20,1)' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold text-base"
              style={{ background: 'linear-gradient(135deg,#818cf8,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TaskFlow
            </span>
          </div>

          <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your account to continue</p>

          <div className="rounded-2xl p-7"
            style={{ background: 'rgba(15,20,40,0.8)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="input-label flex items-center gap-1.5">
                  <Mail size={11} className="text-indigo-400" /> Email
                </label>
                <input
                  id="login-email" type="email" name="email"
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com" autoComplete="email"
                  className={`input-field ${errors.email ? 'border-rose-500/60' : ''}`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-rose-400">⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="input-label flex items-center gap-1.5">
                  <Lock size={11} className="text-indigo-400" /> Password
                </label>
                <input
                  id="login-password" type="password" name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Enter your password" autoComplete="current-password"
                  className={`input-field ${errors.password ? 'border-rose-500/60' : ''}`}
                />
                {errors.password && <p className="mt-1.5 text-xs text-rose-400">⚠ {errors.password}</p>}
              </div>

              {/* Submit */}
              <motion.button
                id="login-submit-btn"
                type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary w-full py-3 mt-1 text-base"
              >
                {loading ? <><Loader size="sm" /> Signing in…</> : <><span>Sign In</span><ArrowRight size={16} /></>}
              </motion.button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
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
