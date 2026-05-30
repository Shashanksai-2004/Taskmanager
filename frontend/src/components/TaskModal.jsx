import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, AlignLeft, Layers, Sparkles } from 'lucide-react';
import Loader from './Loader';

const STAGES = ['Todo', 'In Progress', 'Done'];

const STAGE_COLORS = {
  'Todo':        { bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.4)',  text: '#818cf8' },
  'In Progress': { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.4)',  text: '#fcd34d' },
  'Done':        { bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.4)',  text: '#6ee7b7' },
};

const TaskModal = ({ isOpen, onClose, onSubmit, editTask, loading }) => {
  const [form, setForm]     = useState({ title: '', description: '', stage: 'Todo' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTask) {
      setForm({ title: editTask.title || '', description: editTask.description || '', stage: editTask.stage || 'Todo' });
    } else {
      setForm({ title: '', description: '', stage: 'Todo' });
    }
    setErrors({});
  }, [editTask, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Please give your task a title';
    else if (form.title.trim().length > 100) e.title = 'Title must be under 100 characters';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(10,14,28,0.98)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(24px)',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Gradient top accent */}
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)' }} />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <Sparkles size={16} className="text-indigo-400" />
                  </div>
                  <div>
                    <h2 id="modal-title" className="text-base font-bold text-slate-100">
                      {editTask ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {editTask ? 'Update the details below' : 'Fill in the details for your new task'}
                    </p>
                  </div>
                </div>
                <motion.button
                  id="modal-close-btn"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div>
                  <label htmlFor="task-title" className="input-label flex items-center gap-1.5">
                    <Type size={11} className="text-indigo-400" /> Title
                  </label>
                  <input
                    id="task-title"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Design the landing page hero section"
                    autoFocus
                    className={`input-field ${errors.title ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
                  />
                  <AnimatePresence>
                    {errors.title && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1.5 text-xs text-rose-400 flex items-center gap-1"
                      >
                        ⚠ {errors.title}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="task-description" className="input-label flex items-center gap-1.5">
                    <AlignLeft size={11} className="text-indigo-400" /> Description
                    <span className="text-slate-600 lowercase font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="task-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Add more context about this task…"
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                {/* Stage picker */}
                <div>
                  <label className="input-label flex items-center gap-1.5">
                    <Layers size={11} className="text-indigo-400" /> Stage
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {STAGES.map((s) => {
                      const c = STAGE_COLORS[s];
                      const active = form.stage === s;
                      return (
                        <motion.button
                          key={s}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setForm((p) => ({ ...p, stage: s }))}
                          className="py-2.5 px-2 rounded-xl text-xs font-semibold text-center border transition-all duration-200"
                          style={{
                            background: active ? c.bg : 'rgba(255,255,255,0.03)',
                            borderColor: active ? c.border : 'rgba(255,255,255,0.08)',
                            color: active ? c.text : '#64748b',
                            boxShadow: active ? `0 0 12px ${c.bg}` : 'none',
                          }}
                        >
                          {s}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    id="modal-cancel-btn"
                    onClick={onClose}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    id="modal-submit-btn"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary flex-1"
                  >
                    {loading ? (
                      <><Loader size="sm" /><span>{editTask ? 'Saving…' : 'Creating…'}</span></>
                    ) : (
                      <span>{editTask ? 'Save Changes' : 'Create Task'}</span>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
