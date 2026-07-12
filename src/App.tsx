import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from './types';
import { Layers, Terminal, Sparkles, Layout, Mail, Briefcase, Award, Library, ArrowRight, BookOpen, Cpu } from 'lucide-react';

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

export default function App() {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [isWorkspaceVisible, setIsWorkspaceVisible] = useState<boolean>(true);
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
          className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans antialiased relative overflow-hidden"
        >
          {/* Decorative background gradients */}
          <div className="absolute top-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-emerald-600/5 rounded-full blur-3xl -z-10" />

          {/* Landing Header */}
          <header className="px-4 md:px-6 py-4 flex items-center justify-between border-b border-slate-900/40 bg-slate-950/20 backdrop-blur-sm z-30">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/profile_picture.jpg"
                alt="Hans Parson"
                className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0"
              />
              <div>
                <h1 className="text-xs font-bold text-white uppercase tracking-wider leading-none">Hans Parson</h1>
                <p className="text-[9px] text-slate-500 font-mono mt-0.5 hidden sm:block">Software Engineer & IoT Specialist</p>
              </div>
            </div>
            <button
              onClick={() => setShowLanding(false)}
              className="text-xs font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
            >
              Skip
            </button>
          </header>

          {/* Hero Section Container */}
          <div className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 relative z-20">

            {/* Left Column: Greeting Text & Dialogue Bubble */}
            <div className="flex-1 space-y-5 md:space-y-8 max-w-xl w-full">
              <div className="space-y-3 md:space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] md:text-xs font-mono border border-indigo-500/20 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 animate-pulse text-indigo-400" />
                  AI-Powered Portfolio
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                  I'm Alison,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
                    Hans' AI Co-Pilot
                  </span>
                </h2>
              </div>

              {/* JRPG Dialogue bubble */}
              <div className="relative p-4 md:p-5 rounded-2xl bg-[#fdf6e2] border-2 border-amber-900 shadow-xl flex flex-col justify-between">
                <div className="absolute left-4 -top-3.5 px-3 py-0.5 bg-amber-950 border border-amber-700/80 rounded shadow-md z-30">
                  <span className="text-[9px] font-bold font-mono tracking-wider text-amber-300 uppercase">Alison</span>
                </div>
                <p className="text-xs md:text-sm font-sans leading-relaxed text-amber-950 font-medium pt-2">
                  "Yo! What's up! I'm Alison, Hans' AI co-pilot. Wanna talk backend, IoT, or check out his projects? Ask me anything or tap below!"
                </p>
                <div className="self-end mt-2">
                  <span className="inline-block w-2.5 h-2 bg-amber-900 rotate-45 animate-bounce"></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => { setShowLanding(false); setIsWorkspaceVisible(true); }}
                  className="flex-1 sm:flex-none px-5 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Enter Portfolio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => { setShowLanding(false); setIsWorkspaceVisible(false); }}
                  className="flex-1 sm:flex-none px-5 py-3 text-sm font-semibold rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer text-center"
                >
                  Let's Chat First
                </button>
              </div>
            </div>

            {/* Right Column: Character Portrait — hidden on small mobile */}
            <div className="hidden sm:flex w-56 h-72 md:w-80 md:h-[30rem] lg:w-[26rem] shrink-0 items-end justify-center select-none pointer-events-none relative">
              <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
              <img
                src="/images/avatar_expression/smile_greeting.png"
                alt="Alison Greeting"
                className="max-w-full max-h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>

          {/* Footer info */}
          <footer className="px-4 md:px-6 py-4 border-t border-slate-900/40 bg-slate-950/20 text-center text-[10px] md:text-xs text-slate-500 font-mono z-30">
            © {new Date().getFullYear()} Hans Parson. Powered by Alison.
          </footer>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div id="app-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 antialiased">
      
      {/* Top Professional Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-3 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
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
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/40 rounded-xl border border-slate-800">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setViewProps({}); setIsWorkspaceVisible(true); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeView === item.id || (activeView === 'messages-admin' && item.id === 'contact')
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Online status — icon only on mobile */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="hidden sm:inline text-[10px] font-mono text-emerald-400">Online</span>
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6">

        {/* Chat-only mode */}
        {!isWorkspaceVisible && (
          <div className="flex justify-center items-start pt-3">
            <div className="w-full max-w-2xl h-[calc(100vh-160px)] min-h-[400px] max-h-[750px] flex flex-col">
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

        {/* Split-screen mode */}
        {isWorkspaceVisible && (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-6 items-start">

            {/* Chat Panel */}
            <div className="w-full lg:col-span-5 lg:sticky lg:top-[72px] h-[380px] sm:h-[440px] lg:h-[calc(100vh-130px)] lg:max-h-[750px] flex flex-col">
              <ChatPanel
                onUpdateComponent={handleUpdateComponent}
                chatHistory={chatHistory}
                onAddMessage={handleAddMessage}
                onClearHistory={handleClearHistory}
                isWorkspaceVisible={isWorkspaceVisible}
                onToggleWorkspace={() => setIsWorkspaceVisible(!isWorkspaceVisible)}
              />
            </div>

            {/* Workspace Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full lg:col-span-7 p-3 md:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl min-h-[300px] overflow-y-auto"
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
