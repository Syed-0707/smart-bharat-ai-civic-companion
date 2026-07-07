import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquareCode, 
  Search, 
  FileEdit, 
  FileText, 
  Sparkles, 
  Settings,
  ChevronRight,
  Shield,
  Users,
  Building,
  CheckCircle,
  ArrowUpRight,
  Zap,
  Globe
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const services = [
    {
      title: "AI Civic Assistant",
      desc: "Instant responses on municipal regulations, water bills, property tax procedures, and local citizen charters.",
      path: "/ai-assistant",
      icon: MessageSquareCode,
      iconColor: "text-sky-600 bg-sky-500/10 border-sky-200/20",
      badge: "Popular AI",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200"
    },
    {
      title: "Scheme Eligibility Finder",
      desc: "Input age, income, and category to match with welfare grants, farmer funds, and student scholarships.",
      path: "/schemes",
      icon: Search,
      iconColor: "text-amber-600 bg-amber-500/10 border-amber-200/20",
      badge: "National",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      title: "AI Complaint Generator",
      desc: "Draft professional complaints to Municipal Corporations, Water Boards, or Traffic Police with print-ready layouts.",
      path: "/complaints",
      icon: FileEdit,
      iconColor: "text-indigo-600 bg-indigo-500/10 border-indigo-200/20",
      badge: "Formal Doc",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
    },
    {
      title: "Document Explainer",
      desc: "Translate bureaucratic legal notices and land property tax instructions into clear, simple English.",
      path: "/explainer",
      icon: FileText,
      iconColor: "text-emerald-600 bg-emerald-500/10 border-emerald-200/20",
      badge: "New Release",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      title: "Civic Prompt Optimizer",
      desc: "Refine basic problem descriptions into persuasive prompts tailored for PG portals or official letters.",
      path: "/optimizer",
      icon: Sparkles,
      iconColor: "text-purple-600 bg-purple-500/10 border-purple-200/20",
      badge: "AI Utility",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      title: "Portal Settings",
      desc: "Change application language (Hindi, Tamil, English), edit user profiles, and check active helpdesks.",
      path: "/settings",
      icon: Settings,
      iconColor: "text-slate-600 bg-slate-500/10 border-slate-200/20",
      badge: "System",
      badgeColor: "bg-slate-50 text-slate-700 border-slate-200"
    }
  ];

  const stats = [
    { label: "Welfare Schemes Registry", value: "350+", icon: Shield, color: "text-saffron bg-orange-50 border-orange-100" },
    { label: "Grievances Resolved", value: "8.4 Million", icon: CheckCircle, color: "text-green-flag bg-emerald-50 border-emerald-100" },
    { label: "Connected Citizens", value: "12.8M+", icon: Users, color: "text-sky-600 bg-sky-50 border-sky-100" },
    { label: "Active Municipalities", value: "85+", icon: Building, color: "text-indigo-600 bg-indigo-50 border-indigo-100" }
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-grid-pattern">
        
        {/* Glow Spheres */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-saffron/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-flag/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-5 max-w-xl text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-saffron/10 text-saffron border border-saffron/20">
            <Zap className="w-3 h-3 fill-saffron" />
            <span>Digital India Citizen Platform</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Empowering Citizens via <span className="bg-gradient-to-r from-saffron via-white to-green-flag bg-clip-text text-transparent">Smart AI</span> Technology
          </h2>
          
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            Smart Bharat is your intelligent civic dashboard. File local complaints, verify eligibility for social security grants, optimize prompts, and translate legal notices instantly.
          </p>
          
          <div className="pt-3 flex flex-wrap justify-center md:justify-start gap-4">
            <button 
              onClick={() => navigate('/ai-assistant')}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              Start Chat Companion
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/schemes')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Find Subsidies & Schemes
            </button>
          </div>
        </div>

        {/* Ashoka Motif & Stats preview bubble */}
        <div className="relative z-10 shrink-0 hidden md:block">
          <div className="w-44 h-44 opacity-20 text-white animate-pulse" style={{ animationDuration: '4s' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
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
          </div>
          {/* Floating pill */}
          <div className="absolute top-10 -left-6 bg-slate-850/90 border border-slate-700 backdrop-blur-md rounded-2xl p-3 shadow-xl animate-float flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase">Gateway status</div>
              <div className="text-xs font-bold text-emerald-400">99.98% Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Statistics Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md hover:border-slate-300 transition-all">
              <div className={`p-3 rounded-xl border ${stat.color} shrink-0`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">{stat.value}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Cards Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Available AI Services</h3>
            <p className="text-xs text-slate-400 mt-0.5">Mock-integrated utilities for direct client testing</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
            7 Active Modules
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div 
                key={idx} 
                onClick={() => navigate(srv.path)}
                className="group cursor-pointer bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-sky-300 transition-all duration-300 flex flex-col justify-between hover-card-trigger relative overflow-hidden"
              >
                {/* Subtle Tricolor Ribbon on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron via-white to-green-flag opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl border ${srv.iconColor} transition-all duration-300 group-hover:scale-105`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    {srv.badge && (
                      <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase border tracking-wider ${srv.badgeColor}`}>
                        {srv.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-800 group-hover:text-sky-600 transition-colors text-sm flex items-center gap-1.5">
                      {srv.title}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-sky-600" />
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-sky-600 transition-colors font-bold uppercase tracking-wider text-[10px]">
                  <span>Launch Service</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
