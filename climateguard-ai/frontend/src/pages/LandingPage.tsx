import { Link } from 'react-router-dom';
import { ArrowRight, ShieldAlert, BrainCircuit, Activity } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full text-center py-20 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-climate-blue/10 text-climate-blue font-semibold text-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-climate-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-climate-blue"></span>
          </span>
          Live Demonstration Dataset Active
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          ClimateGuard <span className="text-transparent bg-clip-text bg-gradient-to-r from-climate-blue to-climate-green">AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10">
          AI-Powered Early Warning System for Climate Hotspots. Detecting emerging risks before they become disasters.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/dashboard" className="px-8 py-4 bg-climate-blue text-white rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
            Explore Climate Risks
            <ArrowRight size={20} />
          </Link>
          <Link to="/dashboard" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            View Live Hotspots
          </Link>
        </div>
      </section>

      {/* Problem & Impact */}
      <section className="w-full max-w-5xl py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-panel p-8">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <ShieldAlert className="text-red-600 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Detect</h3>
            <p className="text-slate-600">
              Continuously monitoring temperature, rainfall, and drought indices to identify rapidly developing climate anomalies.
            </p>
          </div>
          <div className="glass-panel p-8">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <BrainCircuit className="text-blue-600 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Analyze</h3>
            <p className="text-slate-600">
              Transforming complex climate signals into explainable insights using generative AI and weighted risk engines.
            </p>
          </div>
          <div className="glass-panel p-8">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Activity className="text-green-600 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Warn</h3>
            <p className="text-slate-600">
              Issuing actionable early warnings to empower local communities and decision-makers before a crisis hits.
            </p>
          </div>
        </div>
      </section>
      
      {/* Tech Section */}
      <section className="w-full text-center py-16 px-4">
        <h2 className="text-3xl font-bold mb-8">Powered By Modern Tech</h2>
        <div className="flex flex-wrap justify-center gap-4 text-slate-500 font-medium">
          <span className="px-4 py-2 bg-slate-100 rounded-lg">React & TypeScript</span>
          <span className="px-4 py-2 bg-slate-100 rounded-lg">Node.js & Express</span>
          <span className="px-4 py-2 bg-slate-100 rounded-lg">LLM Integration</span>
          <span className="px-4 py-2 bg-slate-100 rounded-lg">Interactive Mapping</span>
        </div>
      </section>
    </div>
  );
};
