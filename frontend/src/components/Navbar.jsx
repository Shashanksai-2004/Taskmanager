import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Plus, Search, Bell, ChevronDown,
  Zap, Sun, Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onAddTask, searchQuery, onSearchChange }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const initials = user?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className="sticky top-0 z-40 border-b transition-colors duration-300"
      style={{
        background: 'var(--c-navbar-bg)',
        borderColor: 'var(--c-navbar-border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative flex items-center justify-center w-full h-full">
                <Zap size={15} className="text-white" />
              </div>
            </div>
            <span
              className="font-bold text-base tracking-tight hidden sm:block"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg,#818cf8,#c4b5fd)'
                  : 'linear-gradient(135deg,#1d4ed8,#0d9488)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TaskFlow
            </span>
          </Link>

          <div className="flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--c-search-ph)' }}
              />
              <input
                id="search-tasks"
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search tasks…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border transition-all duration-200 focus:outline-none"
                style={{
                  background: 'var(--c-search-bg)',
                  borderColor: 'var(--c-search-border)',
                  color: 'var(--c-search-text)',
                }}
              />
              {searchQuery && (
                <kbd
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded border"
                  style={{
                    color: 'var(--c-search-ph)',
                    borderColor: 'var(--c-search-border)',
                    background: 'var(--c-search-bg)',
                  }}
                >
                  ESC
                </kbd>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">

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

            <motion.button
              id="theme-toggle-btn"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200"
              style={{
                background: 'var(--c-user-btn-bg)',
                borderColor: 'var(--c-user-btn-border)',
                color: 'var(--c-sort-text)',
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <Sun size={16} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <Moon size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              className="btn-ghost w-9 h-9 p-0 rounded-xl relative"
              style={{ color: 'var(--c-sort-text)' }}
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </button>

            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200"
                style={{
                  background: 'var(--c-user-btn-bg)',
                  borderColor: 'var(--c-user-btn-border)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-user-btn-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--c-user-btn-bg)'; }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                  {initials}
                </div>
                <span
                  className="text-sm font-medium hidden sm:block max-w-[80px] truncate"
                  style={{ color: 'var(--c-user-name)' }}
                >
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown
                  size={13}
                  style={{ color: 'var(--c-chevron)' }}
                  className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-2xl overflow-hidden z-50"
                    style={{
                      background: 'var(--c-dropdown-bg)',
                      borderColor: 'var(--c-dropdown-border)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--c-dropdown-border)' }}>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--c-dropdown-name)' }}>
                        {user?.name}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--c-dropdown-email)' }}>
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1.5">
                      <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150"
                        style={{ color: 'var(--c-danger)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(248,113,113,0.08)' : 'rgba(239,68,68,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
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

        {/* mobile search bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--c-search-ph)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search tasks…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border transition-all focus:outline-none"
              style={{
                background: 'var(--c-search-bg)',
                borderColor: 'var(--c-search-border)',
                color: 'var(--c-search-text)',
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
