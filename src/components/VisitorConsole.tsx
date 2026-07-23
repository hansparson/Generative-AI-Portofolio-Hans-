import React, { useState, useEffect } from 'react';
import { Users, Calendar, Activity, RefreshCw, BarChart3, Clock, X } from 'lucide-react';
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
  countryCode?: string;
  countryName?: string;
  city?: string;
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

interface VisitorConsoleProps {
  isSidebar?: boolean;
  onCloseSidebar?: () => void;
}

export default function VisitorConsole({ isSidebar = false, onCloseSidebar }: VisitorConsoleProps) {
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
      disabled={true}
      className={isSidebar 
        ? "w-full p-4 bg-gradient-to-br from-slate-950 via-slate-900/60 to-amber-950/10 border border-slate-900/80 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-lg h-full"
        : "col-span-1 md:col-span-2 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-slate-950 via-slate-900/60 to-amber-950/10 border border-slate-900/80 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden shadow-lg"
      }
    >
      <div className="absolute inset-0 cyber-scanline opacity-5 pointer-events-none" />
      
      <div className={isSidebar ? "relative z-10 h-full flex flex-col justify-between" : "relative z-10"}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/25 shrink-0">
              <Users className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h4 className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold truncate">[SYS_METRIC::VISITOR_ANALYTICS]</h4>
              <p className="text-[8px] sm:text-[9px] text-slate-500 font-mono truncate">Database Layer: Hybrid DB Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/35 text-orange-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
              <span>PIPELINE: ACTIVE</span>
            </span>
            {isSidebar && onCloseSidebar && (
              <button
                onClick={onCloseSidebar}
                className="p-1 rounded bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/80 transition-colors cursor-pointer"
                title="Minimize Panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
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
          <div className={isSidebar ? "flex flex-col gap-4 overflow-y-auto scrollbar-none flex-1 pr-0.5" : "grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch"}>
            {/* Left Metrics */}
            <div className={isSidebar ? "w-full" : "md:col-span-4 flex flex-col gap-4"}>
              <div className={isSidebar 
                ? "p-4 rounded-xl bg-slate-950/80 border border-slate-900/60 flex flex-col justify-between h-auto min-h-[140px] relative overflow-hidden group shrink-0" 
                : "p-4 rounded-xl bg-slate-950/80 border border-slate-900/60 flex flex-col justify-between h-full min-h-[140px] relative overflow-hidden group"
              }>
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-xl -z-10 group-hover:bg-orange-500/10 transition-all" />
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider">Total Visitors</span>
                    <span className="text-4xl font-extrabold text-white tracking-tight mt-1 font-display drop-shadow-[0_0_10px_rgba(249,115,22,0.2)] block">
                      {data?.totalVisits || 0}
                    </span>
                  </div>
                  
                  {/* Geolocation Stats list */}
                  {data?.visitsByCountry && data.visitsByCountry.length > 0 && (
                    <div className="pt-2.5 border-t border-slate-900/65 space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-slate-450 font-bold tracking-wider block">Top Regions</span>
                      <div className="space-y-1.5 max-h-[110px] overflow-y-auto scrollbar-none">
                        {data.visitsByCountry.slice(0, 5).map((c) => (
                          <div key={c.countryCode} className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-355 truncate max-w-[70%]">{c.countryName}</span>
                            <span className="text-orange-400 font-semibold">{c.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Telemetry Log Trail (Moved from bottom to Left Column) */}
                  {data?.recentVisits && data.recentVisits.length > 0 && (
                    <div className="pt-2.5 border-t border-slate-900/65 space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-slate-455 font-bold tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-450" /> Telemetry Logs
                      </span>
                      <div className="space-y-1.5 max-h-[96px] overflow-y-auto scrollbar-none font-mono text-[9px] text-slate-350">
                        {data.recentVisits.slice(0, 4).map((visit) => {
                          const dateObj = new Date(visit.timestamp);
                          const formattedTime = dateObj.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          });
                          
                          let browser = "Client";
                          if (visit.userAgent.includes("Chrome")) browser = "Chrome";
                          else if (visit.userAgent.includes("Safari")) browser = "Safari";
                          else if (visit.userAgent.includes("Firefox")) browser = "Firefox";
                          else if (visit.userAgent.includes("Edge")) browser = "Edge";

                          const daysIndo = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
                          const dayName = daysIndo[dateObj.getDay()];
                          const day = String(dateObj.getDate()).padStart(2, '0');
                          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                          const dateStr = `${day}/${month}`;
                          
                          const location = visit.city 
                            ? `${visit.city}, ${visit.countryCode || '??'}`
                            : (visit.countryName || visit.countryCode || "Visitor");
                            
                          const daysFullIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                          const monthsFullIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                          const fullDateStr = `${daysFullIndo[dateObj.getDay()]}, ${day} ${monthsFullIndo[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

                          const tooltip = `Visit ID: ${visit.id}\nTanggal: ${fullDateStr}\nWaktu: ${formattedTime}\nLokasi: ${visit.city || '-'}${visit.countryName ? `, ${visit.countryName}` : ''} (${visit.countryCode || '?'})\nBrowser: ${browser}`;

                          return (
                            <div 
                              key={visit.id} 
                              className="flex items-center justify-between hover:text-orange-400 transition-colors cursor-help py-0.5 border-b border-slate-900/30 last:border-0"
                              title={tooltip}
                            >
                              <span className="truncate max-w-[70%] text-slate-400">
                                &gt; {dayName}, {dateStr} - {location}
                              </span>
                              <span className="text-slate-550 font-medium shrink-0 ml-2">{formattedTime}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-450 font-mono mt-2.5 flex items-center gap-1.5 pt-2 border-t border-slate-900/40">
                  <Activity className="w-3 h-3 text-emerald-450" />
                  Live Geolocation Sync
                </span>
              </div>
            </div>

            {/* Right Chart / Map Container */}
            <div className={isSidebar ? "w-full p-3 rounded-xl bg-slate-950/30 border border-slate-900/50" : "md:col-span-8 flex flex-col justify-between p-4 rounded-xl bg-slate-950/30 border border-slate-900/50"}>
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] sm:text-[11px] uppercase font-mono text-slate-400 font-bold flex items-center gap-1.5">
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
                      className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
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
                      className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
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
                          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                            <span className="text-slate-355 font-medium">
                              {day.dayNameIndo} <span className="text-slate-550">({getDayInitial(day.dayNameEng)})</span>
                            </span>
                            <span className="text-slate-300 font-semibold">
                              {day.count} <span className="text-slate-550">({day.percentage}%)</span>
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
                  <WorldVisitorMap locations={data?.visitorLocations || []} isSidebar={isSidebar} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </InteractiveTiltCard>
  );
}
