import React, { useState } from 'react';
import { Settings, User, Globe, Shield, PhoneCall, Check, Save } from 'lucide-react';

export default function SettingsPage({ userProfile, setUserProfile }) {
  const [name, setName] = useState(userProfile.name);
  const [state, setState] = useState(userProfile.state);
  const [city, setCity] = useState(userProfile.city || 'Dwarka');
  const [language, setLanguage] = useState('English');
  const [themeAccent, setThemeAccent] = useState('Blue');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const statesList = [
    'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 
    'Maharashtra', 'Punjab', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile({
      name,
      state,
      city
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const helplineContacts = [
    { title: "National Consumer Helpline", phone: "1915", times: "24/7 National Line" },
    { title: "PG Portal Central Grievance Desk", phone: "1800-11-7377", times: "9 AM - 6 PM" },
    { title: "UIDAI Aadhaar Support Center", phone: "1947", times: "Toll-Free Helpline" },
    { title: "Cyber Crime Emergency Cell", phone: "1930", times: "24/7 Emergency Line" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Portal Configuration & Directory</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Update your public citizen profile records, customize system languages, and look up national help desks.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Profile Card & Settings Panel (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-sky-600 animate-pulse" />
              Citizen User Credentials
            </h3>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">Citizen Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
              />
            </div>

            {/* City & State */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">City / Ward District</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dwarka"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">State Registry</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
                >
                  {statesList.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* App Customization Section */}
            <div className="pt-4 border-t border-slate-100/80 space-y-4">
              <h3 className="font-extrabold text-slate-850 text-[10px] uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                Localization & Accent themes
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Language selection */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">Preferred Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
                  >
                    {['English', 'Hindi (हिंदी)', 'Tamil (தமிழ்)', 'Telugu (తెలుగు)', 'Marathi (मराठी)'].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                {/* Accent selector */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">Interface Accent Style</label>
                  <select
                    value={themeAccent}
                    onChange={(e) => setThemeAccent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
                  >
                    {['Blue', 'Indian Flag Theme'].map((th) => (
                      <option key={th} value={th}>{th}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="alerts"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4.5 h-4.5 mt-0.5"
                />
                <label htmlFor="alerts" className="text-xs text-slate-500 font-semibold select-none cursor-pointer leading-relaxed">
                  Send periodic summaries of new welfare schemes matching my profile registry.
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100/80">
              <span className="text-[10px] text-slate-400 font-medium">
                *Settings are saved locally inside your active session context.
              </span>
              <button
                type="submit"
                className="px-4.5 py-2.5 bg-sky-700 hover:bg-sky-655 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-700/10 hover:shadow-sky-700/20 transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                {saved ? 'Settings Saved' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>

        {/* Directory (1/3 width) */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-saffron fill-saffron animate-bounce" />
              National Help Desk Directory
            </h3>

            <div className="space-y-3">
              {helplineContacts.map((contact, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 hover-card-trigger">
                  <div className="text-xs font-bold text-slate-700 leading-tight">{contact.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-sky-750">{contact.phone}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{contact.times}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 text-[10px] leading-relaxed space-y-2.5 relative overflow-hidden shadow-md">
            {/* flag stripe detail */}
            <div className="absolute top-0 left-0 right-0 h-1 tricolor-stripe"></div>
            
            <div className="font-bold text-saffron uppercase flex items-center gap-1.5 tracking-wider">
              <Shield className="w-3.5 h-3.5 text-white animate-pulse" />
              Digital Integrity Seal
            </div>
            <p className="text-slate-300 font-medium leading-relaxed">
              This Smart Bharat dashboard operates on standard local simulation logic. It is optimized for client-side evaluation without requiring backend database subscriptions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
