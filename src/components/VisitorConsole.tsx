import React, { useState, useEffect } from 'react';
import { Users, Calendar, Database, Activity, RefreshCw, BarChart3, Clock } from 'lucide-react';
import InteractiveTiltCard from './InteractiveTiltCard';

interface DayVisitStats {
  dayOfWeek: number;
  dayNameIndo: string;
  dayNameEng: string;
  count: number;
  percentage: number;
}

interface VisitRecord {
  id: string;
  timestamp: string;
  dayOfWeek: number;
  userAgent: string;
}

interface VisitsData {
  totalVisits: number;
  visitsByDay: DayVisitStats[];
  recentVisits: VisitRecord[];
}

export default function VisitorConsole() {
  const [data, setData] = useState<VisitsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/visits');
      if (!res.ok) {
        throw new Error('Failed to fetch statistics');
      }
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching visitor stats:', err);
      setError('Failed to load database logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSimulateVisit = async () => {
    setIsSimulating(true);
    try {
      const randomUserAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.1 Mobile/15E148 Safari/604.1"
      ];
      const randomUA = randomUserAgents[Math.floor(Math.random() * randomUserAgents.length)];

      const res = await fetch('/api/visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAgent: randomUA }),
      });

      if (res.ok) {
        await fetchStats();
      }
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const getDayInitial = (dayName: string) => {
    return dayName.substring(0, 3);
  };

  const maxCount = data ? Math.max(...data.visitsByDay.map(d => d.count), 1) : 1;

  return (
    <InteractiveTiltCard
      glowColor="rgba(249, 115, 22, 0.15)"
      className="col-span-1 md:col-span-2 p-6 bg-gradient-to-br from-slate-950 via-slate-900/60 to-amber-950/10 border border-slate-900/80 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden shadow-lg"
    >
      <div className="absolute inset-0 cyber-scanline opacity-5 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/25">
              <Users className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold">[SYS_METRIC::VISITOR_ANALYTICS]</h4>
              <p className="text-[9px] text-slate-500 font-mono">Database Layer: SQL-SQLite Engine</p>
            </div>
          </div>
          <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/35 text-orange-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
            <span>PIPELINE: ACTIVE</span>
          </span>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-orange-450 animate-spin" />
          </div>
        ) : error ? (
          <div className="h-48 flex items-center justify-center text-[10px] text-rose-450 font-mono">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* Left Metrics & Simulation */}
            <div className="md:col-span-4 flex flex-col justify-between gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-900/60 flex flex-col justify-center h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-xl -z-10 group-hover:bg-orange-500/10 transition-all" />
                <span className="text-[9px] uppercase font-mono text-slate-500 font-bold tracking-wider">Total Visitors</span>
                <span className="text-3xl font-extrabold text-white tracking-tight mt-1 font-display drop-shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                  {data?.totalVisits || 0}
                </span>
                <span className="text-[8px] text-slate-600 font-mono mt-1.5 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  Live SQLite Sync
                </span>
              </div>

              {/* Simulation button */}
              <button
                onClick={handleSimulateVisit}
                disabled={isSimulating}
                className="w-full py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-xl bg-orange-500/10 hover:bg-orange-500/20 active:scale-[0.98] text-orange-400 border border-orange-500/35 flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-orange-500/5"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>[RECORDING...]</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>[SIMULATE_VISIT]</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Chart */}
            <div className="md:col-span-8 flex flex-col justify-between p-4 rounded-xl bg-slate-950/30 border border-slate-900/50">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[9px] uppercase font-mono text-slate-400 font-bold flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-orange-400" /> Distribution / Hari Kunjungan
                  </span>
                  <span className="text-[7px] font-mono text-slate-600 uppercase">Percent %</span>
                </div>

                {/* Day chart rows */}
                <div className="space-y-2">
                  {data?.visitsByDay.map((day) => {
                    const relativePct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;

                    return (
                      <div key={day.dayOfWeek} className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-mono">
                          <span className="text-slate-350 font-medium">
                            {day.dayNameIndo} <span className="text-slate-600">({getDayInitial(day.dayNameEng)})</span>
                          </span>
                          <span className="text-slate-400 font-semibold">
                            {day.count} <span className="text-slate-650">({day.percentage}%)</span>
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900/80">
                          <div
                            style={{ width: `${relativePct}%` }}
                            className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-450 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(249,115,22,0.25)]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity Telemetry Log */}
      {!loading && !error && data && data.recentVisits.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-900 relative z-10">
          <span className="text-[9px] uppercase font-mono text-slate-500 font-bold tracking-wider flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-orange-400" /> [TELEMETRY_LOG_TRAIL]
          </span>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-900/80 font-mono text-[8px] text-slate-550 space-y-1.5 max-h-24 overflow-y-auto scrollbar-none">
            {data.recentVisits.map((visit) => {
              const formattedTime = new Date(visit.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
              
              let browser = "HTTP Client";
              if (visit.userAgent.includes("Chrome")) browser = "Chrome";
              else if (visit.userAgent.includes("Safari")) browser = "Safari";
              else if (visit.userAgent.includes("Firefox")) browser = "Firefox";
              else if (visit.userAgent.includes("Edge")) browser = "Edge";

              return (
                <div key={visit.id} className="flex items-center justify-between hover:text-slate-350 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span className="text-orange-500/70">&gt;</span>
                    <span className="text-slate-400 font-semibold">{visit.id}</span>
                    <span>logged from {browser}</span>
                  </div>
                  <span className="text-slate-650">{formattedTime}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </InteractiveTiltCard>
  );
}
