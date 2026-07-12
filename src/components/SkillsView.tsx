import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_SKILLS } from '../data/portfolio';
import { Sparkles, Zap } from 'lucide-react';
import WorkspaceHeader from './WorkspaceHeader';

interface SkillsViewProps {
  customTitle?: string;
  customIntro?: string;
  highlightedItems?: string[];
  filterCategory?: string;
}

// Map skill names to Simple Icons CDN slugs + brand colors
const SKILL_ICON_MAP: Record<string, { icon: string; color: string; bg: string }> = {
  'Golang':                       { icon: 'go',           color: '#00ACD7', bg: 'rgba(0,172,215,0.1)' },
  'Python (Flask, FastAPI, PyQt5)':{ icon: 'python',      color: '#3776AB', bg: 'rgba(55,118,171,0.1)' },
  'PostgreSQL':                   { icon: 'postgresql',   color: '#4169E1', bg: 'rgba(65,105,225,0.1)' },
  'MySQL':                        { icon: 'mysql',        color: '#4479A1', bg: 'rgba(68,121,161,0.1)' },
  'MongoDB':                      { icon: 'mongodb',      color: '#47A248', bg: 'rgba(71,162,72,0.1)' },
  'Redis':                        { icon: 'redis',        color: '#FF4438', bg: 'rgba(255,68,56,0.1)' },
  'PHP':                          { icon: 'php',          color: '#777BB4', bg: 'rgba(119,123,180,0.1)' },
  'Java':                         { icon: 'openjdk',      color: '#ED8B00', bg: 'rgba(237,139,0,0.1)' },
  'React':                        { icon: 'react',        color: '#61DAFB', bg: 'rgba(97,218,251,0.1)' },
  'Flutter':                      { icon: 'flutter',      color: '#02569B', bg: 'rgba(2,86,155,0.1)' },
  'TypeScript':                   { icon: 'typescript',   color: '#3178C6', bg: 'rgba(49,120,198,0.1)' },
  'Tailwind CSS':                 { icon: 'tailwindcss',  color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  'PyTorch & Deep Learning':      { icon: 'pytorch',      color: '#EE4C2C', bg: 'rgba(238,76,44,0.1)' },
  'LangChain & LangGraph':        { icon: 'langchain',    color: '#1C3C3C', bg: 'rgba(28,60,60,0.15)' },
  'RAG & ChromaDB':               { icon: 'openai',       color: '#412991', bg: 'rgba(65,41,145,0.1)' },
  'OpenCV & Computer Vision':     { icon: 'opencv',       color: '#5C3EE8', bg: 'rgba(92,62,232,0.1)' },
  'LLM Prompt Engineering':       { icon: 'anthropic',    color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
  'Docker & Containerization':    { icon: 'docker',       color: '#2496ED', bg: 'rgba(36,150,237,0.1)' },
  'Nginx & Reverse Proxy':        { icon: 'nginx',        color: '#009639', bg: 'rgba(0,150,57,0.1)' },
  'IoT & Embedded Systems':       { icon: 'raspberrypi',  color: '#A22846', bg: 'rgba(162,40,70,0.1)' },
  'Arduino & NodeMCU':            { icon: 'arduino',      color: '#00979D', bg: 'rgba(0,151,157,0.1)' },
  'LoRa & Wireless Protocols':    { icon: 'semaphoreci',  color: '#19A974', bg: 'rgba(25,169,116,0.1)' },
  'Linux Ubuntu / VPS':           { icon: 'ubuntu',       color: '#E95420', bg: 'rgba(233,84,32,0.1)' },
  'GitLab CI/CD':                 { icon: 'gitlab',       color: '#FC6D26', bg: 'rgba(252,109,38,0.1)' },
  'SNAP BI & HMAC/RSA':           { icon: 'webauthn',     color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
};

const CATEGORY_COLORS: Record<string, { label: string; dot: string; bar: string }> = {
  'Backend':        { label: 'text-violet-400',  dot: 'bg-violet-400',  bar: 'from-violet-600 to-violet-400' },
  'Frontend':       { label: 'text-cyan-400',    dot: 'bg-cyan-400',    bar: 'from-cyan-600 to-cyan-400' },
  'AI & LLMs':      { label: 'text-amber-400',   dot: 'bg-amber-400',   bar: 'from-amber-600 to-amber-400' },
  'Cloud & Systems':{ label: 'text-emerald-400', dot: 'bg-emerald-400', bar: 'from-emerald-600 to-emerald-400' },
};

export default function SkillsView({
  customTitle,
  customIntro,
  highlightedItems = [],
  filterCategory
}: SkillsViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    if (filterCategory) {
      const categories = ['Frontend', 'Backend', 'AI & LLMs', 'Cloud & Systems'];
      const matched = categories.find(c =>
        c.toLowerCase().includes(filterCategory.toLowerCase()) ||
        filterCategory.toLowerCase().includes(c.toLowerCase())
      );
      if (matched) setActiveCategory(matched);
    }
  }, [filterCategory]);

  const categories = ['All', 'Backend', 'Frontend', 'AI & LLMs', 'Cloud & Systems'];

  const filteredSkills = INITIAL_SKILLS.filter(skill =>
    activeCategory === 'All' || skill.category === activeCategory
  );

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    const aH = highlightedItems.some(h => h.toLowerCase().includes(a.name.toLowerCase()));
    const bH = highlightedItems.some(h => h.toLowerCase().includes(b.name.toLowerCase()));
    if (aH && !bH) return -1;
    if (!aH && bH) return 1;
    return b.level - a.level;
  });

  const avgLevel = Math.round(sortedSkills.reduce((s, sk) => s + sk.level, 0) / (sortedSkills.length || 1));

  return (
    <motion.div
      id="skills-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <WorkspaceHeader
        title={customTitle || 'Technical Competencies'}
        subtitle={customIntro || 'A curated breakdown of my engineering stack — from backend microservices to IoT hardware and AI pipelines.'}
        isCustomized={!!customTitle || !!customIntro}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Technologies', value: INITIAL_SKILLS.length, suffix: '+' },
          { label: 'Avg. Proficiency', value: avgLevel, suffix: '%' },
          { label: 'Years Exp.', value: 5, suffix: '+' },
        ].map((stat, i) => (
          <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-xl font-bold font-display text-white">
              {stat.value}<span className="text-indigo-400">{stat.suffix}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const col = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                activeCategory === cat
                  ? cat === 'All'
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : `bg-slate-800 border-slate-600 ${col?.label}`
                  : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              {col && activeCategory === cat && (
                <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
              )}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {sortedSkills.map((skill, index) => {
            const isHighlighted = highlightedItems.some(h =>
              h.toLowerCase().includes(skill.name.toLowerCase()) ||
              h.toLowerCase().includes(skill.category.toLowerCase())
            );
            const iconData = SKILL_ICON_MAP[skill.name];
            const catStyle = CATEGORY_COLORS[skill.category] ?? CATEGORY_COLORS['Backend'];
            const iconUrl = iconData
              ? `https://cdn.simpleicons.org/${iconData.icon}`
              : null;

            return (
              <motion.div
                key={skill.name}
                layoutId={`skill-${skill.name}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.25) }}
                className={`relative rounded-xl border overflow-hidden transition-all group ${
                  isHighlighted
                    ? 'bg-amber-500/[0.04] border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.06)]'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top glow accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                  style={{
                    background: iconData
                      ? `linear-gradient(to right, transparent, ${iconData.color}, transparent)`
                      : 'linear-gradient(to right, transparent, #6366f1, transparent)'
                  }}
                />

                <div className="p-4 space-y-3">
                  {/* Header Row */}
                  <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-slate-700/60"
                      style={{ backgroundColor: iconData?.bg ?? 'rgba(99,102,241,0.1)' }}
                    >
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt={skill.name}
                          className="w-5 h-5 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-base">⚙️</span>
                      )}
                    </div>

                    {/* Name & Category */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${catStyle.dot}`} />
                        <span className={`text-[9px] font-mono font-semibold uppercase tracking-wider ${catStyle.label}`}>
                          {skill.category}
                        </span>
                        {isHighlighted && (
                          <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Sparkles className="w-2.5 h-2.5" /> Match
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold font-display text-white leading-tight truncate">
                        {skill.name}
                      </h4>
                    </div>

                    {/* Level Badge */}
                    <div
                      className="shrink-0 px-2 py-1 rounded-lg text-xs font-bold font-mono border"
                      style={{
                        color: iconData?.color ?? '#6366f1',
                        borderColor: `${iconData?.color ?? '#6366f1'}33`,
                        backgroundColor: iconData?.bg ?? 'rgba(99,102,241,0.08)',
                      }}
                    >
                      {skill.level}%
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: index * 0.04 }}
                        className={`h-full rounded-full bg-gradient-to-r ${catStyle.bar}`}
                      />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-slate-600" />
                        <span>{skill.yearsOfExp} yrs exp</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: iconData?.color ?? '#6366f1' }}
                        />
                        <span>Production Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {Object.entries(CATEGORY_COLORS).map(([cat, style]) => (
            <div key={cat} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <span className={`w-2 h-2 rounded-full ${style.dot}`} />
              {cat}
            </div>
          ))}
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          Proficiency range: <span className="text-indigo-400 font-semibold">60–80%</span> — realistic professional mastery
        </div>
      </div>
    </motion.div>
  );
}
