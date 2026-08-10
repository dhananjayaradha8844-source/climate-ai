import { useState, useEffect } from 'react';
import { getHotspots, generateReport } from '../services/api';
import type { Hotspot, AIReport } from '../types';
import { Download, Printer, Loader2, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export const Reports = () => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [report, setReport] = useState<AIReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
      }
    };
    fetchHotspots();
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedId) return;
    setIsGenerating(true);
    try {
      const data = await generateReport(selectedId);
      setReport(data);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Report Generation</h1>
          <p className="text-slate-500">Generate comprehensive AI risk assessment reports for specific locations.</p>
        </div>
      </div>

      <div className="glass-panel p-6 print:hidden">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Location for Report</label>
            <select 
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-climate-blue focus:border-climate-blue transition-all"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="" disabled>Select a location...</option>
              {hotspots.map(h => (
                <option key={h.id} value={h.id}>{h.location} - Risk: {h.riskScore}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={!selectedId || isGenerating}
            className="w-full sm:w-auto px-6 py-3 bg-climate-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {isGenerating ? (
              <><Loader2 size={18} className="animate-spin" /> Generating...</>
            ) : (
              <><Sparkles size={18} /> Generate Report</>
            )}
          </button>
        </div>
      </div>

      {report && (
        <div className="glass-panel p-8 md:p-12 mt-8 print:shadow-none print:border-none print:p-0 print:m-0 bg-white">
          <div className="flex justify-between items-start mb-8 border-b border-slate-200 pb-6 print:border-slate-800">
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{report.title}</h2>
              <p className="text-lg text-slate-600 mt-1">{report.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500 uppercase">Generated</p>
              <p className="text-slate-900">{new Date(report.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-3 tracking-wider">Risk Profile</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-black">{report.currentRisk.score}</span>
                  <span className="text-sm text-slate-500 mb-1">/ 100</span>
                </div>
                <div className={`inline-block px-3 py-1 rounded text-sm font-bold text-white ${
                  report.currentRisk.category === 'Critical' ? 'bg-red-500' :
                  report.currentRisk.category === 'Very High' ? 'bg-orange-500' :
                  report.currentRisk.category === 'High' ? 'bg-amber-500' : 'bg-yellow-500'
                }`}>
                  {report.currentRisk.category} Risk
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-3 tracking-wider">Observed Indicators</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Temp Anomaly</span>
                  <span className="font-medium">{report.observedIndicators.temperatureAnomaly > 0 ? '+' : ''}{report.observedIndicators.temperatureAnomaly}°C</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Rainfall Anomaly</span>
                  <span className="font-medium">{report.observedIndicators.rainfallAnomaly > 0 ? '+' : ''}{report.observedIndicators.rainfallAnomaly}mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Drought Index</span>
                  <span className="font-medium">{report.observedIndicators.droughtIndex}/100</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Flood Index</span>
                  <span className="font-medium">{report.observedIndicators.floodIndex}/100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-100 pb-2 mb-4">Executive Summary</h3>
              <p className="text-slate-700 leading-relaxed">{report.aiAnalysis.summary}</p>
              <p className="text-slate-700 leading-relaxed mt-2">{report.aiAnalysis.riskExplanation}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-100 pb-2 mb-4">Primary Climate Drivers</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {report.aiAnalysis.drivers.map((driver, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="text-climate-blue mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-slate-700">{driver}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-100 pb-2 mb-4">Potential Impacts</h3>
              <ul className="list-disc pl-5 space-y-1">
                {report.aiAnalysis.potentialImpacts.map((impact, idx) => (
                  <li key={idx} className="text-slate-700">{impact}</li>
                ))}
              </ul>
            </section>

            <section className="bg-red-50 border border-red-100 p-5 rounded-xl print:border-red-500">
              <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
                <AlertTriangle size={20} /> Early Warning Assessment
              </h3>
              <p className="text-red-900 font-medium">{report.aiAnalysis.earlyWarning}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-100 pb-2 mb-4">Recommended Actions</h3>
              <div className="space-y-3">
                {report.aiAnalysis.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="bg-white border border-slate-200 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700">{rec}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-200 flex justify-end gap-4 print:hidden">
            <button 
              className="px-4 py-2 flex items-center gap-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              onClick={handlePrint}
            >
              <Printer size={18} /> Print
            </button>
            <button 
              className="px-4 py-2 flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors font-medium shadow-sm"
              onClick={handlePrint}
            >
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
