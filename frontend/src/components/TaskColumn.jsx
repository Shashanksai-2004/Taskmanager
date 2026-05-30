import { motion, AnimatePresence } from 'framer-motion';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Circle, Clock, CheckCircle2, Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const COLUMN_META = {
  'Todo': {
    Icon: Circle,
    color: '#818cf8',
    glow: 'rgba(99,102,241,0.15)',
    headerBg: 'rgba(99,102,241,0.08)',
    headerBorder: 'rgba(99,102,241,0.2)',
    countBg: 'rgba(99,102,241,0.15)',
    countColor: '#a5b4fc',
    dropBg: 'rgba(99,102,241,0.05)',
    dropBorder: 'rgba(99,102,241,0.3)',
  },
  'In Progress': {
    Icon: Clock,
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.12)',
    headerBg: 'rgba(251,191,36,0.06)',
    headerBorder: 'rgba(251,191,36,0.2)',
    countBg: 'rgba(251,191,36,0.15)',
    countColor: '#fcd34d',
    dropBg: 'rgba(251,191,36,0.04)',
    dropBorder: 'rgba(251,191,36,0.3)',
  },
  'Done': {
    Icon: CheckCircle2,
    color: '#34d399',
    glow: 'rgba(52,211,153,0.12)',
    headerBg: 'rgba(52,211,153,0.06)',
    headerBorder: 'rgba(52,211,153,0.2)',
    countBg: 'rgba(52,211,153,0.15)',
    countColor: '#6ee7b7',
    dropBg: 'rgba(52,211,153,0.04)',
    dropBorder: 'rgba(52,211,153,0.3)',
  },
};

const EmptyState = ({ stage, meta, onAdd }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center flex-1 py-12 gap-4"
  >
    <div className="relative">
      <div className="w-14 h-14 rounded-2xl border-2 border-dashed flex items-center justify-center"
        style={{ borderColor: `${meta.color}40`, background: `${meta.color}08` }}>
        <meta.Icon size={22} style={{ color: `${meta.color}80` }} />
      </div>
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-slate-400">No tasks yet</p>
      <p className="text-xs text-slate-600 mt-1">Drop a card here or create a new task</p>
    </div>
    {onAdd && (
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAdd}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all duration-200"
        style={{
          color: meta.color,
          borderColor: `${meta.color}30`,
          background: `${meta.color}08`,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${meta.color}15`; e.currentTarget.style.borderColor = `${meta.color}50`; }}
        onMouseLeave={e => { e.currentTarget.style.background = `${meta.color}08`; e.currentTarget.style.borderColor = `${meta.color}30`; }}
      >
        <Plus size={13} /> Add task
      </motion.button>
    )}
  </motion.div>
);

const TaskColumn = ({ stage, tasks, onEdit, onDelete, onAdd }) => {
  const meta = COLUMN_META[stage];

  return (
    <div className="flex flex-col min-h-0">
      {/* Column header */}
      <motion.div
        className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl"
        style={{ background: meta.headerBg, border: `1px solid ${meta.headerBorder}` }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: `${meta.color}18` }}>
            <meta.Icon size={13} style={{ color: meta.color }} />
          </div>
          <h2 className="text-sm font-bold" style={{ color: meta.color }}>
            {stage}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: meta.countBg, color: meta.countColor }}
          >
            {tasks.length}
          </span>
        </div>
      </motion.div>

      {/* Droppable */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 flex flex-col gap-2.5 rounded-2xl p-3 min-h-[460px] transition-all duration-200"
            style={{
              background: snapshot.isDraggingOver ? meta.dropBg : 'rgba(255,255,255,0.02)',
              border: `1px solid ${snapshot.isDraggingOver ? meta.dropBorder : 'rgba(255,255,255,0.05)'}`,
              boxShadow: snapshot.isDraggingOver ? `inset 0 0 40px ${meta.glow}` : 'none',
            }}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver ? (
              <EmptyState stage={stage} meta={meta} onAdd={onAdd} />
            ) : (
              <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(prov, snap) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                      >
                        <TaskCard
                          task={task}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          isDragging={snap.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
