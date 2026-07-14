import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from './types';
import { Layers, Terminal, Sparkles, Layout, Mail, Briefcase, Award, Library, ArrowRight, BookOpen, Cpu, FileText, Download, Sun, Moon } from 'lucide-react';

// Subcomponents
import ChatPanel from './components/ChatPanel';
import HomeView from './components/HomeView';
import ProjectsView from './components/ProjectsView';
import SkillsView from './components/SkillsView';
import TimelineView from './components/TimelineView';
import PhilosophyView from './components/PhilosophyView';
import ContactView from './components/ContactView';
import MessagesAdminView from './components/MessagesAdminView';
import ProfileAvatar from './components/ProfileAvatar';
import CertificatesView from './components/CertificatesView';
import BlogView from './components/BlogView';
import SandboxView from './components/SandboxView';

const getAvatarUrl = (expression: string) => {
  switch (expression) {
    case 'happy':
      return '/images/avatar_expression/smile_greeting.png';
    case 'excited':
      return '/images/avatar_expression/exited.png';
    case 'thinking':
      return '/images/avatar_expression/thinking.png';
    case 'surprised':
      return '/images/avatar_expression/suprised.png';
    case 'explaining':
      return '/images/avatar_expression/explain.png';
    default:
      return '/images/avatar_expression/neutral.png';
  }
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('portfolio_theme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolio_theme', nextTheme);
  };

  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [isWorkspaceVisible, setIsWorkspaceVisible] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);
  // Generative state managed live
  const [activeView, setActiveView] = useState<string>('home');
  const [viewProps, setViewProps] = useState<any>({});
  const [currentExpression, setCurrentExpression] = useState<'neutral' | 'happy' | 'excited' | 'thinking' | 'surprised' | 'explaining'>('neutral');

  // Chat History
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Yo! What's up guys? I'm Alison, Hans' AI co-pilot. Wanna talk backend, IoT, or check out my dope full-stack projects? Ask me anything or tap any option above—watch the screen sync up in real-time. Super clean, right? Let's dive in!",
      avatarExpression: 'happy',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Record Visitor Session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('portfolio_visited');
    if (!hasVisited) {
      fetch('/api/visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAgent: navigator.userAgent }),
      })
        .then((res) => {
          if (res.ok) {
            sessionStorage.setItem('portfolio_visited', 'true');
          }
        })
        .catch((err) => console.error('Failed to log session visit:', err));
    }
  }, []);

  // Global TTS Speech Manager
  useEffect(() => {
    let isMuted = localStorage.getItem('chat_muted') === 'true';
    let activeAudio: HTMLAudioElement | null = null;

    const handleSpeak = async (e: any) => {
      if (isMuted) {
        if (e.detail.onError) e.detail.onError();
        return;
      }

      if (activeAudio) {
        activeAudio.pause();
        activeAudio = null;
      }
      
      const { text, onStart, onError } = e.detail;
      
      // Clean up text (remove emojis, code blocks, URLs for natural pronunciation)
      const cleanText = text
        .replace(/\[[a-zA-Z0-9_\s-]+\]/g, '') // Strip voice expression tags
        .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/```[\s\S]*?```/g, 'Code block output shown on screen.');

      // Check if it is the static welcome message to play the pre-recorded local file
      const isWelcomeMessage = cleanText.includes("Yo! What's up guys?") && cleanText.includes("I'm Alison");

      if (isWelcomeMessage) {
        try {
          activeAudio = new Audio('/audio/welcome.mp3');
          
          activeAudio.onplay = () => {
            window.dispatchEvent(new CustomEvent('speech-status', { detail: { isSpeaking: true } }));
            if (onStart) onStart();
          };
          
          activeAudio.onended = () => {
            window.dispatchEvent(new CustomEvent('speech-status', { detail: { isSpeaking: false } }));
          };
          
          activeAudio.onerror = () => {
            window.dispatchEvent(new CustomEvent('speech-status', { detail: { isSpeaking: false } }));
            if (onError) onError();
          };

          await activeAudio.play();
          return;
        } catch (err) {
          console.error("Failed to play local welcome audio, waiting for user interaction:", err);
          return;
        }
      }

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: cleanText }),
        });

        if (!response.ok) {
          throw new Error('TTS server failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        activeAudio = new Audio(url);
        
        activeAudio.onplay = () => {
          window.dispatchEvent(new CustomEvent('speech-status', { detail: { isSpeaking: true } }));
          if (onStart) onStart();
        };
        
        activeAudio.onended = () => {
          window.dispatchEvent(new CustomEvent('speech-status', { detail: { isSpeaking: false } }));
          URL.revokeObjectURL(url);
        };
        
        activeAudio.onerror = () => {
          window.dispatchEvent(new CustomEvent('speech-status', { detail: { isSpeaking: false } }));
          URL.revokeObjectURL(url);
          if (onError) onError();
        };

        await activeAudio.play();
      } catch (err) {
        console.error("ElevenLabs TTS playback failed, falling back to browser SpeechSynthesis:", err);
        // Fallback to browser TTS if ElevenLabs fails/is unconfigured
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = 'en-US';
          
          utterance.onstart = () => {
            window.dispatchEvent(new CustomEvent('speech-status', { detail: { isSpeaking: true } }));
            if (onStart) onStart();
          };
          utterance.onend = () => {
            window.dispatchEvent(new CustomEvent('speech-status', { detail: { isSpeaking: false } }));
          };
          utterance.onerror = () => {
            window.dispatchEvent(new CustomEvent('speech-status', { detail: { isSpeaking: false } }));
            if (onError) onError();
          };
          
          window.speechSynthesis.speak(utterance);
        } else {
          if (onError) onError();
        }
      }
    };

    const handleMuteChange = (e: any) => {
      isMuted = e.detail.isMuted;
      if (isMuted) {
        if (activeAudio) {
          activeAudio.pause();
          activeAudio = null;
        }
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        window.dispatchEvent(new CustomEvent('speech-status', { detail: { isSpeaking: false } }));
      }
    };

    window.addEventListener('speak-text', handleSpeak);
    window.addEventListener('mute-change', handleMuteChange);

    return () => {
      window.removeEventListener('speak-text', handleSpeak);
      window.removeEventListener('mute-change', handleMuteChange);
      if (activeAudio) {
        activeAudio.pause();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Play welcome audio on mount or on first user interaction if blocked by autoplay policy
  useEffect(() => {
    const isMuted = localStorage.getItem('chat_muted') === 'true';
    if (isMuted) return;

    const welcomeText = "Yo! What's up guys? I'm Alison, Hans' AI co-pilot. Wanna talk backend, IoT, or check out my dope full-stack projects? Ask me anything or tap any option above—watch the screen sync up in real-time. Super clean, right? Let's dive in!";

    let welcomeAudioPlayed = false;

    const playWelcome = () => {
      if (welcomeAudioPlayed) return;
      welcomeAudioPlayed = true;

      window.dispatchEvent(new CustomEvent('speak-text', {
        detail: {
          text: welcomeText,
          avatarExpression: 'neutral'
        }
      }));

      document.removeEventListener('click', playWelcome);
      document.removeEventListener('touchstart', playWelcome);
    };

    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('speak-text', {
        detail: {
          text: welcomeText,
          avatarExpression: 'neutral',
          onStart: () => {
            welcomeAudioPlayed = true;
            document.removeEventListener('click', playWelcome);
            document.removeEventListener('touchstart', playWelcome);
          }
        }
      }));
    }, 1000);

    document.addEventListener('click', playWelcome);
    document.addEventListener('touchstart', playWelcome);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', playWelcome);
      document.removeEventListener('touchstart', playWelcome);
    };
  }, []);

  const handleUpdateComponent = (component: string, props: any) => {
    setActiveView(component);
    setViewProps(props || {});
    // Auto-reveal workspace panel when AI routes a view
    setIsWorkspaceVisible(true);
  };

  const handleAddMessage = (msg: ChatMessage) => {
    setChatHistory(prev => [...prev, msg]);
    if (msg.role === 'assistant' && msg.avatarExpression) {
      setCurrentExpression(msg.avatarExpression);
    }
  };

  const handleClearHistory = () => {
    setChatHistory([
      {
        id: 'welcome',
        role: 'assistant',
        text: "Session reset. I am ready to adapt. What would you like to explore regarding my systems experience?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveView('home');
    setViewProps({});
    setCurrentExpression('neutral');
  };

  // Render the current visual component based on state
  const renderWorkspaceComponent = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeView
            customTitle={viewProps.customTitle}
            customIntro={viewProps.customIntro}
            highlightedItems={viewProps.highlightedItems}
            onNavigate={(view) => {
              setActiveView(view);
              setViewProps({});
            }}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            customTitle={viewProps.customTitle}
            customIntro={viewProps.customIntro}
            highlightedItems={viewProps.highlightedItems}
            filterCategory={viewProps.filterCategory}
          />
        );
      case 'skills':
        return (
          <SkillsView
            customTitle={viewProps.customTitle}
            customIntro={viewProps.customIntro}
            highlightedItems={viewProps.highlightedItems}
            filterCategory={viewProps.filterCategory}
          />
        );
      case 'timeline':
        return (
          <TimelineView
            customTitle={viewProps.customTitle}
            customIntro={viewProps.customIntro}
            highlightedItems={viewProps.highlightedItems}
          />
        );
      case 'certificates':
        return (
          <CertificatesView
            customTitle={viewProps.customTitle}
            customIntro={viewProps.customIntro}
            highlightedItems={viewProps.highlightedItems}
          />
        );
      case 'blog':
        return (
          <BlogView
            customTitle={viewProps.customTitle}
            customIntro={viewProps.customIntro}
            highlightedItems={viewProps.highlightedItems}
          />
        );
      case 'sandbox':
        return (
          <SandboxView
            customTitle={viewProps.customTitle}
            customIntro={viewProps.customIntro}
          />
        );
      case 'philosophy':
        return (
          <PhilosophyView
            customTitle={viewProps.customTitle}
            customIntro={viewProps.customIntro}
            highlightedItems={viewProps.highlightedItems}
          />
        );
      case 'contact':
        return (
          <ContactView
            customTitle={viewProps.customTitle}
            customIntro={viewProps.customIntro}
            onViewSubmissions={() => setActiveView('messages-admin')}
          />
        );
      case 'messages-admin':
        return <MessagesAdminView onBack={() => setActiveView('contact')} />;
      default:
        return (
          <HomeView
            onNavigate={(view) => {
              setActiveView(view);
              setViewProps({});
            }}
          />
        );
    }
  };

  const navItems = [
    { id: 'home', label: 'Intro', icon: <Layout className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Projects', icon: <Library className="w-3.5 h-3.5" /> },
    { id: 'skills', label: 'Skills', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'timeline', label: 'Journey', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'certificates', label: 'Credentials', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'blog', label: 'Blog', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'sandbox', label: 'Sandbox', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'philosophy', label: 'Philosophy', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-3.5 h-3.5" /> }
  ];

  if (showLanding) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans antialiased relative overflow-hidden"
        >
          {/* Cyber grid meshes and animated scanlines */}
          <div className="absolute inset-0 mesh-grid opacity-40 pointer-events-none" />
          <div className="absolute inset-0 cyber-scanline opacity-10 pointer-events-none" />
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] -z-10" />

          {/* Landing Header */}
          <header className="px-4 md:px-6 py-4 flex items-center justify-between border-b border-slate-900/60 bg-slate-950/40 backdrop-blur-md z-30">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/profile_picture.jpg"
                alt="Hans Parson"
                className="w-8 h-8 rounded-full object-cover border border-slate-800/80 shadow-md shadow-indigo-500/5 shrink-0"
              />
              <div>
                <h1 className="text-xs font-bold text-white uppercase tracking-wider leading-none font-display">Hans Parson</h1>
                <p className="text-[9px] text-slate-500 font-mono mt-0.5 hidden sm:block">SYSTEMS ARCHITECT & IOT ENGINEER</p>
              </div>
            </div>
            <button
              onClick={() => setShowLanding(false)}
              className="text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
            >
              [SKIP_PORTAL]
            </button>
          </header>

          {/* Hero Section Container */}
          <div className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 relative z-20">

            {/* Left Column: Greeting Text & Dialogue Bubble */}
            <div className="flex-1 space-y-6 md:space-y-8 max-w-xl w-full">
              <div className="space-y-3 md:space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] md:text-xs font-mono border border-indigo-500/20 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                  AI CO-PILOT SYSTEM :: CONNECTED
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                  Initiate Portal with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
                    Alison Co-Pilot
                  </span>
                </h2>
              </div>

              {/* JRPG Dialogue bubble redesigned as Sci-Fi HUD container */}
              <div className="relative p-5 rounded-2xl bg-slate-950/60 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] flex flex-col justify-between backdrop-blur-md">
                <div className="absolute left-4 -top-3 px-3 py-0.5 bg-indigo-950 border border-indigo-500/50 rounded shadow-md z-30">
                  <span className="text-[9px] font-bold font-mono tracking-wider text-indigo-300 uppercase">Alison [V_2.5]</span>
                </div>
                <p className="text-xs md:text-sm font-sans leading-relaxed text-indigo-100 font-medium pt-2">
                  "Yo! What's up! I'm Alison, Hans' AI co-pilot. I can simulate live IoT telemetry, index professional skills, and search full-stack project archives. Click below to activate the telemetry deck!"
                </p>
                <div className="self-end mt-3 flex items-center gap-1">
                  <span className="text-[8px] font-mono text-indigo-400 uppercase">AWAITING_TRIGGER</span>
                  <span className="inline-block w-2 h-2 bg-indigo-400 rotate-45 animate-pulse"></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => { setShowLanding(false); setIsWorkspaceVisible(true); setIsChatOpen(true); }}
                  className="flex-1 sm:flex-none px-6 py-3 text-xs font-mono font-bold uppercase rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer border border-cyan-400/30"
                >
                  [ACTIVATE_CO_PILOT_DECK]
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => { setShowLanding(false); setIsWorkspaceVisible(false); }}
                  className="flex-1 sm:flex-none px-6 py-3 text-xs font-mono font-bold uppercase rounded-xl bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white transition-all cursor-pointer text-center"
                >
                  [SECURE_CHAT_ONLY]
                </button>
              </div>
            </div>

            {/* Right Column: High-tech capsule portal container - made responsive for mobile/tablet */}
            <div className="flex w-full max-w-[20rem] sm:max-w-[24rem] lg:w-[26rem] h-80 sm:h-96 lg:h-[30rem] shrink-0 items-center justify-center select-none relative bg-slate-950/20 border border-indigo-500/10 rounded-3xl p-4 lg:p-6 overflow-hidden mx-auto">
              <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
              
              {/* Rotating radar grids */}
              <div className="absolute w-[90%] aspect-square rounded-full border border-indigo-500/10 animate-slow-spin flex items-center justify-center">
                <div className="w-[80%] aspect-square rounded-full border border-indigo-500/20 flex items-center justify-center">
                  <div className="w-[70%] aspect-square rounded-full border border-indigo-500/30 border-dashed" />
                </div>
              </div>
              
              {/* Vertical / Horizontal target hair crosshairs */}
              <div className="absolute w-full h-[1px] bg-indigo-500/10" />
              <div className="absolute h-full w-[1px] bg-indigo-500/10" />

              {/* Glowing Holographic core card */}
              <div className="w-48 h-64 sm:w-60 sm:h-80 lg:w-72 lg:h-96 relative flex items-end justify-center rounded-2xl border border-indigo-500/25 bg-slate-950/80 shadow-[0_0_35px_rgba(99,102,241,0.2)] overflow-hidden">
                <div className="absolute inset-0 cyber-scanline opacity-10" />
                <div className="laser-scanner-line" />
                <img
                  src="/images/avatar_expression/smile_greeting.png"
                  alt="Alison Greeting"
                  className="w-[85%] h-[85%] object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.25)] relative z-10 animate-float"
                />
                
                {/* HUD telemetry readouts on core */}
                <div className="absolute top-3 left-3 flex flex-col font-mono text-[8px] text-indigo-400/80 space-y-0.5">
                  <span>CAPSULE_SYS: IDLE</span>
                  <span>AI_EXPR: HAPPY</span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 font-mono text-[8px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <footer className="px-4 md:px-6 py-4 border-t border-slate-900/60 bg-slate-950/40 text-center text-[9px] text-slate-500 font-mono z-30">
            [SYS_INTEGRITY::OK] © {new Date().getFullYear()} HANS PARSON. PORTAL AGENT V2.5.
          </footer>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div id="app-root" className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 antialiased transition-colors duration-300 relative overflow-hidden ${theme === 'light' ? 'light-theme bg-slate-950 text-slate-100' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* Dynamic background mesh grids & scanlines */}
      <div className="absolute inset-0 mesh-grid z-0 opacity-40 pointer-events-none" />
      <div className="absolute inset-0 cyber-scanline opacity-[0.03] z-0 pointer-events-none" />
      
      {/* Background Cybernetic Glow Blobs */}
      <div className="absolute top-[20%] left-[10%] w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[40rem] h-[40rem] bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Professional Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-3 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 relative">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {/* Profile Photo Avatar */}
          <div className="relative shrink-0">
            <ProfileAvatar className="w-8 h-8 md:w-10 md:h-10" expression={currentExpression} />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
              <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-xs md:text-sm font-display font-bold tracking-tight text-white leading-none truncate">
              Hans Parson
            </h1>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 hidden sm:block truncate">Backend & IoT Engineer</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/25 rounded-xl border border-slate-900/60 relative">
          {navItems.map((item) => {
            const isActive = activeView === item.id || (activeView === 'messages-admin' && item.id === 'contact');
            return (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id); setViewProps({}); setIsWorkspaceVisible(true); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative z-10 ${
                  isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-slate-900/80 rounded-lg -z-10 border border-slate-800 shadow-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Online status & CV Download */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer flex items-center justify-center shrink-0"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>
          <a
            href="/images/CV_Hans_Parson_Latest.pdf"
            download="CV_Hans_Parson_Latest.pdf"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 transition-all cursor-pointer shadow-md shadow-amber-500/5"
            title="Download CV (PDF)"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Download CV</span>
          </a>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden sm:inline text-[10px] font-mono text-emerald-400">Online</span>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-sm">
        <div className="flex overflow-x-auto scrollbar-none px-2 py-2 gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setViewProps({}); setIsWorkspaceVisible(true); }}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold shrink-0 transition-all ${
                activeView === item.id || (activeView === 'messages-admin' && item.id === 'contact')
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="[&>svg]:w-4 [&>svg]:h-4">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Split Stage Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 md:p-6 pb-28 relative z-10">

        {/* Chat-only mode */}
        {!isWorkspaceVisible && (
          <div className="flex justify-center items-start pt-6">
            <div className="w-full max-w-2xl h-[calc(100vh-160px)] min-h-[400px] max-h-[750px] flex flex-col shadow-2xl rounded-2xl overflow-hidden">
              <ChatPanel
                onUpdateComponent={handleUpdateComponent}
                chatHistory={chatHistory}
                onAddMessage={handleAddMessage}
                onClearHistory={handleClearHistory}
                isWorkspaceVisible={isWorkspaceVisible}
                onToggleWorkspace={() => setIsWorkspaceVisible(!isWorkspaceVisible)}
              />
            </div>
          </div>
        )}

        {/* Full-width Workspace Panel mode */}
        {isWorkspaceVisible && (
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full min-h-[500px]"
            >
              <AnimatePresence mode="wait">
                <div key={activeView}>
                  {renderWorkspaceComponent()}
                </div>
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </main>

      {/* Mobile/Tablet Backdrop Overlay (Hides on Desktop 'lg' and up) */}
      {isWorkspaceVisible && isChatOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] z-40 lg:hidden pointer-events-auto cursor-pointer"
          onClick={() => setIsChatOpen(false)}
          title="Minimize Chat"
        />
      )}

      {/* Floating Collapsible Chat Panel Widget */}
      {isWorkspaceVisible && (
        <AnimatePresence>
          {isChatOpen ? (
            /* Responsive wrapper: Centered Modal on Mobile/Tablet, Floating Sidebar on Desktop */
            <div className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] lg:left-auto lg:translate-x-0 lg:right-8 lg:top-[50%] lg:-translate-y-[50%] z-50 flex flex-col items-center gap-4 pointer-events-none transition-all duration-300">
              
              {/* Holographic Floating Companion (No Card borders/bg, large image on top) */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="hidden md:flex flex-col items-center justify-center w-[200px] h-[220px] relative pointer-events-auto select-none"
              >
                {/* Scrolling scanner line over transparent hologram */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
                  <div className="laser-scanner-line" />
                </div>

                {/* Pulsing circular holographic core */}
                <div className="absolute w-[80%] aspect-square rounded-full border border-indigo-500/5 animate-slow-spin flex items-center justify-center pointer-events-none z-0">
                  <div className="w-[80%] aspect-square rounded-full border border-indigo-500/10 border-dashed" />
                </div>

                {/* Animated Avatar Portrait */}
                <motion.img
                  key={currentExpression}
                  initial={{ scale: 0.92, opacity: 0.8, y: 15 }}
                  animate={{ scale: 1.15, opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  src={getAvatarUrl(currentExpression)}
                  alt="AI Hologram"
                  className="max-w-full max-h-[90%] object-contain drop-shadow-[0_0_35px_rgba(99,102,241,0.5)] relative z-10 animate-float"
                />

                {/* Minimal HUD state readout */}
                <div className="absolute bottom-[-10px] px-2.5 py-0.5 bg-indigo-950/40 border border-indigo-500/20 rounded text-[7px] font-mono text-indigo-400 uppercase tracking-widest backdrop-blur-sm shadow-md">
                  HOLOGRAM_AGENT::{currentExpression.toUpperCase()}
                </div>
              </motion.div>

              {/* Chat Panel Box (Bottom) */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-[370px] h-[480px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-120px)] md:max-h-[calc(100vh-260px)] flex flex-col shadow-2xl rounded-2xl overflow-hidden pointer-events-auto"
              >
                <ChatPanel
                  onUpdateComponent={handleUpdateComponent}
                  chatHistory={chatHistory}
                  onAddMessage={handleAddMessage}
                  onClearHistory={handleClearHistory}
                  isWorkspaceVisible={isChatOpen}
                  onToggleWorkspace={() => setIsChatOpen(false)}
                />
              </motion.div>
            </div>
          ) : (
            /* Miniature Floating Action Button (FAB) */
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 z-50 p-2 rounded-full bg-slate-950/90 border border-indigo-500/40 hover:border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all cursor-pointer flex items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full border border-indigo-500/30 bg-slate-900/60 flex items-center justify-center overflow-hidden relative shrink-0">
                <img
                  src={getAvatarUrl(currentExpression)}
                  alt="Alison Portrait"
                  className="max-w-[85%] max-h-[85%] object-contain animate-float"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                  <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
                </div>
              </div>
              <div className="pr-3 text-left">
                <span className="text-[8px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">AI CO-PILOT</span>
                <span className="text-[10px] font-mono text-slate-300 font-semibold group-hover:text-indigo-300 transition-colors uppercase">[TALK_TO_ALISON]</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-slate-950 py-3 px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between text-[10px] md:text-[11px] text-slate-600 font-mono gap-2">
        <span>© {new Date().getFullYear()} Hans Parson. All rights reserved.</span>
        <div className="hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-400" /> Generative UI</span>
          <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-amber-500" /> Live Server</span>
        </div>
      </footer>
    </div>
  );
}
