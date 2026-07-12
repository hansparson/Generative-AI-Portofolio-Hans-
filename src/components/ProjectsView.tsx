import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_PROJECTS } from '../data/portfolio';
import { Project } from '../types';
import { Github, ExternalLink, Code2, Sparkles, Search, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import WorkspaceHeader from './WorkspaceHeader';

interface ProjectsViewProps {
  customTitle?: string;
  customIntro?: string;
  highlightedItems?: string[];
  filterCategory?: string;
}

export default function ProjectsView({
  customTitle,
  customIntro,
  highlightedItems = [],
  filterCategory
}: ProjectsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sync with Gemini's suggested filter category if provided
  useEffect(() => {
    if (filterCategory) {
      setSelectedCategory(filterCategory);
    }
  }, [filterCategory]);

  const categories = ['All', 'Full-Stack', 'Generative AI', 'Cloud / DevOps', 'Creative Tech'];

  const filteredProjects = INITIAL_PROJECTS.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort filtered projects so that any project matching Gemini's highlightedItems is placed first
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aIsHighlighted = highlightedItems.some(h => h.toLowerCase().includes(a.title.toLowerCase()));
    const bIsHighlighted = highlightedItems.some(h => h.toLowerCase().includes(b.title.toLowerCase()));
    if (aIsHighlighted && !bIsHighlighted) return -1;
    if (!aIsHighlighted && bIsHighlighted) return 1;
    return 0;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      id="projects-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <WorkspaceHeader
        title={customTitle || "Selected Engineering Work"}
        subtitle={customIntro || "A curated showcase of real-world deployments, design systems, and generative AI research."}
        isCustomized={!!customTitle || !!customIntro}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-500 text-white font-semibold shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-white text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {sortedProjects.map((project) => {
            const isHighlighted = highlightedItems.some(h =>
              h.toLowerCase().includes(project.title.toLowerCase()) ||
              project.tech.some(t => h.toLowerCase().includes(t.toLowerCase()))
            );
            const isExpanded = expandedId === project.id;

            return (
              <motion.div
                key={project.id}
                layoutId={`project-card-${project.id}`}
                className={`p-5 rounded-xl border transition-all ${
                  isHighlighted
                    ? 'bg-amber-500/[0.03] border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                    : 'bg-slate-900 border-slate-800/80 hover:border-slate-750'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-400 border border-slate-800 font-semibold">
                        {project.category}
                      </span>
                      {isHighlighted && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> AI Recommended
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-display font-bold text-white tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700 transition-all"
                        title="GitHub Code"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700 transition-all"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Image */}
                {project.image && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-slate-800/80 bg-slate-950 flex items-center justify-center">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full max-h-52 object-contain opacity-90 hover:opacity-100 transition-opacity"
                    />
                  </div>
                )}

                {/* Tech Badges */}

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.tech.map((t, idx) => {
                    const isTechHighlighted = highlightedItems.some(h => h.toLowerCase().includes(t.toLowerCase()));
                    return (
                      <span
                        key={idx}
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md border ${
                          isTechHighlighted
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/35 font-semibold'
                            : 'bg-slate-950/60 text-slate-400 border-slate-850'
                        }`}
                      >
                        {t}
                      </span>
                    );
                  })}
                </div>

                {/* Expand Toggle */}
                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(project.id)}
                    className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" /> Hide Metrics & Impact
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" /> View Metrics & Impact
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Unit Verified Production Ready</span>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-3">
                        {/* Screenshots Gallery */}
                        {project.screenshots && project.screenshots.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-400 mb-2">
                              UI Screenshots ({project.screenshots.length})
                            </h4>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                              {project.screenshots.map((src, i) => (
                                <a key={i} href={src} target="_blank" rel="noreferrer" className="shrink-0 bg-slate-900 rounded-lg border border-slate-700 hover:border-indigo-500 transition-all hover:scale-[1.02] flex items-center justify-center overflow-hidden">
                                  <img
                                    src={src}
                                    alt={`${project.title} screenshot ${i + 1}`}
                                    className="h-36 w-auto max-w-[200px] object-contain"
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Impact */}
                        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
                          <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-400 mb-1.5">Business & Operational Impact</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {project.impact || "Successfully integrated into main branch operations, improving pipeline speeds and resource delivery."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {sortedProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center border border-dashed border-slate-800 rounded-xl"
            >
              <p className="text-slate-400 text-sm">No engineering projects matched your query.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Clear filters & retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
