import React from 'react';
import { Bell, Search, Globe, User, Flame, Check } from 'lucide-react';

export default function Header({ activeTab, userProfile }) {
  // Map page names to titles
  const pageTitles = {
    '/': 'Dashboard Overview',
    '/ai-assistant': 'AI Civic Assistant',
    '/schemes': 'Government Scheme Finder',
    '/complaints': 'AI Complaint Generator',
    '/explainer': 'Legal Document Explainer',
    '/optimizer': 'Civic Prompt Optimizer',
    '/prompt-studio': 'AI Prompt Studio',
    '/settings': 'Application Settings'
  };

  // Get localized Indian greeting based on local time
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Namaste, Shubh Prabhat';
    if (hrs < 16) return 'Namaste, Shubh Dopahar';
    return 'Namaste, Shubh Sandhya';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Tricolor Accent Line */}
      <div className="tricolor-stripe w-full" />
      
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Title Block */}
        <div>
          <h1 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            {pageTitles[activeTab] || 'Smart Bharat'}
            {activeTab === '/' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Portal Active
              </span>
            )}
          </h1>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 hidden sm:block">
            {getGreeting()}, {userProfile.name || 'Citizen'} • Empowering communities through smart governance.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search portal services..."
              className="w-56 pl-9 pr-4 py-1.5 bg-slate-50 text-slate-700 placeholder-slate-400 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all duration-200"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Quick status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold tracking-wide uppercase">
            <Flame className="w-3.5 h-3.5 text-saffron fill-saffron animate-pulse" />
            <span>Digital India Online</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-100/80 rounded-lg transition-all relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-saffron rounded-full border border-white"></span>
            </button>
            
            <button className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-100/80 rounded-lg transition-all">
              <Globe className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-sky-700 text-white flex items-center justify-center font-bold text-sm border border-sky-500/20 shadow-sm">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-none">{userProfile.name || 'Citizen User'}</div>
              <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{userProfile.state || 'India'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
