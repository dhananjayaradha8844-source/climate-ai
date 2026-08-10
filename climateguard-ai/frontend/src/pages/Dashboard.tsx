import { useState, useEffect } from 'react';
import { getHotspots, getStats, analyzeHotspot } from '../services/api';
import type { Hotspot, HotspotStats, AIAnalysis } from '../types';
import { Map } from '../components/Map';
import { AlertTriangle, TrendingUp, ShieldAlert, Activity, Thermometer, Droplets, Loader2, Sparkles, X, Globe } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState<HotspotStats | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, hotspotsData] = await Promise.all([
          getStats(),
          getHotspots()
        ]);
        setStats(statsData);
        setHotspots(hotspotsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMarkerClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setAiAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!selectedHotspot) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeHotspot(selectedHotspot.id);
      setAiAnalysis(result);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-climate-blue" />
        <span className="ml-2 text-lg text-slate-600">Loading climate data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Command Center</h1>
          <p className="text-slate-500 mt-1">ClimateGuard AI detects emerging climate hotspots and converts climate signals into explainable early warnings.</p>
        </div>
        <div className="text-sm text-slate-400">
          Last updated: {stats?.latestUpdate ? new Date(stats.latestUpdate).toLocaleTimeString() : 'N/A'}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Hotspots</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.activeHotspots || 0}</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Activity size={20} />
          </div>
        </div>
        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Critical Alerts</p>
            <p className="text-2xl font-bold text-red-600">{stats?.criticalAlerts || 0}</p>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Average Risk</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.averageRisk || 0}</p>
          </div>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">High Risk Regions</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.highRiskRegions || 0}</p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <ShieldAlert size={20} />
          </div>
        </div>
      </div>

      {/* Map and Details Split */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Map hotspots={hotspots} onMarkerClick={handleMarkerClick} />
        </div>
        
        <div className="space-y-6">
          {selectedHotspot ? (
            <div className="glass-panel p-6 relative">
              <button 
                onClick={() => { setSelectedHotspot(null); setAiAnalysis(null); }}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
              
              <h2 className="text-xl font-bold mb-1">{selectedHotspot.location}</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-slate-500">Risk Score:</span>
                <span className="font-bold text-lg">{selectedHotspot.riskScore}/100</span>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  selectedHotspot.riskCategory === 'Critical' ? 'bg-red-100 text-red-700' :
                  selectedHotspot.riskCategory === 'Very High' ? 'bg-orange-100 text-orange-700' :
                  selectedHotspot.riskCategory === 'High' ? 'bg-amber-100 text-amber-700' :
                  selectedHotspot.riskCategory === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedHotspot.riskCategory}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Climate Indicators</h3>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1"><Thermometer size={14} className="text-orange-500" /> Temp Anomaly</span>
                    <span className="font-medium">{selectedHotspot.temperatureAnomaly > 0 ? '+' : ''}{selectedHotspot.temperatureAnomaly}°C</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${Math.min(Math.abs(selectedHotspot.temperatureAnomaly) * 20, 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1"><Droplets size={14} className="text-blue-500" /> Rainfall Anomaly</span>
                    <span className="font-medium">{selectedHotspot.rainfallAnomaly > 0 ? '+' : ''}{selectedHotspot.rainfallAnomaly}mm</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 flex justify-center">
                     {/* Simplified representation for both ends */}
                     <div className={`h-1.5 rounded-full ${selectedHotspot.rainfallAnomaly > 0 ? 'bg-blue-500' : 'bg-red-400'}`} style={{ width: `${Math.min(Math.abs(selectedHotspot.rainfallAnomaly) / 2, 100)}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Drought Index</span>
                    <span className="font-medium">{selectedHotspot.droughtIndex}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${selectedHotspot.droughtIndex}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Flood Index</span>
                    <span className="font-medium">{selectedHotspot.floodIndex}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${selectedHotspot.floodIndex}%` }}></div>
                  </div>
                </div>
              </div>

              {!aiAnalysis && !isAnalyzing && (
                <button 
                  onClick={handleAnalyze}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-md"
                >
                  <Sparkles size={16} />
                  Analyze with AI
                </button>
              )}

              {isAnalyzing && (
                <div className="w-full py-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                  <div className="text-xs text-slate-500 font-medium space-y-1 text-center">
                    <p className="animate-pulse">Analyzing climate signals...</p>
                    <p className="animate-pulse delay-75">Cross-checking risk indicators...</p>
                    <p className="animate-pulse delay-150">Generating early warning...</p>
                  </div>
                </div>
              )}

              {aiAnalysis && !isAnalyzing && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-climate-blue mb-1 flex items-center gap-1">
                      <Sparkles size={12} /> AI Situation Summary
                    </h4>
                    <p className="text-sm text-slate-700">{aiAnalysis.summary}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Potential Impacts</h4>
                    <ul className="list-disc pl-4 text-sm text-slate-700">
                      {aiAnalysis.potentialImpacts.map((impact, i) => <li key={i}>{impact}</li>)}
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <h4 className="text-xs font-bold uppercase text-red-600 mb-1 flex items-center gap-1">
                      <AlertTriangle size={12} /> Early Warning
                    </h4>
                    <p className="text-sm text-red-700 font-medium">{aiAnalysis.earlyWarning}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Recommended Actions</h4>
                    <ul className="space-y-1">
                      {aiAnalysis.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="font-semibold text-lg text-slate-700 mb-2">Select a Hotspot</h3>
              <p className="text-sm">Click on any marker on the map to view detailed climate indicators and run AI analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
