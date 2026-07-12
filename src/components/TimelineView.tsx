import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_TIMELINE } from '../data/portfolio';
import {
  Briefcase, GraduationCap, Sparkles, Calendar,
  CheckCircle2, ChevronDown, ChevronUp, MapPin, Building2
} from 'lucide-react';
import WorkspaceHeader from './WorkspaceHeader';

interface TimelineViewProps {
  customTitle?: string;
  customIntro?: string;
  highlightedItems?: string[];
}

// Color accent per company/role type
const TIMELINE_ACCENTS: Record<string, { border: string; dot: string; glow: string; badge: string }> = {
  time_1: { border: 'border-violet-500/30', dot: 'bg-violet-500 border-violet-400', glow: 'shadow-[0_0_16px_rgba(139,92,246,0.15)]', badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
  time_2: { border: 'border-blue-500/30',   dot: 'bg-blue-500 border-blue-400',     glow: 'shadow-[0_0_16px_rgba(59,130,246,0.15)]',  badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  time_3: { border: 'border-emerald-500/30',dot: 'bg-emerald-500 border-emerald-400',glow: 'shadow-[0_0_16px_rgba(16,185,129,0.15)]', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  time_4: { border: 'border-amber-500/30',  dot: 'bg-amber-500 border-amber-400',   glow: 'shadow-[0_0_16px_rgba(245,158,11,0.15)]',  badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  time_5: { border: 'border-rose-500/30',   dot: 'bg-rose-500 border-rose-400',     glow: 'shadow-[0_0_16px_rgba(244,63,94,0.15)]',   badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
  time_6: { border: 'border-cyan-500/30',   dot: 'bg-cyan-500 border-cyan-400',     glow: 'shadow-[0_0_16px_rgba(6,182,212,0.15)]',   badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' },
};

export default function TimelineView({
  customTitle,
  customIntro,
  highlightedItems = []
}: TimelineViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>('time_1');

  return (
    <motion.div
      id="timeline-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <WorkspaceHeader
        title={customTitle || 'Career & Academic Journey'}
        subtitle={customIntro || 'A timeline of my professional accomplishments, engineering roles, and academic milestones.'}
        isCustomized={!!customTitle || !!customIntro}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Companies', value: '2', icon: Building2 },
          { label: 'Years Exp.', value: '5+', icon: Briefcase },
          { label: 'Roles', value: '5', icon: MapPin },
        ].map((s, i) => (
          <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-1">
            <s.icon className="w-4 h-4 text-indigo-400" />
            <div className="text-lg font-bold font-display text-white">{s.value}</div>
            <div className="text-[10px] text-slate-500 font-mono">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-slate-800 ml-3 pl-6 md:pl-8 space-y-5 py-2">
        {INITIAL_TIMELINE.map((item, idx) => {
          const isAcademic = item.role.includes('Bachelor') || item.role.includes('BS') || item.role.includes('Academic');
          const isHighlighted = highlightedItems.some(h =>
            h.toLowerCase().includes(item.company.toLowerCase()) ||
            h.toLowerCase().includes(item.role.toLowerCase())
          );
          const isExpanded = expandedId === item.id;
          const accent = TIMELINE_ACCENTS[item.id] ?? TIMELINE_ACCENTS['time_6'];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.07 }}
              className="relative"
            >
              {/* Timeline dot */}
              <span className={`absolute -left-[38px] md:-left-[46px] top-4 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                isHighlighted
                  ? 'bg-amber-500 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : `${accent.dot} shadow-[0_0_8px_rgba(0,0,0,0.4)]`
              }`}>
                {isAcademic
                  ? <GraduationCap className="w-3.5 h-3.5 text-white" />
                  : <Briefcase className="w-3.5 h-3.5 text-white" />
                }
              </span>

              {/* Card */}
              <div className={`rounded-xl border transition-all overflow-hidden ${
                isHighlighted
                  ? 'bg-amber-500/[0.03] border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.06)]'
                  : `bg-slate-900 ${accent.border} ${isExpanded ? accent.glow : 'hover:border-slate-700'}`
              }`}>

                {/* Company Image Banner — only if image + expanded */}
                <AnimatePresence>
                  {item.image && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 160, opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="relative overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.company}
                        className="w-full h-full object-cover object-center"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                      {/* Company badge on photo */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${
                          isHighlighted ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : `${accent.badge}`
                        }`}>
                          📍 {item.company}
                        </span>
                        <span className="text-[9px] font-mono text-white/60 bg-black/40 px-2 py-0.5 rounded">
                          {item.year}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card Header — clickable to expand */}
                <button
                  className="w-full text-left p-4 md:p-5"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5 flex-1">
                      <span className="text-[10px] font-mono text-indigo-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {item.year}
                      </span>
                      <h4 className="text-base font-bold font-display text-white tracking-tight flex items-center gap-2 flex-wrap">
                        {item.role}
                        {isHighlighted && (
                          <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
                            <Sparkles className="w-2.5 h-2.5" /> Referenced
                          </span>
                        )}
                        {item.image && (
                          <span className={`inline-flex items-center gap-1 text-[8px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded border ${accent.badge}`}>
                            📸 Photo
                          </span>
                        )}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400 font-sans">{item.company}</p>
                    </div>
                    <div className="shrink-0 mt-1 text-slate-500">
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                      }
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-5 pb-5 space-y-4 border-t border-slate-800/60 pt-3">
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.description}
                        </p>

                        {item.achievements && item.achievements.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-semibold">
                              Key Highlights
                            </h5>
                            <ul className="space-y-1.5">
                              {item.achievements.map((ach, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80 shrink-0 mt-0.5" />
                                  <span>{ach}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
