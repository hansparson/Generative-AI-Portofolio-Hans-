import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_BLOG_POSTS, BlogPost } from '../data/blog';
import { BookOpen, Calendar, Clock, ArrowLeft, ArrowRight, Share2, Sparkles, BookMarked } from 'lucide-react';
import WorkspaceHeader from './WorkspaceHeader';

interface BlogViewProps {
  customTitle?: string;
  customIntro?: string;
  highlightedItems?: string[];
}

export default function BlogView({
  customTitle,
  customIntro,
  highlightedItems = []
}: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const sortedPosts = [...INITIAL_BLOG_POSTS].sort((a, b) => {
    const aH = highlightedItems.some(h => h.toLowerCase().includes(a.title.toLowerCase()));
    const bH = highlightedItems.some(h => h.toLowerCase().includes(b.title.toLowerCase()));
    if (aH && !bH) return -1;
    if (!aH && bH) return 1;
    return 0;
  });

  return (
    <motion.div
      id="blog-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col justify-between"
    >
      <AnimatePresence mode="wait">
        {!selectedPost ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <WorkspaceHeader
              title={customTitle || "Engineering Writing & Insights"}
              subtitle={customIntro || "Technical walkthroughs on machine learning scalper bots, Open API snap BI, and off-grid IoT telemetry."}
              isCustomized={!!customTitle || !!customIntro}
            />

            {/* Articles List */}
            <div className="space-y-4">
              {sortedPosts.map((post) => {
                const isHighlighted = highlightedItems.some(h =>
                  h.toLowerCase().includes(post.title.toLowerCase()) ||
                  post.tags.some(t => h.toLowerCase().includes(t.toLowerCase()))
                );

                return (
                  <div
                    key={post.id}
                    className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all hover:scale-[1.005] group ${
                      isHighlighted
                        ? 'bg-amber-500/[0.03] border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                        : 'bg-slate-900 border-slate-800/85 hover:border-slate-750'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 font-semibold">
                          {post.date}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                        {isHighlighted && (
                          <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
                            <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Focus
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold font-display text-white group-hover:text-indigo-400 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-850/60 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="text-[9px] font-mono text-slate-500">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedPost(post)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group/btn cursor-pointer"
                      >
                        <span>Read Post</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reader"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6"
          >
            {/* Header / Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Articles</span>
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {selectedPost.readTime}
                </span>
              </div>
            </div>

            {/* Title Block */}
            <div className="space-y-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-indigo-400 font-mono font-semibold">{selectedPost.date}</span>
                <span className="text-slate-600 font-mono">•</span>
                <span className="text-xs text-slate-500 font-mono">By Hans Parson</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight leading-tight">
                {selectedPost.title}
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {selectedPost.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Article Content Area */}
            <article 
              className="prose prose-invert max-w-none text-xs md:text-sm text-slate-300 leading-relaxed font-sans space-y-4"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            {/* End of article marker */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3 text-slate-500">
              <BookMarked className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-xs font-mono">You've finished reading. Ask the AI assistant if you have questions!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
