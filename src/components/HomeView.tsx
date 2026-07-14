import React from 'react';
import { motion } from 'motion/react';
import { INITIAL_SKILLS, INITIAL_PROJECTS } from '../data/portfolio';
import { Cpu, MapPin, Sparkles, Terminal, Mail, FileText, ArrowRight, Download, Radio, Shield, HelpCircle } from 'lucide-react';
import WorkspaceHeader from './WorkspaceHeader';
import InteractiveTiltCard from './InteractiveTiltCard';
import TelemetryConsole from './TelemetryConsole';
import ProfileAvatar from './ProfileAvatar';
import VisitorConsole from './VisitorConsole';

interface HomeViewProps {
  customTitle?: string;
  customIntro?: string;
  highlightedItems?: string[];
  onNavigate: (view: 'projects' | 'skills' | 'timeline' | 'contact' | 'philosophy') => void;
}

export default function HomeView({ customTitle, customIntro, highlightedItems = [], onNavigate }: HomeViewProps) {
  const featuredSkills = [...INITIAL_SKILLS]
    .sort((a, b) => b.level - a.level)
    .slice(0, 5);
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
        title={customTitle || "Systems Architect & IoT Engineer"}
        subtitle={customIntro || "Full-stack developer bridging high-performance backend pipelines and low-level physical telemetry systems."}
        isCustomized={!!customTitle || !!customIntro}
      />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Profile ID Card - Personnel Hologram Format */}
        <InteractiveTiltCard 
          className="col-span-1 p-5 bg-gradient-to-br from-slate-950 via-slate-900/60 to-indigo-950/20 border border-slate-900/80 rounded-2xl flex flex-col justify-between relative overflow-hidden h-full shadow-lg"
          glowColor="rgba(99, 102, 241, 0.15)"
        >
          {/* Card telemetry scan lines */}
          <div className="absolute inset-0 cyber-scanline opacity-5" />
          <div className="absolute top-2 right-2 text-[9px] font-mono text-indigo-500/60">[SYS_FILE::H_PARSON]</div>

          <div className="space-y-4 relative z-10">
            <div className="relative w-20 h-20 mx-auto md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border border-indigo-500/20 bg-slate-950/40 p-1">
              <ProfileAvatar className="w-full h-full object-cover" expression="neutral" />
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white font-display tracking-tight flex items-center justify-center gap-1">
                Hans Parson
              </h3>
              <p className="text-[11px] text-indigo-400 font-mono tracking-wider">PORTAL_AGENT::ID_013</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] sm:text-[11px] text-indigo-300 font-mono uppercase tracking-wider mt-1">
                <Shield className="w-2.5 h-2.5 text-indigo-400" />
                IoT Specialist
              </div>
            </div>
          </div>

          {/* Barcode & Metadata Section */}
          <div className="space-y-3 pt-4 border-t border-slate-900 mt-4 relative z-10">
            <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
              <div className="flex items-center justify-between">
                <span className="text-slate-555">LOC:</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3 h-3 text-indigo-400" /> Jakarta, ID
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-555">NET:</span>
                <span className="text-slate-300 truncate max-w-[140px]" title="hansparson013@gmail.com">
                  hansparson013@gmail.com
                </span>
              </div>
            </div>

            {/* Custom Barcode Design */}
            <div className="pt-2 flex flex-col items-center">
              <div className="h-6 w-full flex items-stretch gap-[1.5px] opacity-40">
                {[2,4,1,3,1,5,2,1,4,2,3,1,2,4,1,2,5,3,1,2,4,1,3,2,1,5,2,4,1,3].map((w, i) => (
                  <div key={i} style={{ flexGrow: w }} className="bg-indigo-400 h-full rounded-[0.5px]" />
                ))}
              </div>
              <span className="text-[9px] font-mono text-indigo-500/60 tracking-[4px] mt-1">6281288467764</span>
            </div>
          </div>

          <div className="space-y-2 mt-4 relative z-10">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-2 text-xs font-mono font-bold uppercase rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              [CONTACT_SYSTEM]
            </button>
            <a
              href="/images/CV_Hans_Parson_Latest.pdf"
              download="CV_Hans_Parson_Latest.pdf"
              className="w-full py-2 text-xs font-mono font-bold uppercase rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Download CV
            </a>
          </div>
        </InteractiveTiltCard>

        {/* About Specialty Card - Hologram HUD block */}
        <InteractiveTiltCard 
          className="col-span-1 md:col-span-2 p-6 bg-gradient-to-br from-slate-950 via-slate-900/60 to-indigo-950/20 border border-slate-900/80 rounded-2xl flex flex-col justify-between relative overflow-hidden h-full shadow-lg"
          glowColor="rgba(99, 102, 241, 0.15)"
        >
          <div className="absolute inset-0 cyber-scanline opacity-5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
          
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-mono border border-indigo-500/20">
              <Terminal className="w-3.5 h-3.5 animate-pulse" />
              <span>[CORE_METRIC::SYS_ARCHITECT]</span>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-white leading-tight pt-1">
              Building low-latency pipelines where <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">software protocols interact with physical telemetry</span>.
            </h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">
              Specialized in structuring high-availability Go/Python microservices, implementing compliance BI open payment APIs, and programming P2P LoRa telemetry routers mapped onto real-time visual control desks.
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-900 relative z-10 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1"><Radio className="w-3.5 h-3.5 text-emerald-400" /> Mesh active</span>
            <button
              onClick={() => onNavigate('projects')}
              className="px-3.5 py-1.5 text-[11px] font-mono font-bold uppercase rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 border border-slate-800 transition-colors cursor-pointer"
            >
              [LAUNCH_WORKSPACE]
            </button>
          </div>
        </InteractiveTiltCard>

        {/* 3D Telemetry Interactive Console */}
        <TelemetryConsole />

        {/* Selected Featured Project Card */}
        <div className="col-span-1 md:col-span-2 p-6 rounded-2xl bg-slate-950/45 border border-slate-900/80 flex flex-col justify-between backdrop-blur-md relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 cyber-scanline opacity-5" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider font-mono text-slate-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> [WORKSPACE_LOG::FEATURED_WORK]
              </h4>
              <button
                onClick={() => onNavigate('projects')}
                className="text-[10px] sm:text-[11px] uppercase font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                [OPEN_ARCHIVE]
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredProjects.slice(0, 2).map((project, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-900/60 flex flex-col justify-between hover:border-indigo-500/20 hover:shadow-[0_0_15px_rgba(99,102,241,0.05)] transition-all h-full group">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-350 border border-indigo-500/20 uppercase">
                        {project.category}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold font-display text-white group-hover:text-indigo-300 transition-colors">{project.title}</h5>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-900">
                    {project.tech.slice(0, 3).map((t, i) => (
                      <span key={i} className="text-[9px] sm:text-[10px] font-mono text-slate-500 font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono relative z-10">
            <span>LLM compiler dynamically formats Workspace parameters.</span>
            <span className="flex items-center gap-1 text-indigo-400/80"><Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> GEN_UI::ACTIVE</span>
          </div>
        </div>

        {/* Skills Bento Block */}
        <div className="p-6 rounded-2xl bg-slate-950/45 border border-slate-900/80 flex flex-col justify-between space-y-4 backdrop-blur-md relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 cyber-scanline opacity-5" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider font-mono text-slate-400 font-bold">[SYS_METRIC::SKILL_MATRIX]</h4>
              <button
                onClick={() => onNavigate('skills')}
                className="text-[10px] sm:text-[11px] uppercase font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                [EXPAND]
              </button>
            </div>
            <div className="space-y-2">
              {featuredSkills.map((skill, idx) => {
                const isHighlighted = highlightedItems.some(h => h.toLowerCase().includes(skill.name.toLowerCase()));
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border flex items-center justify-between transition-all ${
                      isHighlighted
                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                        : 'bg-slate-950/60 border-slate-900/50 hover:border-slate-800 text-slate-350'
                    }`}
                  >
                    <span className="text-xs sm:text-[13px] font-sans font-medium">{skill.name}</span>
                    <span className="text-[11px] sm:text-xs font-mono font-semibold opacity-70">{skill.level}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-500 leading-relaxed pt-2 border-t border-slate-900 relative z-10">
            Index metrics represent verified pipeline integrations.
          </div>
        </div>

        {/* Origin & Details Bento Block */}
        <div className="p-6 rounded-2xl bg-slate-950/45 border border-slate-900/80 flex flex-col justify-between space-y-4 backdrop-blur-md relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 cyber-scanline opacity-5" />
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold">[SYS_METRIC::BACKGROUND]</h4>
              <span className="text-[9px] font-mono text-indigo-500/80">LOC::MAMASA</span>
            </div>
            
            {/* Origin row */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-900/60 flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Origin / Asal</span>
                <p className="text-xs font-bold text-slate-200 font-display">Mamasa, Sulawesi Barat</p>
                <p className="text-[10px] text-slate-400 leading-normal font-sans">Known for beautiful highlands & rich cultural heritage.</p>
              </div>
            </div>

            {/* Sports */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">Sports / Olahraga</span>
              <div className="flex flex-wrap gap-1">
                {['Volley', 'Sepak Takraw', 'Futsal'].map((sport, i) => (
                  <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950/90 text-slate-350 border border-slate-900">
                    {sport}
                  </span>
                ))}
              </div>
            </div>

            {/* Games */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 flex items-center justify-between">
                <span>Favorite Games</span>
                <span className="text-[10px] text-slate-500 font-normal">Active telemetry</span>
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { 
                    name: 'Valorant', 
                    color: 'hover:border-[#FF4655]/40 hover:text-[#FF4655] hover:bg-[#FF4655]/5',
                    icon: (
                      <img src="/images/games/valorant.svg" alt="Valorant" className="w-3.5 h-3.5 object-contain shrink-0 filter brightness-95" />
                    )
                  },
                  { 
                    name: 'Dota 2', 
                    color: 'hover:border-[#F55343]/40 hover:text-[#F55343] hover:bg-[#F55343]/5',
                    icon: (
                      <img src="/images/games/dota2.svg" alt="Dota 2" className="w-3.5 h-3.5 object-contain shrink-0 filter brightness-95" />
                    )
                  },
                  { 
                    name: 'CS2', 
                    color: 'hover:border-[#DE9B35]/40 hover:text-[#DE9B35] hover:bg-[#DE9B35]/5',
                    icon: (
                      <img src="/images/games/cs2.svg" alt="CS2" className="w-3.5 h-3.5 object-contain shrink-0 filter brightness-95" />
                    )
                  },
                  { 
                    name: 'Delta Force', 
                    color: 'hover:border-[#D4AF37]/40 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5',
                    icon: (
                      <img src="/images/games/deltaforce.svg" alt="Delta Force" className="w-3.5 h-3.5 object-contain shrink-0 filter brightness-95" />
                    )
                  }
                ].map((game, i) => (
                  <div 
                    key={i} 
                    className={`p-1.5 rounded-lg bg-slate-950/80 border border-slate-900 text-slate-350 text-[11px] font-mono tracking-wide flex items-center justify-between transition-all duration-300 hover:scale-[1.02] cursor-default ${game.color}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {game.icon}
                      <span className="truncate">{game.name}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse shrink-0 ml-1.5"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-550 font-mono pt-2 border-t border-slate-900 flex items-center justify-between relative z-10">
            <span>Competitive Gamer</span>
            <span>Active Team Player</span>
          </div>
        </div>

        {/* Philosophy Card - Cyber layout */}
        <div className="p-6 rounded-2xl bg-slate-950/45 border border-slate-900/80 flex flex-col justify-between space-y-4 backdrop-blur-md relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 cyber-scanline opacity-5" />
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider font-mono text-slate-400 font-bold">[SYS_METRIC::PHILOSOPHY]</h4>
              <span className="p-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-400">CORE_VALUE</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-900/60 space-y-2">
              <p className="text-xs italic text-slate-400 leading-relaxed font-sans">
                "Write clean, self-documenting code. Build robust backends that scale, and bridge the physical and digital world with real-time telemetry."
              </p>
              <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-900/60">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                <span className="text-[10px] text-slate-500 font-mono">Telemetry Standard compliant</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-500 leading-relaxed pt-2 border-t border-slate-900 relative z-10">
            System values prioritized for scalability and maintainability.
          </div>
        </div>

        {/* CV Download Card */}
        <InteractiveTiltCard
          className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900/60 to-indigo-950/20 border border-slate-900/80 hover:border-indigo-500/30 flex flex-col justify-between space-y-4 relative overflow-hidden group shadow-lg transition-all duration-300"
          glowColor="rgba(99, 102, 241, 0.15)"
        >
          <div className="absolute inset-0 cyber-scanline opacity-5" />
          
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider font-mono text-slate-400 font-bold">[SYS_FILE::CURRICULUM_VITAE]</h4>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                DOWNLOAD_READY
              </span>
            </div>
            
            {/* Interactive CV Image Mockup showing real CV snippet */}
            <a
              href="/images/CV_Hans_Parson_Latest.pdf"
              download="CV_Hans_Parson_Latest.pdf"
              className="block relative mt-2 rounded-xl border border-slate-900 bg-slate-950/90 p-4 aspect-[4/3] overflow-hidden flex flex-col justify-between group-hover:border-indigo-500/35 hover:border-indigo-500/35 transition-all duration-300 shadow-inner cursor-pointer"
            >
              <div className="space-y-2.5 font-mono text-left leading-relaxed">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-slate-900/80 pb-1.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 shrink-0 flex items-center justify-center font-bold text-[10px] border border-indigo-500/20">HP</div>
                  <div className="space-y-0.5 min-w-0">
                    <h5 className="text-[10px] font-bold text-white leading-none truncate">HANS PARSON</h5>
                    <p className="text-[8px] text-slate-500 leading-none truncate">BACKEND & IOT ENGINEER</p>
                  </div>
                </div>
                
                {/* Profile Brief */}
                <div className="space-y-0.5">
                  <span className="text-[8px] text-indigo-400 font-bold block uppercase tracking-wider">[PROFILE]</span>
                  <p className="text-[9px] text-slate-400 leading-normal line-clamp-2">
                    5+ years building high-availability backend microservices (Go/Python) and low-level physical telemetry systems (Arduino/LoRa).
                  </p>
                </div>

                {/* Experience Snippet */}
                <div className="space-y-0.5">
                  <span className="text-[8px] text-indigo-400 font-bold block uppercase tracking-wider">[EXPERIENCE_LOG]</span>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-slate-350 font-semibold truncate max-w-[70%]">PT Verihubs Nusantara</span>
                      <span className="text-slate-500 shrink-0 font-medium">2024 - Pres.</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-slate-355 font-semibold truncate max-w-[70%]">PT MNC Teknologi</span>
                      <span className="text-slate-500 shrink-0 font-medium">2022 - 2024</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-900 pt-1.5 text-[9px] font-mono text-slate-500">
                <span>FORMAT: PDF</span>
                <span>SIZE: 28 KB</span>
              </div>
              
              {/* Hover Highlight Overlay */}
              <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                <div className="p-2.5 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Download className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-bold text-indigo-300 tracking-widest">DOWNLOAD_CV</span>
              </div>
            </a>
          </div>
          
          <div className="space-y-3 relative z-10">
            <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed font-sans">
              Access the complete profile detailing professional credentials, backend capabilities, and tech stack logs.
            </p>
            <a
              href="/images/CV_Hans_Parson_Latest.pdf"
              download="CV_Hans_Parson_Latest.pdf"
              className="w-full py-2.5 text-xs font-mono font-bold uppercase rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/15"
            >
              <Download className="w-3.5 h-3.5 animate-pulse" />
              Download CV (PDF)
            </a>
          </div>
        </InteractiveTiltCard>

        {/* Visitor Statistics Bento Block */}
        <div className="col-span-1 md:col-span-2 lg:hidden">
          <VisitorConsole />
        </div>
      </div>
    </motion.div>
  );
}
