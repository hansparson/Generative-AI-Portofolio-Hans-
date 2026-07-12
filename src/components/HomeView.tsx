import React from 'react';
import { motion } from 'motion/react';
import { INITIAL_SKILLS, INITIAL_PROJECTS } from '../data/portfolio';
import { Cpu, Code2, MapPin, Sparkles, Terminal, Mail, FileText, ArrowRight } from 'lucide-react';
import WorkspaceHeader from './WorkspaceHeader';
import InteractiveTiltCard from './InteractiveTiltCard';
import TelemetryConsole from './TelemetryConsole';
import ProfileAvatar from './ProfileAvatar';

interface HomeViewProps {
  customTitle?: string;
  customIntro?: string;
  highlightedItems?: string[];
  onNavigate: (view: 'projects' | 'skills' | 'timeline' | 'contact' | 'philosophy') => void;
}

export default function HomeView({ customTitle, customIntro, highlightedItems = [], onNavigate }: HomeViewProps) {
  const featuredSkills = INITIAL_SKILLS.filter(s => s.level >= 92).slice(0, 5);
  const featuredProjects = INITIAL_PROJECTS.filter(p => p.featured);

  return (
    <motion.div
      id="home-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <WorkspaceHeader
        title={customTitle || "Software Engineer & IoT Specialist"}
        subtitle={customIntro || "Hi, I'm Hans Parson. I specialize in building high-availability backends, responsive cross-platform frontends, and real-time IoT architectures."}
        isCustomized={!!customTitle || !!customIntro}
      />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <InteractiveTiltCard 
          className="col-span-1 p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 border border-slate-800 flex flex-col justify-between relative overflow-hidden rounded-2xl h-full"
          glowColor="rgba(99, 102, 241, 0.15)"
        >
          <div className="space-y-4">
            <div className="relative w-20 h-20 mx-auto md:w-24 md:h-24 shrink-0">
              <ProfileAvatar className="w-full h-full" expression="neutral" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              </div>
            </div>
            
            <div className="text-center space-y-1 pt-2">
              <h3 className="text-base font-bold text-white font-display">Hans Parson</h3>
              <p className="text-xs text-slate-500 font-mono">Software Engineer</p>
              <p className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full inline-block mt-1 font-mono uppercase">
                IoT Specialist
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800/60 mt-4 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Jakarta, ID (UTC+7)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">hansparson013@gmail.com</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="w-full mt-4 py-2.5 text-xs font-semibold rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors flex items-center justify-center gap-1.5 group/btn cursor-pointer"
          >
            Get In Touch
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </InteractiveTiltCard>

        {/* About Specialty Card */}
        <InteractiveTiltCard 
          className="col-span-1 md:col-span-2 p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 border border-slate-800 flex flex-col justify-between relative overflow-hidden rounded-2xl h-full"
          glowColor="rgba(99, 102, 241, 0.15)"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono border border-indigo-500/20">
              <Terminal className="w-3.5 h-3.5" />
              <span>Available for collaborations</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white leading-tight pt-1">
              Designing interfaces where <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-400">code meets physical telemetry</span>.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              I build low-latency backends in Golang & Python, integrate secure payment platforms matching official financial protocols, and program low-level IoT microcontrollers connected to real-time full-duplex dashboard interfaces.
            </p>
          </div>
          
          <div className="flex items-center justify-end mt-6 pt-6 border-t border-slate-800/60">
            <button
              onClick={() => onNavigate('projects')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Explore Workspace
            </button>
          </div>
        </InteractiveTiltCard>

        {/* 3D Telemetry Interactive Console */}
        <TelemetryConsole />

        {/* Selected Featured Project Card */}
        <div className="col-span-1 md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs uppercase tracking-wider font-mono text-slate-500 font-semibold">Featured Work</h4>
              <button
                onClick={() => onNavigate('projects')}
                className="text-[10px] uppercase font-mono text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Show Workspace
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredProjects.slice(0, 2).map((project, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all h-full">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {project.category}
                      </span>
                    </div>
                    <h5 className="text-sm font-semibold font-display text-white">{project.title}</h5>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-900">
                    {project.tech.slice(0, 3).map((t, i) => (
                      <span key={i} className="text-[9px] font-mono text-slate-500">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>LLM-driven workspace adapts instantly to user questions.</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Generative Dynamic</span>
          </div>
        </div>

        {/* Skills Bento Block */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase tracking-wider font-mono text-slate-500 font-semibold">Core Stack Highlights</h4>
              <button
                onClick={() => onNavigate('skills')}
                className="text-[10px] uppercase font-mono text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {featuredSkills.map((skill, idx) => {
                const isHighlighted = highlightedItems.some(h => h.toLowerCase().includes(skill.name.toLowerCase()));
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                      isHighlighted
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-750 text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-medium font-sans">{skill.name}</span>
                    <span className="text-[10px] font-mono font-semibold opacity-80">{skill.level}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Specialized in building low-latency API layers and real-time streaming interfaces.
          </div>
        </div>

        {/* Hobbies, Games & Origin Bento Block */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase tracking-wider font-mono text-slate-500 font-semibold">Background & Hobbies</h4>
              <span className="text-[10px] uppercase font-mono text-indigo-400">Personal Info</span>
            </div>
            
            {/* Origin Row */}
            <div className="mb-4 p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <MapPin className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Origin / Asal</span>
                <p className="text-xs font-semibold text-white font-display">Mamasa, Sulawesi Barat</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Known for beautiful highlands & rich cultural heritage.</p>
              </div>
            </div>

            {/* Sports & Hobbies */}
            <div className="mb-4 space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Sports / Olahraga</span>
              <div className="flex flex-wrap gap-1.5">
                {['Volley', 'Sepak Takraw', 'Futsal'].map((sport, i) => (
                  <span key={i} className="text-[10px] font-sans px-2.5 py-1 rounded bg-slate-950/80 text-slate-300 border border-slate-800/80 hover:border-slate-700 transition-colors">
                    {sport}
                  </span>
                ))}
              </div>
            </div>

            {/* Games Grid */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 flex items-center justify-between">
                <span>Favorite Games</span>
                <span className="text-[9px] text-slate-600 font-normal">Hover to highlight</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Valorant', color: 'hover:border-[#FF4655]/40 hover:text-[#FF4655]', shadow: 'shadow-[#FF4655]/5' },
                  { name: 'Dota 2', color: 'hover:border-[#F55343]/40 hover:text-[#F55343]', shadow: 'shadow-[#F55343]/5' },
                  { name: 'CS2', color: 'hover:border-[#DE9B35]/40 hover:text-[#DE9B35]', shadow: 'shadow-[#DE9B35]/5' },
                  { name: 'Arc Raiders', color: 'hover:border-[#00F0FF]/40 hover:text-[#00F0FF]', shadow: 'shadow-[#00F0FF]/5' },
                  { name: 'Delta Force', color: 'hover:border-[#D4AF37]/40 hover:text-[#D4AF37]', shadow: 'shadow-[#D4AF37]/5' }
                ].map((game, i) => (
                  <div 
                    key={i} 
                    className={`p-2 rounded-lg bg-slate-950/90 border border-slate-850 text-slate-300 text-xs font-semibold font-display tracking-wide flex items-center justify-between shadow-sm transition-all duration-300 ${game.color} ${game.shadow} hover:shadow-md hover:scale-[1.02] cursor-default`}
                  >
                    <span>{game.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0 ml-1.5"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-850 flex items-center justify-between">
            <span>Competitive Gamer</span>
            <span>Active Team Player</span>
          </div>
        </div>

        {/* Philosophy Summary Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase tracking-wider font-mono text-slate-500 font-semibold">Engineering Values</h4>
              <button
                onClick={() => onNavigate('philosophy')}
                className="text-[10px] uppercase font-mono text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Read Philosophy
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-850 space-y-3">
              <p className="text-xs italic text-slate-300 font-serif leading-relaxed">
                "Write clean, self-documenting code. Build robust backends that scale, and bridge the physical and digital world with real-time telemetry."
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                <span className="text-[10px] text-slate-500 font-mono">Core Belief</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Focused on low latency, security, and clean API design.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
