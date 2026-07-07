import React, { useState } from 'react';
import { Sparkles, Clipboard, Check, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';

export default function PromptOptimizer() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [optimized, setOptimized] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const samplePrompts = {
    sewer: "tell local office that sewer is leaking since yesterday and water is filling up the lane",
    roads: "write a mail to municipal engineer to patch potholes in our market road because cars are getting damaged",
    noise: "complain about loud music speaker being played after 11 PM near residential society flat numbers"
  };

  const handleLoadSample = (key) => {
    setInputPrompt(samplePrompts[key]);
    setOptimized(null);
  };

  const handleOptimize = () => {
    if (!inputPrompt.trim()) {
      alert("Please enter a basic query or choose a sample prompt.");
      return;
    }

    const text = inputPrompt.toLowerCase();
    
    let topic = "civic grievance";
    let locationPlaceholder = "[Insert Exact Street Address/Sector, City]";
    
    if (text.includes('sewer') || text.includes('drain') || text.includes('water')) {
      topic = "clogged drainage/sewer overflow";
    } else if (text.includes('pothole') || text.includes('road') || text.includes('highway')) {
      topic = "pothole repairs and road maintenance";
    } else if (text.includes('noise') || text.includes('music') || text.includes('speaker')) {
      topic = "unregulated noise pollution after permissible hours";
    }

    const formal = `To,\nThe Assistant Engineer / Nodal Grievance Officer,\n[Local Ward Authority Office],\n${locationPlaceholder}\n\nSubject: Formal Notification of Grievance regarding ${topic} at [Insert Ward/Sector]\n\nDear Sir/Madam,\n\nI am writing in my capacity as a resident of [Insert Locality] to register a formal complaint regarding ${topic}.\n\nContext of Issue:\n${inputPrompt}\n\nThis issue has been persistent, causing inconvenience, traffic bottlenecking, or potential sanitation risks. We request your immediate intervention to direct the relevant field inspector to conduct a site review and initiate repairs.\n\nThank you for your prompt attention to this matter.\n\nYours faithfully,\n[Your Name]\n[Contact Information]`;

    const social = `Appalling state of ${topic} at [Locality/Road Name]. ${inputPrompt.slice(0, 100)}... residents facing severe trouble daily. Requesting immediate action from local authorities. \n\nCC: @[LocalMunicipalCorp] @[StateGrievanceHandle] @PMOIndia\n\n#CivicResponsibility #CleanIndia #Governance`;

    const letter = `FROM:\n[Your Name],\n[Your Building/Flat Address],\n[City, State]\n\nDATE: [Insert Date]\n\nTO:\nThe Chief Executive Officer / Commissioner,\n[Concerned Department/Agency Name],\n[City Head Office]\n\nSUBJECT: PETITION REGARDING ${topic.toUpperCase()} AT [LOCALITY]\n\nRespected Sir/Madam,\n\nThrough this petition, we, the residents of [Locality], wish to draw your personal attention to the critical issue of ${topic} occurring in our sector.\n\nDespite repeated complaints, the issue persists: "${inputPrompt}".\n\nWe request you to prioritize this request and sanction repairs or emergency actions under the civic maintenance budget of this quarter. We look forward to your support.\n\nThank you.\n\nYours sincerely,\n\n___________________\n[Name & Signatures of Residents]`;

    setOptimized({ formal, social, letter });
    setCopiedKey(null);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleClear = () => {
    setInputPrompt('');
    setOptimized(null);
    setCopiedKey(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Civic Prompt Optimizer</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Transform rough descriptions into highly detailed, formal, and structured templates for official portals or social media queries.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Left Inputs (2/5 width) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
                Raw Query Input
              </h3>
              <button 
                onClick={handleClear}
                className="text-[10px] uppercase font-bold text-slate-400 hover:text-sky-655 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Samples */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Quick Samples</label>
              <div className="flex flex-col gap-2">
                {['sewer', 'roads', 'noise'].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleLoadSample(key)}
                    className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs text-left text-slate-700 border border-slate-200 rounded-xl transition-all truncate font-medium cursor-pointer"
                  >
                    {key === 'sewer' ? 'Sewer drainage leak' : key === 'roads' ? 'Market road potholes' : 'Residential noise pollution'}
                  </button>
                ))}
              </div>
            </div>

            {/* Input prompt area */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-655">Enter Your Raw Description</label>
              <textarea
                value={inputPrompt}
                onChange={(e) => { setInputPrompt(e.target.value); setOptimized(null); }}
                rows="6"
                placeholder="Simply describe the issue (e.g. 'water is dirty and kids are falling sick')..."
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white resize-none form-input-focus"
              />
            </div>

            <button
              onClick={handleOptimize}
              className="w-full py-3 bg-sky-700 hover:bg-sky-655 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-700/10 hover:shadow-sky-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-saffron fill-saffron" />
              Enhance Descriptions
            </button>
          </div>

          <div className="bg-sky-50 border border-sky-100/60 rounded-2xl p-4 text-[10px] text-sky-850 flex items-start gap-2.5 shadow-3xs font-medium leading-relaxed">
            <AlertCircle className="w-5 h-5 text-sky-600 shrink-0" />
            <div>
              <span className="font-bold">Optimization value:</span> Stating exact context logs and reference placeholders prevents immediate portal dismissal by administrators.
            </div>
          </div>
        </div>

        {/* Right Output Panels (3/5 width) */}
        <div className="lg:col-span-3 space-y-6">
          {optimized ? (
            <div className="space-y-6">
              
              {/* Option 1: PG Portal/Email */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden group hover-card-trigger">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-saffron"></div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="font-extrabold text-slate-850 text-[10px] uppercase tracking-wider">
                    Option 1: Central PG Portal / Email
                  </h4>
                  <button
                    onClick={() => handleCopy(optimized.formal, 'formal')}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-sky-50 text-[10px] text-slate-600 hover:text-sky-700 border border-slate-200 hover:border-sky-300 rounded-xl transition-all flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer shadow-3xs"
                  >
                    {copiedKey === 'formal' ? <Check className="w-3 h-3 text-green-500" /> : <Clipboard className="w-3 h-3" />}
                    {copiedKey === 'formal' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="font-mono text-[10px] text-slate-700 bg-slate-50 p-4 border border-slate-200/80 rounded-xl max-h-[170px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {optimized.formal}
                </pre>
              </div>

              {/* Option 2: Written Petition */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden group hover-card-trigger">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-400"></div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="font-extrabold text-slate-850 text-[10px] uppercase tracking-wider">
                    Option 2: Formal Written Petition
                  </h4>
                  <button
                    onClick={() => handleCopy(optimized.letter, 'letter')}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-sky-50 text-[10px] text-slate-600 hover:text-sky-700 border border-slate-200 hover:border-sky-300 rounded-xl transition-all flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer shadow-3xs"
                  >
                    {copiedKey === 'letter' ? <Check className="w-3 h-3 text-green-500" /> : <Clipboard className="w-3 h-3" />}
                    {copiedKey === 'letter' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="font-mono text-[10px] text-slate-700 bg-slate-50 p-4 border border-slate-200/80 rounded-xl max-h-[170px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {optimized.letter}
                </pre>
              </div>

              {/* Option 3: Social Media Grievance */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden group hover-card-trigger">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-flag"></div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="font-extrabold text-slate-850 text-[10px] uppercase tracking-wider">
                    Option 3: Social Media Grievance (X / Twitter)
                  </h4>
                  <button
                    onClick={() => handleCopy(optimized.social, 'social')}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-sky-50 text-[10px] text-slate-600 hover:text-sky-700 border border-slate-200 hover:border-sky-300 rounded-xl transition-all flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer shadow-3xs"
                  >
                    {copiedKey === 'social' ? <Check className="w-3 h-3 text-green-500" /> : <Clipboard className="w-3 h-3" />}
                    {copiedKey === 'social' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="font-mono text-[10px] text-slate-700 bg-slate-50 p-4 border border-slate-200/80 rounded-xl max-h-[170px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {optimized.social}
                </pre>
              </div>

            </div>
          ) : (
            <div className="bg-slate-100 border border-dashed border-slate-250 rounded-2xl p-16 text-center space-y-4 h-[480px] flex flex-col justify-center items-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-200/50 border border-slate-200 flex items-center justify-center text-slate-400">
                <HelpCircle className="w-6.5 h-6.5" />
              </div>
              <h4 className="font-extrabold text-slate-700 text-sm">No Prompts Optimized</h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                Type in a raw complaint on the left and select "Enhance Descriptions" to generate output options.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
