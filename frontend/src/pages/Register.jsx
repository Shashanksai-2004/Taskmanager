import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const PERKS = [
  'Free forever — no credit card needed',
  'Unlimited tasks across 3 stages',
  'Beautiful drag-and-drop Kanban board',
  'Accessible from any device',
];

const Register = () => {
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [errors, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrs(errs); return; }
    setLoading(true);
    try {
      const data = await authService.register(form);
      login(data);
      toast.success(`Account created! Welcome, ${data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrs((p) => ({ ...p, [name]: '' }));
  };

  // password strength 0-4
  const pwStrength = Math.min(4, Math.floor(form.password.length / 3));
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0d1225 0%,#0f172a 50%,#0a0f1e 100%)' }}
      >
        <div className="absolute top-[-15%] right-[-15%] w-[450px] h-[450px] rounded-full animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', filter: 'blur(50px)' }} />

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

        {/* Hero */}
        <div className="relative space-y-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd' }}>
              ✦ Join thousands of users
            </span>
            <h1 className="text-4xl xl:text-5xl font-black leading-tight text-white">
              Start for free,<br />
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                stay productive.
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed mt-4 max-w-sm">
              Create your account in seconds and start organizing your work with TaskFlow's beautiful Kanban board.
            </p>
          </motion.div>

          <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            {PERKS.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-400">{p}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating card decoration */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white">T</div>
            <div>
              <p className="text-xs font-semibold text-slate-300">Design new feature</p>
              <p className="text-[10px] text-slate-600">In Progress · 2 hours ago</p>
            </div>
            <span className="ml-auto badge-progress">In Progress</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5">
            <div className="h-full w-2/3 rounded-full" style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
          </div>
        </motion.div>
      </motion.div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12"
        style={{ background: 'rgba(8,11,20,1)' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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

          <h2 className="text-2xl font-black text-white mb-1">Create your account</h2>
          <p className="text-slate-500 text-sm mb-8">Get started with TaskFlow — it's completely free</p>

          <div className="rounded-2xl p-7"
            style={{ background: 'rgba(15,20,40,0.8)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label htmlFor="register-name" className="input-label flex items-center gap-1.5">
                  <User size={11} className="text-indigo-400" /> Full Name
                </label>
                <input
                  id="register-name" type="text" name="name"
                  value={form.name} onChange={handleChange}
                  placeholder="John Doe" autoComplete="name"
                  className={`input-field ${errors.name ? 'border-rose-500/60' : ''}`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-rose-400">⚠ {errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="register-email" className="input-label flex items-center gap-1.5">
                  <Mail size={11} className="text-indigo-400" /> Email
                </label>
                <input
                  id="register-email" type="email" name="email"
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com" autoComplete="email"
                  className={`input-field ${errors.email ? 'border-rose-500/60' : ''}`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-rose-400">⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="register-password" className="input-label flex items-center gap-1.5">
                  <Lock size={11} className="text-indigo-400" /> Password
                </label>
                <input
                  id="register-password" type="password" name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" autoComplete="new-password"
                  className={`input-field ${errors.password ? 'border-rose-500/60' : ''}`}
                />
                {errors.password && <p className="mt-1.5 text-xs text-rose-400">⚠ {errors.password}</p>}
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map((lvl) => (
                        <div key={lvl} className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ background: pwStrength >= lvl ? strengthColors[pwStrength] : 'rgba(255,255,255,0.06)' }} />
                      ))}
                    </div>
                    {pwStrength > 0 && (
                      <p className="text-[11px] font-medium" style={{ color: strengthColors[pwStrength] }}>
                        {strengthLabels[pwStrength]} password
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit */}
              <motion.button
                id="register-submit-btn"
                type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary w-full py-3 mt-1 text-base"
              >
                {loading ? <><Loader size="sm" />Creating account…</> : <><span>Create Account</span><ArrowRight size={16} /></>}
              </motion.button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
