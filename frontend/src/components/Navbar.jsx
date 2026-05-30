import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, LogOut, Plus, Search, Bell, ChevronDown,
  CheckSquare, Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onAddTask, searchQuery, onSearchChange }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-white/6"
      style={{ background: 'rgba(8,11,20,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative flex items-center justify-center w-full h-full">
                <Zap size={15} className="text-white" />
              </div>
            </div>
            <span className="font-bold text-base tracking-tight hidden sm:block"
              style={{ background: 'linear-gradient(135deg,#818cf8,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TaskFlow
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="search-tasks"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tasks…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-white/8 bg-white/4 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
              />
              {searchQuery && (
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 px-1.5 py-0.5 rounded border border-white/8 bg-white/4">
                  ESC
                </kbd>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Add task */}
            <motion.button
              id="add-task-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAddTask}
              className="btn-primary text-sm px-4 py-2"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New Task</span>
            </motion.button>

            {/* Notification bell placeholder */}
            <button className="btn-ghost w-9 h-9 p-0 rounded-xl relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 hover:border-white/15 transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                  {initials}
                </div>
                <span className="text-sm text-slate-300 font-medium hidden sm:block max-w-[80px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={13} className={`text-slate-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
                    style={{ background: 'rgba(12,17,35,0.98)', backdropFilter: 'blur(20px)' }}
                  >
                    <div className="px-4 py-3 border-b border-white/8">
                      <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors duration-150"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-white/8 bg-white/4 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
