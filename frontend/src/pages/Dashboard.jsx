import { useState, useEffect, useCallback, useMemo } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  LayoutGrid, Circle, Clock, CheckCircle2, ListTodo,
  TrendingUp, Filter, ChevronDown, X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import TaskColumn from '../components/TaskColumn';
import TaskModal from '../components/TaskModal';
import { SkeletonColumn } from '../components/Loader';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';

const STAGES = ['Todo', 'In Progress', 'Done'];

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'alpha', label: 'A → Z' },
];

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="stat-card flex items-center gap-4"
  >
    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-black" style={{ color: 'var(--c-stat-value)' }}>{value}</p>
      <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--c-stat-label)' }}>{label}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterStage, setFilterStage] = useState('All');
  const [sortOpen, setSortOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const processedTasks = useMemo(() => {
    let result = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'alpha') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [tasks, search, sortBy]);

  const tasksByStage = (stage) => processedTasks.filter(t => t.stage === stage);

  const stats = useMemo(() => {
    const done = tasks.filter(t => t.stage === 'Done').length;
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.stage === 'Todo').length,
      inProgress: tasks.filter(t => t.stage === 'In Progress').length,
      done,
      pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
    };
  }, [tasks]);

  const openAddModal = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editTask) {
        const updated = await taskService.updateTask(editTask._id, formData);
        setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
        toast.success('Task updated!');
      } else {
        const created = await taskService.createTask(formData);
        setTasks(prev => [created, ...prev]);
        toast.success('Task created!');
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    const newStage = destination.droppableId;

    // optimistic update
    setTasks(prev => prev.map(t => t._id === draggableId ? { ...t, stage: newStage } : t));

    try {
      await taskService.updateTask(draggableId, { stage: newStage });
      toast.success(`Moved to ${newStage}`);
    } catch {
      // revert if it fails
      setTasks(prev => prev.map(t => t._id === draggableId ? { ...t, stage: source.droppableId } : t));
      toast.error('Failed to move task');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onAddTask={openAddModal} searchQuery={search} onSearchChange={setSearch} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div>
              <h1 className="text-xl font-black flex items-center gap-2" style={{ color: 'var(--c-board-head)' }}>
                <LayoutGrid size={20} className="text-indigo-400" />
                {user?.name?.split(' ')[0]}'s Board
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--c-board-sub)' }}>
                {loading ? 'Loading…' : `${stats.total} task${stats.total !== 1 ? 's' : ''} · ${stats.pct}% complete`}
              </p>
            </div>

            {!loading && stats.total > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                <TrendingUp size={14} className="text-indigo-400" />
                <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: 'var(--c-progress-track)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#6366f1,#22d3ee)' }}
                  />
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--c-board-sub)' }}>{stats.pct}%</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={ListTodo} label="Total Tasks" value={stats.total} color="#818cf8" delay={0.05} />
          <StatCard icon={Circle} label="To Do" value={stats.todo} color="#94a3b8" delay={0.1} />
          <StatCard icon={Clock} label="In Progress" value={stats.inProgress} color="#fbbf24" delay={0.15} />
          <StatCard icon={CheckCircle2} label="Completed" value={stats.done} color="#34d399" delay={0.2} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5">
            <Filter size={13} style={{ color: 'var(--c-board-sub)' }} />
            {['All', ...STAGES].map(s => (
              <motion.button
                key={s}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStage(s)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-200"
                style={filterStage === s
                  ? { background: 'rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.5)', color: '#818cf8' }
                  : { background: 'var(--c-filter-bg)', borderColor: 'var(--c-filter-border)', color: 'var(--c-board-sub)' }
                }
              >
                {s}
              </motion.button>
            ))}
          </div>

          <div className="relative ml-auto">
            <button
              onClick={() => setSortOpen(v => !v)}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-all"
              style={{
                background: 'var(--c-sort-bg)',
                borderColor: 'var(--c-sort-border)',
                color: 'var(--c-sort-text)',
              }}
            >
              {sortOptions.find(o => o.value === sortBy)?.label}
              <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 rounded-xl border shadow-2xl z-30 overflow-hidden"
                  style={{ background: 'var(--c-sort-dd-bg)', borderColor: 'var(--c-sort-border)', backdropFilter: 'blur(16px)' }}
                >
                  {sortOptions.map(o => (
                    <button
                      key={o.value}
                      onClick={() => { setSortBy(o.value); setSortOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium transition-colors duration-150"
                      style={{ color: sortBy === o.value ? '#818cf8' : 'var(--c-sort-text)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {o.value === sortBy && '✓ '}{o.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {search && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSearch('')}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all"
              style={{ color: 'var(--c-board-sub)', borderColor: 'var(--c-filter-border)', background: 'var(--c-filter-bg)' }}
            >
              <X size={11} />
              Clear search
            </motion.button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <SkeletonColumn key={i} />)}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {STAGES.map(stage => {
                const stageTasks = tasksByStage(stage);
                const filtered = filterStage === 'All' || filterStage === stage ? stageTasks : [];
                return (
                  <TaskColumn
                    key={stage}
                    stage={stage}
                    tasks={filtered}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    onAdd={openAddModal}
                  />
                );
              })}
            </motion.div>
          </DragDropContext>
        )}

        {!loading && search && processedTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold text-lg" style={{ color: 'var(--c-board-head)' }}>No tasks found</h3>
            <p className="text-sm mt-2" style={{ color: 'var(--c-board-sub)' }}>Try a different search term</p>
            <button onClick={() => setSearch('')} className="mt-4 btn-secondary text-sm">
              Clear search
            </button>
          </motion.div>
        )}
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editTask={editTask}
        loading={submitting}
      />
    </div>
  );
};

export default Dashboard;
