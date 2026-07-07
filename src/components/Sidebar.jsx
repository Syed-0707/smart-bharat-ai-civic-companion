import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MessageSquareCode, 
  Search, 
  FileEdit, 
  FileText, 
  Sparkles, 
  Settings,
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { path: '/', label: 'Home Dashboard', icon: Home, badge: null },
    { path: '/ai-assistant', label: 'AI Assistant', icon: MessageSquareCode, badge: 'AI' },
    { path: '/schemes', label: 'Scheme Finder', icon: Search, badge: 'Welfare' },
    { path: '/complaints', label: 'Complaint Gen', icon: FileEdit, badge: 'Draft' },
    { path: '/explainer', label: 'Doc Explainer', icon: FileText, badge: 'New' },
    { path: '/optimizer', label: 'Prompt Optimizer', icon: Sparkles, badge: null },
    { path: '/prompt-studio', label: 'AI Prompt Studio', icon: Sparkles, badge: 'Learn' },
    { path: '/settings', label: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <aside className="w-64 glass-sidebar text-slate-100 flex flex-col border-r border-slate-800 shrink-0 h-screen sticky top-0 z-50">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/60 flex items-center gap-3.5 bg-slate-950/20">
        {/* Ashoka Chakra SVG Logo */}
        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center relative p-1.5 shadow-lg shadow-sky-950/40 shrink-0 border border-slate-700/50">
          <svg viewBox="0 0 100 100" className="w-full h-full text-navy-flag animate-spin" style={{ animationDuration: '40s' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)}
                y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ))}
          </svg>
          {/* Subtle Accent Dots */}
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-saffron border border-slate-900 shadow-sm"></span>
          <span className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-green-flag border border-slate-900 shadow-sm"></span>
        </div>
        
        <div>
          <div className="font-extrabold text-base tracking-tight leading-none bg-gradient-to-r from-saffron via-white to-green-flag bg-clip-text text-transparent">
            SMART BHARAT
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-bold tracking-widest uppercase">
            AI Civic Companion
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto bg-slate-900/10">
        <div className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider px-3 mb-3 flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-sky-400" />
          <span>Core Services</span>
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-sky-600/95 text-white shadow-md shadow-sky-500/10 border border-sky-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'
                    }`} />
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                  
                  {/* Badge */}
                  {item.badge && (
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      item.badge === 'AI' 
                        ? 'bg-saffron/10 text-saffron border border-saffron/30 animate-pulse' 
                        : item.badge === 'New' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : item.badge === 'Welfare'
                        ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                        : 'bg-slate-700 text-slate-300 border border-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Active Indicator Accent bar */}
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-saffron rounded-r-md"></div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info / Grievance Rate widget */}
      <div className="p-5 border-t border-slate-800/60 bg-slate-950/30 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-semibold mb-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-saffron animate-bounce" />
          <span className="tracking-wide">National Grievance Rate</span>
        </div>
        <div className="text-[11px] text-emerald-400 flex items-center justify-between font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-green-flag" />
            94.2% Resolved (Q2)
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        
        {/* Flag Tricolor strip */}
        <div className="flex h-1 mt-4 rounded-full overflow-hidden tricolor-glow">
          <div className="flex-1 bg-saffron"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-green-flag"></div>
        </div>
      </div>
    </aside>
  );
}
