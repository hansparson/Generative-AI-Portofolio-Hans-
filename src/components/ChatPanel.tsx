import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, RoleType, GenerativeUIResponse } from '../types';
import { SUGGESTED_PROMPTS } from '../data/portfolio';
import { Send, Sparkles, Terminal, ArrowRight, RefreshCw, Volume2, VolumeX } from 'lucide-react';

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

interface ChatPanelProps {
  onUpdateComponent: (component: string, props: any) => void;
  chatHistory: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onClearHistory: () => void;
  isWorkspaceVisible: boolean;
  onToggleWorkspace: () => void;
}

export default function ChatPanel({
  onUpdateComponent,
  chatHistory,
  onAddMessage,
  onClearHistory,
  isWorkspaceVisible,
  onToggleWorkspace
}: ChatPanelProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState('Parsing request...');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('chat_muted') === 'true');

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    localStorage.setItem('chat_muted', String(nextMute));
    window.dispatchEvent(new CustomEvent('mute-change', { detail: { isMuted: nextMute } }));
  };

  const loadingPhrases = [
    'Synthesizing prompt intent...',
    'Querrying Gemini 3.5 LLM context...',
    'Composing dynamic React props...',
    'Injecting metadata structures...',
    'Aligning interactive viewport...'
  ];

  // Rotate loading phrases when active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % loadingPhrases.length;
        setLoadingPhrase(loadingPhrases[idx]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onAddMessage(userMsg);
    setInputText('');
    setIsLoading(true);

    try {
      // Map previous chat messages for history
      const mappedHistory = chatHistory.slice(-6).map(h => ({
        role: h.role,
        text: h.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: mappedHistory
        }),
      });

      if (!res.ok) {
        throw new Error('API server failed');
      }

      const data: GenerativeUIResponse = await res.json();

      const assistantMsg: ChatMessage = {
        id: "ai_" + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        text: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activeComponent: data.activeComponent,
        componentProps: data.componentProps,
        avatarExpression: data.avatarExpression
      };

      if (isMuted) {
        onAddMessage(assistantMsg);
        onUpdateComponent(data.activeComponent, data.componentProps);
        setIsLoading(false);
      } else {
        setLoadingPhrase("Synthesizing voice response...");
        window.dispatchEvent(new CustomEvent('speak-text', {
          detail: {
            text: data.message,
            avatarExpression: data.avatarExpression,
            onStart: () => {
              onAddMessage(assistantMsg);
              onUpdateComponent(data.activeComponent, data.componentProps);
              setIsLoading(false);
            },
            onError: () => {
              onAddMessage(assistantMsg);
              onUpdateComponent(data.activeComponent, data.componentProps);
              setIsLoading(false);
            }
          }
        }));
      }

    } catch (err: any) {
      console.error('Chat submit error:', err);
      
      const errorMsg: ChatMessage = {
        id: "ai_err_" + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        text: "I ran into a connection failure with my Express server. Please verify that your dev server is active and check Settings > Secrets to confirm the GEMINI_API_KEY is configured.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onAddMessage(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div id="chat-panel" className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative shadow-2xl">
      {/* Panel Header */}
      <div className="px-4 py-3.5 border-b border-slate-850 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-4 h-4 animate-pulse text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xs font-semibold font-sans uppercase tracking-wider text-white">Alison - AI Co-Pilot</h3>
            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gemini Generative Engine</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleWorkspace}
            className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors flex items-center gap-1 hover:bg-slate-800/50 px-2 py-0.5 rounded border border-indigo-500/20 cursor-pointer"
            title={isWorkspaceVisible ? "Hide Information Panel" : "Show Information Panel"}
          >
            {isWorkspaceVisible ? "Hide Info" : "Show Info"}
          </button>
          <span className="text-slate-800">|</span>
          <button
            type="button"
            onClick={toggleMute}
            className="text-slate-500 hover:text-slate-300 transition-colors flex items-center p-1 rounded hover:bg-slate-800/50 cursor-pointer"
            title={isMuted ? "Unmute Voice Output" : "Mute Voice Output"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
          </button>
          <span className="text-slate-800">|</span>
          <button
            type="button"
            onClick={onClearHistory}
            className="text-[10px] font-mono text-slate-500 hover:text-slate-300 uppercase tracking-wider transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {chatHistory.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div
                key={msg.id}
                className="flex flex-col max-w-[85%] ml-auto items-end"
              >
                {/* User Message Bubble */}
                <div className="p-3.5 rounded-2xl text-xs leading-relaxed bg-indigo-500 text-white rounded-br-none shadow-md shadow-indigo-500/5">
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-600 font-mono mt-1 px-1">{msg.timestamp}</span>
              </div>
            );
          } else {
            // Assistant JRPG style dialog box
            const avatarUrl = getAvatarUrl(msg.avatarExpression || 'neutral');
            return (
              <div
                key={msg.id}
                className="w-full flex items-end gap-3 pt-6 pb-2"
              >
                {/* Character Portrait (stands on the left, completely outside the text box) */}
                <div className="w-32 h-40 shrink-0 flex items-end justify-center select-none pointer-events-none">
                  <img
                    src={avatarUrl}
                    alt="AI Portrait"
                    className="max-w-full max-h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] transform hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Text Dialogue Box (on the right) */}
                <div className="flex-1 min-w-0 relative">
                  {/* Name Tag */}
                  <div className="absolute left-4 -top-3.5 px-3 py-0.5 bg-amber-950 border border-amber-700/80 rounded shadow-md z-30">
                    <span className="text-[9px] font-bold font-mono tracking-wider text-amber-300 uppercase">
                      Alison
                    </span>
                  </div>

                  {/* Dialogue Bubble (Beige Parchment JRPG Theme) */}
                  <div className="w-full min-h-[72px] p-3.5 bg-[#fdf6e2] text-slate-900 border-2 border-amber-900 rounded-xl rounded-bl-none shadow-xl relative flex flex-col justify-center">
                    <p className="text-xs font-semibold leading-relaxed">
                      {msg.text.replace(/\[[a-zA-Z0-9_\s-]+\]/g, '').trim()}
                    </p>

                    {/* Blinking JRPG cursor indicator at the bottom-right */}
                    <div 
                      className="absolute bottom-2.5 right-3.5 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-amber-900 animate-bounce" 
                      style={{ animationDuration: '0.8s' }} 
                    />
                  </div>

                  {/* Generative confirmation feedback & timestamp */}
                  <div className="w-full flex items-center justify-between mt-1.5 px-1">
                    {msg.activeComponent ? (
                      <div className="flex items-center gap-1 text-[9px] font-mono text-indigo-400/90 font-medium tracking-wide">
                        <Terminal className="w-3 h-3 text-indigo-400 animate-pulse" />
                        <span>Viewport: {msg.activeComponent}</span>
                      </div>
                    ) : (
                      <div />
                    )}
                    <span className="text-[9px] text-slate-600 font-mono">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          }
        })}

        {/* Dynamic Loading Bubble */}
        {isLoading && (
          <div className="flex flex-col max-w-[85%] mr-auto items-start">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 text-slate-400 border border-slate-850/60 rounded-bl-none flex items-center gap-2.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span className="text-xs font-medium animate-pulse">{loadingPhrase}</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested chips panel */}
      {chatHistory.length <= 1 && !isLoading && (
        <div className="px-4 py-2 border-t border-slate-900 bg-slate-950/80 space-y-2">
          <h4 className="text-[9px] uppercase tracking-wider font-mono text-slate-500 font-bold">Suggested Prompt Integrations</h4>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-850 hover:border-slate-800 text-[11px] font-medium transition-all text-left flex items-center gap-1"
              >
                <span>{prompt}</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input panel */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3 bg-slate-900/50 border-t border-slate-850 flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Hans' AI about his projects, skills..."
          disabled={isLoading}
          className="flex-1 bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 hover:disabled:bg-slate-800 text-white rounded-xl transition-colors shrink-0 disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
