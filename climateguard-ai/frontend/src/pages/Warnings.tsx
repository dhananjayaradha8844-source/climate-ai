import { useState, useEffect } from 'react';
import { getWarnings } from '../services/api';
import type { Hotspot } from '../types';
import { AlertTriangle, MapPin, Clock, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Warnings = () => {
  const [warnings, setWarnings] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const data = await getWarnings();
        setWarnings(data);
      } catch (error) {
        console.error("Failed to fetch warnings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWarnings();
  }, []);

  const filteredWarnings = filter === 'All' 
    ? warnings 
    : warnings.filter(w => w.riskCategory === filter);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-climate-blue" />
        <span className="ml-2 text-lg text-slate-600">Loading active warnings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Active Warnings</h1>
        <p className="text-slate-500">Locations currently flagged with elevated climate risks.</p>
      </div>

      <div className="flex gap-2 pb-4 overflow-x-auto">
        {['All', 'Critical', 'Very High', 'High', 'Moderate'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === f 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredWarnings.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-500">
          <div className="mx-auto bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-slate-300" />
          </div>
          <p className="text-lg">No warnings match the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWarnings.map((warning) => (
            <div key={warning.id} className="glass-panel overflow-hidden transition-all hover:shadow-md border-l-4" style={{
              borderLeftColor: 
                warning.riskCategory === 'Critical' ? '#EF4444' :
                warning.riskCategory === 'Very High' ? '#F97316' :
                warning.riskCategory === 'High' ? '#F59E0B' : '#EAB308'
            }}>
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold text-white ${
                      warning.riskCategory === 'Critical' ? 'bg-red-500' :
                      warning.riskCategory === 'Very High' ? 'bg-orange-500' :
                      warning.riskCategory === 'High' ? 'bg-amber-500' : 'bg-yellow-500'
                    }`}>
                      {warning.riskCategory.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                      <Clock size={14} /> 
                      {new Date(warning.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MapPin size={20} className="text-slate-400" />
                    {warning.location}
                  </h3>
                  
                  <p className="text-slate-600 font-medium">
                    {warning.drivers.join(' + ')}
                  </p>
                </div>
                
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Risk Score</p>
                    <p className="text-3xl font-extrabold text-slate-900">{warning.riskScore}</p>
                  </div>
                  <Link 
                    to={`/dashboard?hotspot=${warning.id}`} 
                    className="text-climate-blue text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
