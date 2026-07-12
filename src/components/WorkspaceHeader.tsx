import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface WorkspaceHeaderProps {
  title: string;
  subtitle?: string;
  isCustomized?: boolean;
}

export default function WorkspaceHeader({ title, subtitle, isCustomized = false }: WorkspaceHeaderProps) {
  return (
    <div id="workspace-header" className="mb-6 pb-4 border-b border-gray-100/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-white flex items-center gap-2">
            {title}
          </h2>
          {isCustomized && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20"
            >
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> Generative Adapt
            </motion.span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-1 font-sans">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>Hans' Workspace</span>
      </div>
    </div>
  );
}
