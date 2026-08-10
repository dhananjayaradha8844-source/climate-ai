import { Outlet, Link, useLocation } from 'react-router-dom';
import { Globe, LayoutDashboard, AlertTriangle, Activity, FileText } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Warnings', path: '/warnings', icon: <AlertTriangle size={18} /> },
    { name: 'Historical', path: '/historical', icon: <Activity size={18} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={18} /> },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="p-2 bg-climate-blue/10 rounded-lg">
                <Globe className="h-6 w-6 text-climate-blue" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">ClimateGuard <span className="text-climate-blue">AI</span></span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-climate-blue border-b-2 border-climate-blue'
                      : 'text-slate-500 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 ClimateGuard AI. Early Warning System for Climate Hotspots.
          </p>
          <div className="text-sm text-slate-400">
            Hackathon Demonstration Model
          </div>
        </div>
      </footer>
    </div>
  );
};
