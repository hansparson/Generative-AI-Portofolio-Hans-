import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactSubmission } from '../types';
import { Database, Mail, User, Clock, RefreshCw, ChevronLeft, Inbox, Trash2, ArrowLeft } from 'lucide-react';
import WorkspaceHeader from './WorkspaceHeader';

interface MessagesAdminViewProps {
  onBack: () => void;
}

export default function MessagesAdminView({ onBack }: MessagesAdminViewProps) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) throw new Error('Failed to retrieve messages');
      const data = await res.json();
      // Sort newest first
      const sorted = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setSubmissions(sorted);
    } catch (err: any) {
      console.error('Error fetching admin messages:', err);
      setError('Could not connect to database log stream.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <motion.div
      id="messages-admin-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
        </button>
        <button
          onClick={fetchMessages}
          disabled={isLoading}
          className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-750 text-slate-400 hover:text-white transition-all disabled:opacity-50"
          title="Refresh Log"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <WorkspaceHeader
        title="Live Database Logs"
        subtitle="This screen displays contact inquiries fetched directly from data/messages.json on our server container."
      />

      <div className="space-y-4">
        {isLoading && submissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
            <span>Streaming data from Express backend...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-400 font-mono text-xs border border-dashed border-rose-500/20 rounded-xl bg-rose-500/5">
            {error}
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl space-y-3">
            <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
            <div>
              <p className="text-slate-400 text-sm font-sans">No records found in database.</p>
              <p className="text-xs text-slate-500 font-mono mt-1">Submit a message via the Contact Form first!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence mode="popLayout">
              {submissions.map((sub, idx) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-750 transition-all"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-slate-850">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                        <User className="w-3.5 h-3.5 text-indigo-400" /> {sub.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <Mail className="w-3.5 h-3.5 text-slate-500" /> {sub.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      <span>{new Date(sub.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                    {sub.message}
                  </p>

                  <div className="text-[9px] font-mono text-slate-500/80 flex items-center justify-between pt-2">
                    <span>RECORD ID: {sub.id}</span>
                    <span className="text-emerald-500 font-medium">Logged Persistent</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
