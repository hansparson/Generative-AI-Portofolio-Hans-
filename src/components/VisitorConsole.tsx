import React, { useState, useEffect } from 'react';
import { Users, Calendar, Activity, RefreshCw, BarChart3, Clock } from 'lucide-react';
import InteractiveTiltCard from './InteractiveTiltCard';
import WorldVisitorMap from './WorldVisitorMap';

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

interface CountryVisitStats {
  countryCode: string;
  countryName: string;
  count: number;
  percentage: number;
}

interface VisitorLocation {
  id: string;
  countryCode: string;
  countryName: string;
  city: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface VisitsData {
  totalVisits: number;
  visitsByDay: DayVisitStats[];
  recentVisits: VisitRecord[];
  visitsByCountry?: CountryVisitStats[];
  visitorLocations?: VisitorLocation[];
}

export default function VisitorConsole() {
  const [data, setData] = useState<VisitsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'day' | 'map'>('day');

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
              <p className="text-[9px] text-slate-500 font-mono">Database Layer: Hybrid DB Engine</p>
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
            {/* Left Metrics */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-900/60 flex flex-col justify-between h-full min-h-[140px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-xl -z-10 group-hover:bg-orange-500/10 transition-all" />
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-slate-500 font-bold tracking-wider">Total Visitors</span>
                    <span className="text-3xl font-extrabold text-white tracking-tight mt-1 font-display drop-shadow-[0_0_10px_rgba(249,115,22,0.2)] block">
                      {data?.totalVisits || 0}
                    </span>
                  </div>
                  
                  {/* Geolocation Stats list */}
                  {data?.visitsByCountry && data.visitsByCountry.length > 0 && (
                    <div className="pt-2 border-t border-slate-900/65 space-y-1">
                      <span className="text-[8px] uppercase font-mono text-slate-550 font-bold tracking-wider block">Top Regions</span>
                      <div className="space-y-1 max-h-[64px] overflow-y-auto scrollbar-none">
                        {data.visitsByCountry.slice(0, 3).map((c) => (
                          <div key={c.countryCode} className="flex items-center justify-between text-[8px] font-mono">
                            <span className="text-slate-350 truncate max-w-[70%]">{c.countryName}</span>
                            <span className="text-orange-400 font-semibold">{c.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Telemetry Log Trail (Moved from bottom to Left Column) */}
                  {data?.recentVisits && data.recentVisits.length > 0 && (
                    <div className="pt-2 border-t border-slate-900/65 space-y-1">
                      <span className="text-[8px] uppercase font-mono text-slate-550 font-bold tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-450" /> Telemetry Logs
                      </span>
                      <div className="space-y-1 max-h-[72px] overflow-y-auto scrollbar-none font-mono text-[7px] text-slate-450">
                        {data.recentVisits.slice(0, 3).map((visit) => {
                          const formattedTime = new Date(visit.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          });
                          
                          let browser = "Client";
                          if (visit.userAgent.includes("Chrome")) browser = "Chrome";
                          else if (visit.userAgent.includes("Safari")) browser = "Safari";
                          else if (visit.userAgent.includes("Firefox")) browser = "Firefox";
                          else if (visit.userAgent.includes("Edge")) browser = "Edge";

                          return (
                            <div key={visit.id} className="flex items-center justify-between hover:text-slate-300 transition-colors">
                              <span className="truncate max-w-[65%]">&gt; {visit.id}</span>
                              <span className="text-slate-600 font-semibold">{formattedTime}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[8px] text-slate-655 font-mono mt-1.5 flex items-center gap-1 pt-1.5 border-t border-slate-900/40">
                  <Activity className="w-3 h-3 text-emerald-450" />
                  Live Geolocation Sync
                </span>
              </div>
            </div>

            {/* Right Chart / Map Container */}
            <div className="md:col-span-8 flex flex-col justify-between p-4 rounded-xl bg-slate-950/30 border border-slate-900/50">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[9px] uppercase font-mono text-slate-400 font-bold flex items-center gap-1.5">
                    {activeTab === 'day' ? (
                      <>
                        <BarChart3 className="w-3.5 h-3.5 text-orange-450" /> Distribution / Hari Kunjungan
                      </>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5 text-orange-450" /> Geolocation Telemetry Map
                      </>
                    )}
                  </span>
                  
                  {/* Tab Toggles */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('day')}
                      className={`text-[8px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
                        activeTab === 'day'
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25'
                          : 'text-slate-500 hover:text-slate-355 border border-transparent'
                      }`}
                    >
                      [DAY_DIST]
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('map')}
                      className={`text-[8px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
                        activeTab === 'map'
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25'
                          : 'text-slate-500 hover:text-slate-355 border border-transparent'
                      }`}
                    >
                      [WORLD_MAP]
                    </button>
                  </div>
                </div>

                {activeTab === 'day' ? (
                  /* Day chart rows */
                  <div className="space-y-2">
                    {data?.visitsByDay.map((day) => {
                      const relativePct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;

                      return (
                        <div key={day.dayOfWeek} className="space-y-1">
                          <div className="flex items-center justify-between text-[9px] font-mono">
                            <span className="text-slate-355 font-medium">
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
                ) : (
                  /* World Geolocation Map */
                  <WorldVisitorMap locations={data?.visitorLocations || []} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </InteractiveTiltCard>
  );
}
