import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_CERTIFICATES, Certificate } from '../data/certificates';
import { Award, Calendar, ExternalLink, X, Eye, ShieldCheck, Trophy, Landmark } from 'lucide-react';
import WorkspaceHeader from './WorkspaceHeader';

interface CertificatesViewProps {
  customTitle?: string;
  customIntro?: string;
  highlightedItems?: string[];
}

export default function CertificatesView({
  customTitle,
  customIntro,
  highlightedItems = []
}: CertificatesViewProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'academic', 'work', 'competition', 'achievement'];

  const filteredCerts = INITIAL_CERTIFICATES.filter(cert => 
    activeFilter === 'All' || cert.category === activeFilter
  );

  const sortedCerts = [...filteredCerts].sort((a, b) => {
    const aH = highlightedItems.some(h => h.toLowerCase().includes(a.title.toLowerCase()));
    const bH = highlightedItems.some(h => h.toLowerCase().includes(b.title.toLowerCase()));
    if (aH && !bH) return -1;
    if (!aH && bH) return 1;
    return 0;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'academic': return <Landmark className="w-4 h-4 text-cyan-400" />;
      case 'work': return <ShieldCheck className="w-4 h-4 text-violet-400" />;
      case 'competition': return <Trophy className="w-4 h-4 text-amber-400" />;
      default: return <Award className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <motion.div
      id="certificates-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <WorkspaceHeader
        title={customTitle || "Official Credentials & Certifications"}
        subtitle={customIntro || "Software Copyrights (HAKI), national robotics achievements, training verify, and vendor specializations."}
        isCustomized={!!customTitle || !!customIntro}
      />

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900/60 rounded-xl border border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeFilter === cat
                ? 'bg-indigo-500 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {sortedCerts.map((cert) => {
            const isHighlighted = highlightedItems.some(h =>
              h.toLowerCase().includes(cert.title.toLowerCase()) ||
              h.toLowerCase().includes(cert.issuer.toLowerCase())
            );

            return (
              <motion.div
                key={cert.id}
                layoutId={`cert-${cert.id}`}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 transition-all relative group overflow-hidden ${
                  isHighlighted
                    ? 'bg-amber-500/[0.03] border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.05)]'
                    : 'bg-slate-900 border-slate-800/80 hover:border-slate-750'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      {getCategoryIcon(cert.category)}
                      {cert.category}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      {cert.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold font-display text-white group-hover:text-indigo-400 transition-colors leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[70%]">
                    Issued: {cert.issuer}
                  </span>
                  
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/20 text-[10px] font-semibold flex items-center gap-1 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Cert</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden p-5 space-y-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-all z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">
                  {selectedCert.category} Credential
                </span>
                <h3 className="text-lg font-bold font-display text-white pr-8">
                  {selectedCert.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Issued by {selectedCert.issuer} ({selectedCert.date})
                </p>
              </div>

              {/* Certificate Viewer Area */}
              <div className="w-full h-96 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden relative">
                {selectedCert.type === 'pdf' ? (
                  <iframe
                    src={`${selectedCert.file}#toolbar=0&navpanes=0`}
                    className="w-full h-full rounded-lg"
                    title={selectedCert.title}
                  />
                ) : (
                  <img
                    src={selectedCert.file}
                    alt={selectedCert.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 text-slate-400 hover:text-white border border-slate-850 hover:border-slate-800 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
