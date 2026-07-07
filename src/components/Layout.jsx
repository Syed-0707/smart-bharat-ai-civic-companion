import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ userProfile }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky top header */}
        <Header activeTab={currentPath} userProfile={userProfile} />

        {/* Scrollable container with dot-grid pattern background */}
        <main className="flex-1 overflow-y-auto bg-slate-50 bg-dot-pattern relative p-6 md:p-8">
          {/* Subtle top decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-b from-sky-100/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto w-full relative z-10">
            <Outlet />
          </div>
          
          {/* Dashboard footer */}
          <footer className="mt-12 text-center text-xs text-slate-400 border-t border-slate-200/60 pt-6 pb-4">
            Smart Bharat National Citizen Portal • Powered by AI & Digital India Initiatives • © 2026 Government of India (Mockup)
          </footer>
        </main>
      </div>
    </div>
  );
}
