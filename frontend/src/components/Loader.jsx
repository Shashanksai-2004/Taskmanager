import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable animated loader — spinner or skeleton variants
 */

/* ── Spinner ── */
const Spinner = ({ size = 'md', className = '' }) => {
  const sz = { sm: 16, md: 28, lg: 44 }[size];
  return (
    <svg
      width={sz} height={sz} viewBox="0 0 24 24"
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="rgba(99,102,241,0.2)" strokeWidth="3" fill="none" />
      <path
        d="M12 2 a10 10 0 0 1 10 10"
        stroke="url(#spin-grad)" strokeWidth="3" strokeLinecap="round" fill="none"
      />
      <defs>
        <linearGradient id="spin-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div className="task-card space-y-3">
    <div className="skeleton h-3 w-16 rounded-full" />
    <div className="skeleton h-4 w-3/4 rounded" />
    <div className="skeleton h-3 w-full rounded" />
    <div className="skeleton h-3 w-2/3 rounded" />
    <div className="flex gap-2 pt-2 border-t border-white/5">
      <div className="skeleton h-6 w-12 rounded-lg" />
      <div className="skeleton h-6 w-14 rounded-lg ml-auto" />
    </div>
  </div>
);

/* ── Column skeleton (3 cards) ── */
export const SkeletonColumn = () => (
  <div className="flex flex-col gap-3 p-3 rounded-2xl border border-white/5 bg-white/2 min-h-[480px]">
    <div className="flex items-center justify-between mb-1 px-1">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton h-5 w-8 rounded-full" />
    </div>
    {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
  </div>
);

/* ── Full-screen loader ── */
const FullscreenLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50"
    style={{ background: 'rgba(8,11,20,0.9)', backdropFilter: 'blur(12px)' }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <Spinner size="lg" />
      <p className="text-slate-400 text-sm font-medium tracking-wide">Loading…</p>
    </motion.div>
  </div>
);

/* ── Default export: smart loader ── */
const Loader = ({ size = 'md', fullscreen = false }) => {
  if (fullscreen) return <FullscreenLoader />;
  return <Spinner size={size} />;
};

export { Spinner, SkeletonCard };
export default Loader;
