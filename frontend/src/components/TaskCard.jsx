import { motion } from 'framer-motion';
import { Pencil, Trash2, Clock, Circle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import Loader from './Loader';

const STAGE_META = {
  'Todo':        { badge: 'badge-todo',     dot: 'bg-slate-400',    icon: Circle,        dotColor: '#94a3b8' },
  'In Progress': { badge: 'badge-progress', dot: 'bg-amber-400',    icon: Clock,         dotColor: '#fbbf24' },
  'Done':        { badge: 'badge-done',     dot: 'bg-emerald-400',  icon: CheckCircle2,  dotColor: '#34d399' },
};

const TaskCard = ({ task, onEdit, onDelete, isDragging }) => {
  const [deleting, setDeleting] = useState(false);
  const meta = STAGE_META[task.stage] || STAGE_META['Todo'];
  const Icon = meta.icon;

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task._id);
    setDeleting(false);
  };

  const date = new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`task-card group ${isDragging ? 'dragging' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span className={meta.badge}>
          <Icon size={10} style={{ color: meta.dotColor }} />
          {task.stage}
        </span>
        <span className="text-[10px] text-slate-600 font-medium">{date}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2 mb-1.5 group-hover:text-white transition-colors">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Divider */}
      <div className="border-t border-white/5 mt-3 pt-3 flex items-center gap-1.5">
        <motion.button
          id={`edit-task-${task._id}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(task)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all duration-150 font-medium"
        >
          <Pencil size={12} />
          Edit
        </motion.button>

        <motion.button
          id={`delete-task-${task._id}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          disabled={deleting}
          className="btn-danger ml-auto disabled:opacity-40"
        >
          {deleting ? <Loader size="sm" /> : <Trash2 size={12} />}
          {deleting ? 'Deleting…' : 'Delete'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
