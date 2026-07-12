import { motion } from 'motion/react';
import TelemetryConsole from './TelemetryConsole';
import WorkspaceHeader from './WorkspaceHeader';
import { Cpu, Radio, Sparkles } from 'lucide-react';

interface SandboxViewProps {
  customTitle?: string;
  customIntro?: string;
}

export default function SandboxView({ customTitle, customIntro }: SandboxViewProps) {
  return (
    <motion.div
      id="sandbox-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <WorkspaceHeader
        title={customTitle || "IoT & Telemetry Sandbox"}
        subtitle={customIntro || "An interactive live simulator mapping GPS logs and signal strengths from virtual Arduino LoRa mesh nodes."}
        isCustomized={!!customTitle || !!customIntro}
      />

      {/* Main Sandbox */}
      <div className="grid grid-cols-1 gap-4 items-stretch">
        <div className="h-[450px]">
          <TelemetryConsole />
        </div>
      </div>

      {/* Hardware Details Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Cpu className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Simulated Device Spec</h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nodes run on **Arduino Pro Mini** and **LoRa SX1276 transceivers (915 MHz)**. P2P packet hopping broadcasts GPS and telemetry logs directly to the main Gateway Node without internet dependency.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
