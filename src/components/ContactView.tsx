import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, RefreshCw, AlertCircle, Database, Mail, User, MessageSquare, Linkedin, Instagram, MessageCircle, ExternalLink, FileText, Download } from 'lucide-react';
import WorkspaceHeader from './WorkspaceHeader';
import InteractiveTiltCard from './InteractiveTiltCard';

interface ContactViewProps {
  customTitle?: string;
  customIntro?: string;
  onViewSubmissions?: () => void;
}

export default function ContactView({
  customTitle,
  customIntro,
  onViewSubmissions
}: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Server rejected the submission.');
      }
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setSubmitStatus('error');
      setErrorMessage('Network error connecting to Express server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      id="contact-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <WorkspaceHeader
        title={customTitle || "Initiate Collaboration"}
        subtitle={customIntro || "Have an inquiry, project, or full-time opportunity? Drop a secure message directly into my cloud logs."}
        isCustomized={!!customTitle || !!customIntro}
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Form Container */}
        <div className="md:col-span-3 p-6 rounded-2xl bg-slate-950/45 border border-slate-900/80 shadow-lg relative overflow-hidden backdrop-blur-md space-y-4">
          <div className="absolute inset-0 cyber-scanline opacity-5" />
          
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 relative z-10">[SECURE_DISPATCH::FORM]</h3>
          
          <AnimatePresence mode="wait">
            {submitStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 relative z-10"
              >
                <div className="inline-flex p-3 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white font-sans">Message Dispatched Successfully</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    [STATUS: PARSED_AND_LOGGED]
                  </p>
                </div>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="mt-2 text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-all uppercase tracking-wider"
                >
                  [SEND_ANOTHER_TRANSMISSION]
                </button>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 relative z-10"
              >
                {submitStatus === 'error' && (
                  <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-400 font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>ERR_DISPATCH_FAILED: {errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <User className="w-3 h-3 text-indigo-400" /> Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-900/50 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-850 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-indigo-400" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-slate-900/50 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-850 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3 text-indigo-400" /> Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your project scope or timeline..."
                    className="w-full bg-slate-900/50 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-850 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 font-sans"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email || !message}
                  className="w-full px-4 py-2.5 text-xs font-mono font-bold uppercase rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> [LOGGING_TRANSMISSION...]
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> [DISPATCH_TRANSMISSION]
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Database, Social Connections & Verification Log Column */}
        <div className="md:col-span-2 flex flex-col justify-between gap-4">
          
          {/* Direct channels card */}
          <InteractiveTiltCard glowColor="rgba(99, 102, 241, 0.15)" className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900/60 to-indigo-950/20 border border-slate-900/80 shadow-lg relative overflow-hidden backdrop-blur-md space-y-4">
            <div className="absolute inset-0 cyber-scanline opacity-5" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 relative z-10">[DIRECT_CONNECT]</h3>
            
            <div className="space-y-2.5 relative z-10">
              {[
                {
                  name: 'WhatsApp',
                  handle: '+62 812-8846-7764',
                  url: 'https://wa.me/6281288467764',
                  icon: <MessageCircle className="w-4 h-4" />,
                  colorClass: 'text-emerald-400 group-hover:text-emerald-300',
                  bgHoverClass: 'hover:bg-emerald-500/10 hover:border-emerald-500/30',
                  download: false
                },
                {
                  name: 'LinkedIn',
                  handle: 'Hans Parson',
                  url: 'https://www.linkedin.com/in/hans-parson/',
                  icon: <Linkedin className="w-4 h-4" />,
                  colorClass: 'text-indigo-400 group-hover:text-indigo-300',
                  bgHoverClass: 'hover:bg-indigo-500/10 hover:border-indigo-500/30',
                  download: false
                },
                {
                  name: 'Instagram',
                  handle: '@pukiskeju13',
                  url: 'https://www.instagram.com/pukiskeju13/',
                  icon: <Instagram className="w-4 h-4" />,
                  colorClass: 'text-pink-400 group-hover:text-pink-300',
                  bgHoverClass: 'hover:bg-pink-500/10 hover:border-pink-500/30',
                  download: false
                },
                {
                  name: 'Curriculum Vitae',
                  handle: 'Download PDF (28 KB)',
                  url: '/images/CV_Hans_Parson_Latest.pdf',
                  icon: <FileText className="w-4 h-4" />,
                  colorClass: 'text-amber-400 group-hover:text-amber-300',
                  bgHoverClass: 'hover:bg-amber-500/10 hover:border-amber-500/40 border-amber-500/20 bg-amber-500/5 shadow-md shadow-amber-500/5',
                  download: true
                }
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target={link.download ? undefined : "_blank"}
                  rel={link.download ? undefined : "noopener noreferrer"}
                  download={link.download ? "CV_Hans_Parson_Latest.pdf" : undefined}
                  className={`group p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 flex items-center justify-between text-xs transition-all ${link.bgHoverClass}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg bg-slate-950 border border-slate-900/60 transition-colors ${link.colorClass}`}>
                      {link.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-200 group-hover:text-white transition-colors text-xs">{link.name}</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">{link.handle}</p>
                    </div>
                  </div>
                  {link.download ? (
                    <Download className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-400 transition-colors shrink-0 animate-pulse" />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                  )}
                </a>
              ))}
            </div>
          </InteractiveTiltCard>

          {/* Database Logging Status */}
          <div className="p-5 rounded-2xl bg-slate-950/45 border border-slate-900/80 shadow-lg backdrop-blur-md space-y-4 flex-1 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 cyber-scanline opacity-5" />
            <div className="space-y-3 relative z-10">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-400" /> [LOGGING_PIPELINE]
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Submissions write dynamically to a file-persistent store (`data/messages.json`) on our Node Express backend container. 
              </p>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-900 text-[10px] text-slate-550 font-mono space-y-1">
                <div className="flex items-center justify-between">
                  <span>Database:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>File I/O Stream:</span>
                  <span className="text-emerald-400 font-semibold font-bold">Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Encryption:</span>
                  <span className="text-indigo-400">Node-Secure</span>
                </div>
              </div>
            </div>

            {onViewSubmissions && (
              <button
                onClick={onViewSubmissions}
                className="w-full mt-3 px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-350 hover:text-white font-mono text-[10px] text-center transition-all flex items-center justify-center gap-2 cursor-pointer relative z-10"
              >
                <span>[VIEW_LIVE_SUBMISSIONS_LOG]</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
