import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface WorkspaceHeaderProps {
  title: string;
  subtitle?: string;
  isCustomized?: boolean;
}

export default function WorkspaceHeader({ title, subtitle, isCustomized = false }: WorkspaceHeaderProps) {
  return (
    <div id="workspace-header" className="mb-6 pb-4 border-b border-slate-900 flex flex-col md:flex-row md:items-center md:justify-between gap-3 relative">
      <div className="space-y-1">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
            [WORKSPACE::DECK]
          </span>
          <h2 className="text-lg md:text-xl font-display font-extrabold tracking-tight text-white flex items-center gap-2">
            {title}
          </h2>
          {isCustomized && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
            >
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" /> [ADAPTIVE_VIEWPORT]
            </motion.span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs md:text-sm text-slate-400 font-sans leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-900 self-start md:self-center shadow-inner">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span>SYS_STATUS::READY</span>
      </div>
    </div>
  );
}
