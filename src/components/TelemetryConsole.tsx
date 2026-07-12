import React, { useState, useEffect } from 'react';
import { Radio, Cpu, Wifi, Activity, Navigation, RefreshCw } from 'lucide-react';
import InteractiveTiltCard from './InteractiveTiltCard';

export default function TelemetryConsole() {
  const [nodes, setNodes] = useState([
    { id: 'Gate-01', lat: -6.168, lng: 106.782, rssi: -72, battery: '3.9V', online: true },
    { id: 'Node-02', lat: -6.172, lng: 106.779, rssi: -85, battery: '3.7V', online: true },
    { id: 'Node-03', lat: -6.165, lng: 106.791, rssi: -98, battery: '3.4V', online: false }
  ]);
  const [pulseCount, setPulseCount] = useState(148);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [activeSignal, setActiveSignal] = useState(0);

  // Simulate real-time sensor updates over the LoRa Mesh network
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => {
        if (!n.online) {
          // Occasional reconnection
          if (Math.random() > 0.85) {
            return { ...n, online: true, rssi: -105 };
          }
          return n;
        }
        // Random micro-variations in signal strength and GPS coordinates
        const rssiDelta = Math.floor(Math.random() * 5) - 2;
        const latDelta = (Math.random() - 0.5) * 0.0001;
        const lngDelta = (Math.random() - 0.5) * 0.0001;
        
        // Simulating packet loss
        if (Math.random() > 0.98) {
          return { ...n, online: false };
        }

        return {
          ...n,
          lat: parseFloat((n.lat + latDelta).toFixed(5)),
          lng: parseFloat((n.lng + lngDelta).toFixed(5)),
          rssi: Math.min(-60, Math.max(-120, n.rssi + rssiDelta))
        };
      }));

      setPulseCount(p => p + (Math.random() > 0.6 ? 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const triggerPing = () => {
    setIsTransmitting(true);
    setActiveSignal(prev => prev + 1);
    setTimeout(() => {
      setIsTransmitting(false);
    }, 1200);
  };

  return (
    <InteractiveTiltCard glowColor="rgba(16, 185, 129, 0.2)" className="h-full bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between p-5">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4" style={{ transform: 'translateZ(25px)' }}>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Radio className={`w-4 h-4 ${isTransmitting ? 'animate-bounce' : 'animate-pulse'}`} />
            </span>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-mono text-slate-400 font-bold">LoRa Telemetry</h4>
              <p className="text-[10px] text-slate-500 font-mono">Mesh Protocol: Arduino + Go</p>
            </div>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 flex items-center gap-1">
            <span className={`w-1 h-1 rounded-full bg-emerald-400 ${isTransmitting ? 'animate-ping' : ''}`}></span>
            <span>{isTransmitting ? 'PINGING' : 'LISTENING'}</span>
          </span>
        </div>

        {/* 3D Radar Circle */}
        <div className="relative w-full h-32 bg-slate-950/80 rounded-xl border border-slate-850 overflow-hidden flex items-center justify-center mb-4 group/radar" style={{ transform: 'translateZ(30px)' }}>
          {/* Radial grids */}
          <div className="absolute inset-0 mesh-grid opacity-30" />
          <div className="absolute w-24 h-24 rounded-full border border-emerald-500/10" />
          <div className="absolute w-16 h-16 rounded-full border border-emerald-500/20" />
          <div className="absolute w-8 h-8 rounded-full border border-emerald-500/30" />
          
          {/* Radar sweeping line */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-emerald-500/10 origin-center animate-slow-spin pointer-events-none" />

          {/* Active node representations */}
          {nodes.map((node, i) => {
            const radAngle = (i * 120 * Math.PI) / 180;
            // Radial offsets
            const radius = i === 0 ? 30 : i === 1 ? 45 : 52;
            const x = Math.cos(radAngle) * radius;
            const y = Math.sin(radAngle) * radius;
            return (
              <div
                key={node.id}
                style={{ transform: `translate(${x}px, ${y}px) translateZ(35px)` }}
                className="absolute"
              >
                <div className={`w-2.5 h-2.5 rounded-full relative ${node.online ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500/60'}`}>
                  {node.online && (
                    <span className="absolute -inset-1 rounded-full border border-emerald-400/40 animate-ping" />
                  )}
                </div>
                {/* Micro tooltip label */}
                <div className="absolute left-3.5 -top-1 bg-slate-950/90 text-[8px] font-mono text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 whitespace-nowrap opacity-0 group-hover/radar:opacity-100 transition-opacity duration-300">
                  {node.id}: {node.rssi} dBm
                </div>
              </div>
            );
          })}

          <Activity className="w-6 h-6 text-emerald-400/30 animate-pulse absolute" />
        </div>

        {/* Live Nodes List */}
        <div className="space-y-2" style={{ transform: 'translateZ(15px)' }}>
          {nodes.map(node => (
            <div key={node.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-850 text-[11px] font-mono hover:bg-slate-950/70 transition-all">
              <div className="flex items-center gap-1.5">
                <Navigation className={`w-3 h-3 ${node.online ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span className={node.online ? 'text-slate-200 font-medium' : 'text-slate-600'}>{node.id}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-slate-500 text-[10px]">{node.lat}, {node.lng}</span>
                <span className={node.online ? 'text-emerald-500 font-semibold' : 'text-slate-700'}>
                  {node.online ? `${node.rssi}dBm` : 'LOST'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer trigger control panel */}
      <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between gap-2" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-mono text-slate-500">Packets Exchanged</span>
          <span className="text-xs font-mono font-bold text-slate-300">{pulseCount} Packets</span>
        </div>
        <button
          onClick={triggerPing}
          disabled={isTransmitting}
          className="px-3.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-all disabled:opacity-40"
        >
          {isTransmitting ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Transmitting</span>
            </>
          ) : (
            <>
              <Wifi className="w-3 h-3" />
              <span>Send Ping</span>
            </>
          )}
        </button>
      </div>
    </InteractiveTiltCard>
  );
}
