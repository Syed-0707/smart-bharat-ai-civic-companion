import React, { useState } from 'react';
import { Sparkles, Play, Clipboard, Check, HelpCircle, Loader2, AlertCircle, Shield, Cpu } from 'lucide-react';
import { generateResponse } from '../services/ai';

export default function PromptStudio() {
  const [originalPrompt, setOriginalPrompt] = useState('ask municipal office to repair the road');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // States to hold optimized parts and the final live output
  const [optimizations, setOptimizations] = useState(null);
  const [geminiResponse, setGeminiResponse] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  const samplePrompts = {
    water: "complain about dirty drinking water coming in our taps",
    lights: "report that streetlights are off in our market lane at night",
    waste: "ask municipality to clean the overflowing trash bin near park"
  };

  const handleLoadSample = (key) => {
    setOriginalPrompt(samplePrompts[key]);
    setOptimizations(null);
    setGeminiResponse('');
  };

  const handleOptimizeAndRun = async (e) => {
    e.preventDefault();
    if (!originalPrompt.trim()) {
      alert("Please enter a basic query or choose a sample.");
      return;
    }

    setLoading(true);
    setError('');
    setGeminiResponse('');

    try {
      // 1. Define prompt engineering techniques based on user's query
      const roleText = "You are a Chief administrative Officer and Senior Legal Officer for Indian Municipal Grievances.";
      const roleExplanation = "Role prompting forces the AI model to adopt a professional persona, use specialized legal terminology, and speak with official authority rather than a generic conversational tone.";

      const contextText = `Citizen Input: "${originalPrompt}"\nTarget Department: Municipal Nodal Grievance Unit\nLocation Context: Ward 14, Dwarka Sector 6, New Delhi\nGrievance Status: Active & Unresolved.`;
      const contextExplanation = "Context injection feeds specific details (locations, departments, timelines) into the AI, ensuring it does not hallucinate or write broad statements unrelated to the exact issue.";

      const structureText = `Output Format Structure:\n1. EXECUTIVE SUMMARY (3-sentence breakdown)\n2. IMMEDIATE DANGER ASSESSMENT (Public health or traffic risk)\n3. OFFICIAL RESOLUTION PETITION (Formally addressed)\n4. CITIZEN ATTACHMENT CHECKLIST`;
      const structureExplanation = "Structured output dictates the exact layout and section headers of the response, making it easier for human operators to parse and file.";

      const constraintText = "Constraints: Maintain a firm yet polite tone. Limit output to 250 words. Do not assume municipal funding allocations. Avoid emotional language. Every response must be short, professional, and easy to understand.";
      const constraintExplanation = "Constraint prompting restricts word count, prevents the AI from making wild budget assumptions, keeps the text objective, and ensures the output is concise and clear.";

      // 2. Combine into final optimized prompt
      const compiledOptimizedPrompt = `SYSTEM PERSONA:\n${roleText}\n\nCONTEXT PARAMETERS:\n${contextText}\n\nSTRUCTURE DIRECTIVES:\n${structureText}\n\nCONSTRAINTS:\n${constraintText}\n\nPrompt Task: Using the system parameters above, draft the final grievance letter. After the response layout, append a section '### Suggested Follow-ups:' with exactly 3 relevant queries.`;

      setOptimizations({
        role: { prompt: roleText, explain: roleExplanation },
        context: { prompt: contextText, explain: contextExplanation },
        structure: { prompt: structureText, explain: structureExplanation },
        constraint: { prompt: constraintText, explain: constraintExplanation },
        compiled: compiledOptimizedPrompt
      });

      // 3. Send final optimized prompt to Gemini
      const responseText = await generateResponse(compiledOptimizedPrompt);
      setGeminiResponse(responseText);
    } catch (err) {
      console.error("Prompt Studio API Error:", err);
      setError(err.message || "Failed to communicate with Gemini. Please check your VITE_GEMINI_API_KEY in the .env file.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Helper to parse response text lines into simple paragraphs and bolding tags
  const renderResponseText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      let cleanLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (cleanLine.startsWith('#') || cleanLine.match(/^\d+\./)) {
        return <p key={idx} className="font-extrabold text-slate-800 text-xs mt-2 first:mt-0 uppercase tracking-wider border-b border-slate-100 pb-1" dangerouslySetInnerHTML={{ __html: cleanLine }} />;
      }
      return <p key={idx} className="mb-1 text-slate-650 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: cleanLine }} />;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">AI Prompt Studio</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Learn prompt engineering. Inspect how Role, Context, Structure, and Constraints refine simple inputs, and test them live.
        </p>
      </div>

      {/* Grid panels */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        
        {/* PANEL 1: Original Prompt (Left Column) */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-855 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-sky-655" />
            Panel 1: Original Prompt
          </h3>

          {/* Quick chips */}
          <div className="space-y-1">
            <label className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Select Demo Case</label>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleLoadSample('water')}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-left text-slate-650 truncate transition-colors cursor-pointer"
              >
                Dirty tap water supply
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('lights')}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-left text-slate-655 truncate transition-colors cursor-pointer"
              >
                Broken streetlights
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('waste')}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-left text-slate-655 truncate transition-colors cursor-pointer"
              >
                Overflowing trash bins
              </button>
            </div>
          </div>

          <form onSubmit={handleOptimizeAndRun} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">Enter Basic Instruction</label>
              <textarea
                value={originalPrompt}
                onChange={(e) => { setOriginalPrompt(e.target.value); setOptimizations(null); setGeminiResponse(''); }}
                rows="6"
                placeholder="e.g. ask office to clear the water clog..."
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white resize-none form-input-focus font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sky-700 hover:bg-sky-655 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-700/10 hover:shadow-sky-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider disabled:bg-slate-200 disabled:text-slate-400"
            >
              {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin text-slate-400" /> : <Sparkles className="w-4 h-4 text-saffron fill-saffron" />}
              Optimize & Call Gemini
            </button>
          </form>
        </div>

        {/* PANEL 2: Optimized Prompt Breakdown (Middle Column) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 h-[550px] overflow-y-auto">
            <h3 className="font-extrabold text-slate-855 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              Panel 2: Prompt engineering
            </h3>

            {optimizations ? (
              <div className="space-y-4.5">
                {/* Role Prompting */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-saffron uppercase tracking-wider">1. Role Prompting</span>
                    <span className="text-[8px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase tracking-wider">Expertise Persona</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[10px] font-mono text-slate-700 leading-normal">
                    {optimizations.role.prompt}
                  </div>
                  <p className="text-[9px] text-slate-450 leading-relaxed font-semibold italic">
                    💡 {optimizations.role.explain}
                  </p>
                </div>

                {/* Context Injection */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">2. Context Injection</span>
                    <span className="text-[8px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase tracking-wider">Precise Data</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[10px] font-mono text-slate-700 leading-normal whitespace-pre-line">
                    {optimizations.context.prompt}
                  </div>
                  <p className="text-[9px] text-slate-455 leading-relaxed font-semibold italic">
                    💡 {optimizations.context.explain}
                  </p>
                </div>

                {/* Structured Output */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">3. Structured Output</span>
                    <span className="text-[8px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase tracking-wider">Sections</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[10px] font-mono text-slate-700 leading-normal whitespace-pre-line">
                    {optimizations.structure.prompt}
                  </div>
                  <p className="text-[9px] text-slate-455 leading-relaxed font-semibold italic">
                    💡 {optimizations.structure.explain}
                  </p>
                </div>

                {/* Constraint Prompting */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">4. Constraint Prompting</span>
                    <span className="text-[8px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase tracking-wider">Boundaries</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[10px] font-mono text-slate-700 leading-normal">
                    {optimizations.constraint.prompt}
                  </div>
                  <p className="text-[9px] text-slate-455 leading-relaxed font-semibold italic">
                    💡 {optimizations.constraint.explain}
                  </p>
                </div>

                {/* Copy Compiled button */}
                <button
                  onClick={() => handleCopy(optimizations.compiled, 'compiled')}
                  className="w-full py-2 bg-slate-50 hover:bg-sky-50 border border-slate-250 text-slate-650 hover:text-sky-750 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer"
                >
                  {copiedKey === 'compiled' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                  {copiedKey === 'compiled' ? 'Prompt Copied' : 'Copy Full Compiled Prompt'}
                </button>
              </div>
            ) : (
              <div className="text-center py-24 text-slate-400 space-y-3 font-medium">
                <HelpCircle className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-xs max-w-xs mx-auto leading-relaxed">
                  Provide a raw request in Panel 1 and select "Optimize & Call Gemini" to view the prompt engineering structure.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* PANEL 3: Gemini Response (Right Column) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 h-[550px] overflow-y-auto relative">
            {/* Saffron white green top stripe decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron via-white to-green-flag"></div>
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mt-1 min-h-[30px]">
              <h3 className="font-extrabold text-slate-855 text-xs uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                Panel 3: Gemini Response
              </h3>
              {geminiResponse && (
                <button
                  onClick={() => handleCopy(geminiResponse, 'response')}
                  className="p-1.5 text-slate-450 hover:text-sky-655 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg transition-all"
                  title="Copy Response text"
                >
                  {copiedKey === 'response' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-xs flex gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-semibold">
                  {error}
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-24 space-y-4 flex flex-col justify-center items-center font-medium">
                <Loader2 className="w-9 h-9 text-sky-600 animate-spin" />
                <h4 className="font-bold text-slate-700 text-xs">Querying Gemini API...</h4>
                <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                  Executing the fully optimized, role-prompted prompt against the Gemini-2.5-Flash model.
                </p>
              </div>
            ) : geminiResponse ? (
              <div className="text-[11px] font-medium bg-slate-50/50 p-4 border border-slate-200 rounded-xl max-h-[460px] overflow-y-auto space-y-2.5">
                {renderResponseText(geminiResponse)}
              </div>
            ) : (
              <div className="text-center py-24 text-slate-400 space-y-3 font-medium">
                <HelpCircle className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-xs max-w-xs mx-auto leading-relaxed">
                  The model response outputs will be displayed here once prompt optimization completes.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
