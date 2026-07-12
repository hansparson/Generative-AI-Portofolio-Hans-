import { motion } from 'motion/react';
import { INITIAL_VALUES } from '../data/portfolio';
import { Sparkles, Cpu, Shield, HelpCircle, Heart, Zap } from 'lucide-react';
import WorkspaceHeader from './WorkspaceHeader';

interface PhilosophyViewProps {
  customTitle?: string;
  customIntro?: string;
  highlightedItems?: string[];
}

export default function PhilosophyView({
  customTitle,
  customIntro,
  highlightedItems = []
}: PhilosophyViewProps) {

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-emerald-400" />;
      default: return <Heart className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <motion.div
      id="philosophy-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <WorkspaceHeader
        title={customTitle || "Engineering Principles"}
        subtitle={customIntro || "My architectural manifestos and core developer philosophies guiding client and model delivery."}
        isCustomized={!!customTitle || !!customIntro}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INITIAL_VALUES.map((val, idx) => {
          const isHighlighted = highlightedItems.some(h =>
            h.toLowerCase().includes(val.title.toLowerCase()) ||
            h.toLowerCase().includes(val.value.toLowerCase())
          );

          return (
            <motion.div
              key={val.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all md:col-span-1 ${
                idx === 1 ? 'md:col-span-1 bg-indigo-950/5' : ''
              } ${
                isHighlighted
                  ? 'bg-amber-500/[0.03] border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.04)]'
                  : 'bg-slate-900 border-slate-800/80 hover:border-slate-750'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    {getIcon(val.iconName)}
                  </div>
                  {isHighlighted && (
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/15">
                      Matched
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-display text-white tracking-tight">
                    {val.title}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {val.value}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-850/60">
                {val.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Philosophy Quote */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-850 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase text-indigo-400 tracking-wider">Thought on Generative UI</h4>
          <blockquote className="text-sm font-display font-medium text-white italic max-w-2xl leading-relaxed">
            "We are stepping into a future where user interfaces aren't statically coded templates, but liquid layouts that compose, expand, and structure themselves live based on real-time human intent."
          </blockquote>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400 shrink-0">
          <Zap className="w-5 h-5 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}
