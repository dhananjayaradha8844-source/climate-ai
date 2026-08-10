import { useState, useEffect } from 'react';
import { getHotspots, getHistorical } from '../services/api';
import type { Hotspot, HistoricalData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Loader2, Calendar } from 'lucide-react';

export const Historical = () => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [history, setHistory] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const data = await getHotspots();
        setHotspots(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch hotspots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotspots();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const data = await getHistorical(selectedId);
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [selectedId]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-climate-blue" />
        <span className="ml-2 text-lg text-slate-600">Loading historical data...</span>
      </div>
    );
  }

  const selectedLocationName = hotspots.find(h => h.id === selectedId)?.location || 'Selected Location';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Historical Analysis</h1>
          <p className="text-slate-500">Track climate-risk trends over time for specific hotspots.</p>
        </div>
        
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Hotspot</label>
          <select 
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-climate-blue focus:border-climate-blue"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {hotspots.map(h => (
              <option key={h.id} value={h.id}>{h.location}</option>
            ))}
          </select>
        </div>
      </div>

      {historyLoading ? (
        <div className="glass-panel h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Risk Score Trend */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-slate-400" size={20} />
              <h3 className="text-lg font-bold text-slate-800">Risk Score Trend: {selectedLocationName}</h3>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="riskScore" stroke="#EF4444" fillOpacity={1} fill="url(#colorRisk)" name="Risk Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Temperature & Rainfall Anomaly */}
            <div className="glass-panel p-6">
              <h3 className="text-base font-bold text-slate-800 mb-6">Anomalies</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="temperatureAnomaly" stroke="#F97316" name="Temp Anomaly (°C)" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="rainfallAnomaly" stroke="#0EA5E9" name="Rainfall Anomaly (mm)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Drought & Flood Indices */}
            <div className="glass-panel p-6">
              <h3 className="text-base font-bold text-slate-800 mb-6">Drought & Flood Indices</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="droughtIndex" stroke="#EAB308" name="Drought Index" strokeWidth={2} />
                    <Line type="monotone" dataKey="floodIndex" stroke="#3B82F6" name="Flood Index" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
