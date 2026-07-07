import React, { useState, useMemo, useEffect } from 'react';
import { schemes as localSchemes } from '../data/schemes';
import { Search, SlidersHorizontal, Check, AlertCircle, RefreshCw, ExternalLink, ShieldCheck, UserCheck, Sparkles, Loader2, CheckCircle, Info } from 'lucide-react';
import { generateResponse } from '../services/ai';

export default function SchemeFinder() {
  // Input fields
  const [age, setAge] = useState('24');
  const [gender, setGender] = useState('All');
  const [category, setCategory] = useState('Student');
  const [state, setState] = useState('Delhi');
  const [income, setIncome] = useState('2.5L');
  
  // API loading states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aiSchemes, setAiSchemes] = useState(null); // null triggers static local catalog, array triggers Gemini recommendations
  const [aiSuggestions, setAiSuggestions] = useState([]); // holds Gemini suggested next steps

  // Dropdown lists
  const categories = [
    'All',
    'Student',
    'Farmer',
    'Women',
    'Self-Employed / Vendor',
    'Artisan / Craftsman',
    'Business Owner / Entrepreneur'
  ];

  const incomeLevels = [
    { value: 'All', label: 'No Limit (Show All)' },
    { value: 'BPL', label: 'Below Poverty Line (BPL)' },
    { value: '2.5L', label: 'Below ₹2.5 Lakhs / year' },
    { value: '6L', label: 'Below ₹6 Lakhs / year' },
    { value: '8L', label: 'Below ₹8 Lakhs / year' }
  ];

  const statesList = [
    'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 
    'Maharashtra', 'Punjab', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'
  ];

  const gendersList = [
    'All', 'Male', 'Female', 'Transgender'
  ];

  // Reset filters to local default state
  const handleReset = () => {
    setAge('');
    setGender('All');
    setCategory('All');
    setState('Delhi');
    setIncome('All');
    setAiSchemes(null);
    setAiSuggestions([]);
    setError('');
    setSuccess('');
  };

  // Find schemes utilizing Gemini API
  const handleFindSchemesAI = async (e) => {
    e.preventDefault();
    if (!age) {
      alert("Please enter a valid age.");
      return;
    }
    
    setLoading(true);
    setLoadingStep(1);
    setError('');
    setSuccess('');

    // Start progress step interval
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : 3));
    }, 1500);
    
    try {
      const systemInstruction = `You are a professional Indian Government Schemes Advisor.
Your job is to analyze the user's demographic profile (Age, Gender, Occupation, State, Income) and recommend 3-4 highly relevant Indian government welfare schemes (Central or State schemes).

You must return exactly a JSON object, and absolutely nothing else. Do not include markdown code block syntax (like \`\`\`json) or any conversational text.
The JSON object must contain exactly these fields:
- schemes (A JSON array of recommended schemes. Each scheme object must contain exactly fields: name, description, benefits, eligibility, documents, process, website, matchReason, ministry)
- suggestions (A JSON array of exactly 3 relevant, highly specific follow-up actions or queries the user might do next, e.g., "What documents does a student need for a post-matric scholarship?")

Constraints:
- Every response description, benefits, and reasons must be short, professional, and easy to understand.
- No conversational intros/outros.
- Do not make assumptions or include deprecated schemes.`;

      const prompt = `Profile details:
- Age: ${age}
- Gender: ${gender}
- Occupation Category: ${category}
- State of Residence: ${state}
- Annual Family Income Bracket: ${incomeLevels.find(i => i.value === income)?.label || 'All'}

Search and return matching schemes in the specified JSON format.`;

      const responseText = await generateResponse(prompt, systemInstruction);
      
      // Clean potential markdown blocks out of JSON string
      let cleanedJson = responseText.trim();
      if (cleanedJson.startsWith("```json")) {
        cleanedJson = cleanedJson.substring(7);
      }
      if (cleanedJson.startsWith("```")) {
        cleanedJson = cleanedJson.substring(3);
      }
      if (cleanedJson.endsWith("```")) {
        cleanedJson = cleanedJson.substring(0, cleanedJson.length - 3);
      }
      cleanedJson = cleanedJson.trim();

      const parsedData = JSON.parse(cleanedJson);
      
      if (parsedData.schemes && Array.isArray(parsedData.schemes)) {
        setAiSchemes(parsedData.schemes);
        setAiSuggestions(parsedData.suggestions || []);
        setSuccess(`${parsedData.schemes.length} schemes successfully recommended by Smart Bharat AI!`);
      } else if (Array.isArray(parsedData)) {
        setAiSchemes(parsedData);
        setAiSuggestions(["How to apply online?", "What is the fee?", "Are there specific state centers?"]);
        setSuccess(`${parsedData.length} schemes loaded!`);
      } else {
        throw new Error("Invalid response format received from the AI engine.");
      }
    } catch (err) {
      console.error("Gemini Scheme Finder Error:", err);
      setError(err.message || "Failed to retrieve live recommendations. Please verify your Gemini API key in the .env file.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  // Local static catalog filtering for preview when AI isn't searched
  const localFilteredSchemes = useMemo(() => {
    return localSchemes.filter((scheme) => {
      if (age) {
        const userAge = parseInt(age, 10);
        if (isNaN(userAge) || userAge < scheme.minAge || userAge > scheme.maxAge) return false;
      }
      if (category !== 'All') {
        const catMatch = scheme.category.toLowerCase().includes(category.toLowerCase()) ||
                         (category === 'Women' && scheme.category.toLowerCase().includes('girl'));
        if (!catMatch) return false;
      }
      if (income !== 'All') {
        const schIncome = scheme.incomeLevel.toLowerCase();
        if (income === 'BPL' && !schIncome.includes('bpl') && !schIncome.includes('low') && schIncome !== 'all') return false;
        if (income === '2.5L' && !schIncome.includes('2.5') && !schIncome.includes('bpl') && !schIncome.includes('low') && schIncome !== 'all') return false;
        if (income === '6L' && schIncome.includes('8') && !schIncome.includes('all')) return false;
      }
      return true;
    });
  }, [age, category, income]);

  const activeSchemes = aiSchemes !== null ? aiSchemes : localFilteredSchemes;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header block */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Government Welfare Scheme Finder</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Check your eligibility criteria and find social security schemes and financial aid offered by Central and State ministries.
        </p>
      </div>

      {/* Main grids */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Interactive Filters */}
        <form onSubmit={handleFindSchemesAI} className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-855 text-xs uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              Eligibility Filters
            </h3>
            <button 
              type="button"
              onClick={handleReset}
              className="text-[10px] uppercase font-bold text-slate-400 hover:text-sky-655 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Age Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">Applicant's Age *</label>
            <input
              type="number"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 24"
              className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
            />
          </div>

          {/* Gender Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
            >
              {gendersList.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">Occupation / Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* State Selection */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">State of Residence</label>
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

          {/* Income Level */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">Annual Family Income</label>
            <select
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
            >
              {incomeLevels.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-700 hover:bg-sky-655 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-700/10 hover:shadow-sky-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin text-slate-400" /> : <Sparkles className="w-4 h-4 text-saffron fill-saffron" />}
            Find Schemes with AI
          </button>
        </form>

        {/* Right: Output cards list */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold min-h-[25px]">
            <div>
              {aiSchemes !== null ? (
                <span>AI Recommended: <span className="font-extrabold text-sky-700">{activeSchemes.length} live matches</span> found</span>
              ) : (
                <span>Static Catalog: Showing <span className="font-extrabold text-slate-700">{activeSchemes.length} local previews</span></span>
              )}
            </div>
            
            {aiSchemes !== null && (
              <button
                onClick={() => { setAiSchemes(null); setAiSuggestions([]); setSuccess(''); }}
                className="text-[9px] font-extrabold text-slate-400 hover:text-sky-600 uppercase tracking-wide bg-slate-100 border border-slate-200 px-2 py-0.5 rounded transition-all cursor-pointer"
              >
                Clear AI List
              </button>
            )}
          </div>

          {/* Success Banner */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-2xl text-xs flex items-center justify-between animate-fade-in font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                <span>{success}</span>
              </div>
              <button onClick={() => setSuccess('')} className="text-slate-400 hover:text-slate-600 font-bold ml-2">✕</button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl text-xs flex gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">
                <span className="font-bold">Grievance lookup error:</span> {error}
              </div>
            </div>
          )}

          {/* Content Deck */}
          {loading ? (
            <div className="space-y-5">
              {/* Progress Steps Indicators Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-405 uppercase tracking-wider">AI Search Steps Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      loadingStep > 1 ? 'bg-emerald-500 text-white' : 'bg-sky-100 text-sky-600 animate-pulse'
                    }`}>
                      {loadingStep > 1 ? '✓' : '1'}
                    </div>
                    <span className={`font-semibold ${loadingStep === 1 ? 'text-slate-800' : 'text-slate-400'}`}>Gathering demographic filter tags</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      loadingStep > 2 ? 'bg-emerald-500 text-white' : loadingStep === 2 ? 'bg-sky-100 text-sky-600 animate-pulse' : 'bg-slate-100 text-slate-350'
                    }`}>
                      {loadingStep > 2 ? '✓' : '2'}
                    </div>
                    <span className={`font-semibold ${loadingStep === 2 ? 'text-slate-800' : 'text-slate-400'}`}>Querying National social welfare registries</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      loadingStep === 3 ? 'bg-sky-100 text-sky-600 animate-pulse' : 'bg-slate-100 text-slate-350'
                    }`}>
                      3
                    </div>
                    <span className={`font-semibold ${loadingStep === 3 ? 'text-slate-800' : 'text-slate-400'}`}>Compiling custom eligibility scorecards</span>
                  </div>
                </div>
              </div>

              {/* Skeleton loading cards */}
              {[1, 2].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded-md w-1/3"></div>
                    <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-slate-200 rounded-full w-20"></div>
                    <div className="h-5 bg-slate-200 rounded-full w-24"></div>
                  </div>
                  <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                  <div className="h-16 bg-slate-200 rounded-md w-full"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
                    <div className="h-8 bg-slate-200 rounded-xl w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {activeSchemes.length > 0 ? (
                activeSchemes.map((scheme, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-slate-200/80 hover:border-sky-350 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all duration-300 space-y-4.5 relative overflow-hidden group hover-card-trigger"
                  >
                    {/* Saffron side line decoration */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-saffron opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Title Header */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
                        {scheme.ministry || "Ministry of Social Welfare"}
                      </span>
                      <h4 className="font-extrabold text-slate-855 group-hover:text-sky-700 transition-colors text-sm flex items-center gap-1.5">
                        {scheme.name}
                      </h4>
                    </div>

                    {/* Badge details */}
                    <div className="flex flex-wrap gap-2 text-[9px] font-extrabold uppercase tracking-wider">
                      <span className="bg-saffron/10 text-saffron border border-saffron/20 px-2.5 py-0.5 rounded-full">
                        {scheme.category || category}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-250 px-2.5 py-0.5 rounded-full">
                        Income Match: {scheme.incomeLevel || incomeLevels.find(i => i.value === income)?.label.replace('Below ', '')}
                      </span>
                      {scheme.eligibility && (
                        <span className="bg-slate-100 text-slate-650 border border-slate-250 px-2.5 py-0.5 rounded-full">
                          Age criteria: {scheme.eligibility.match(/\d+-\d+/)?.[0] || age} Yrs
                        </span>
                      )}
                    </div>

                    {/* AI Match Reason */}
                    {scheme.matchReason && (
                      <div className="bg-amber-50/70 border border-saffron/20 text-xs text-amber-800 rounded-xl p-3.5 leading-relaxed font-medium flex gap-2.5 shadow-3xs">
                        <div className="p-1 rounded-lg bg-saffron/15 text-saffron shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4 fill-saffron" />
                        </div>
                        <div>
                          <span className="font-extrabold text-saffron">Why this matches:</span> {scheme.matchReason}
                        </div>
                      </div>
                    )}

                    {/* Benefit summary */}
                    <div className="bg-sky-50/70 border border-sky-100/60 rounded-xl p-3.5 text-xs text-slate-700 flex items-start gap-2.5 shadow-3xs">
                      <div className="p-1 rounded-lg bg-sky-100 text-sky-700 shrink-0">
                        <ShieldCheck className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="font-bold text-sky-855">Subsidized Benefit:</span> {scheme.benefits || scheme.benefit}
                      </div>
                    </div>

                    {/* Description details */}
                    <p className="text-xs text-slate-500 leading-relaxed font-medium pl-1">
                      {scheme.description || scheme.details}
                    </p>

                    {/* Documents, Eligibility & Process dropdown blocks */}
                    {aiSchemes !== null && (
                      <div className="grid sm:grid-cols-2 gap-4 pt-1 bg-slate-50/40 p-3 rounded-xl border border-slate-200/50">
                        {scheme.documents && (
                          <div className="text-[11px] font-medium text-slate-650">
                            <span className="font-bold text-slate-800 block mb-0.5">Required Documents:</span>
                            {scheme.documents}
                          </div>
                        )}
                        {scheme.process && (
                          <div className="text-[11px] font-medium text-slate-650">
                            <span className="font-bold text-slate-800 block mb-0.5">Application Process:</span>
                            {scheme.process}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer Links */}
                    <div className="pt-3.5 border-t border-slate-100/80 flex items-center justify-between">
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        *Verify credentials against current state notifications.
                      </div>
                      <a
                        href={scheme.website || scheme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-sky-700 hover:text-sky-655 flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer"
                      >
                        Apply Online
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty state */
                <div className="bg-white border-2 border-dashed border-slate-250 rounded-3xl p-16 text-center space-y-4 shadow-sm flex flex-col justify-center items-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100/55 animate-bounce">
                    <Info className="w-8 h-8" />
                  </div>
                  <h4 className="font-extrabold text-slate-700 text-sm">No Matching Schemes Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-medium">
                    We could not locate any social assistance schemes matching your current age, occupation category, and annual family income.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    Reset Eligibility Filters
                  </button>
                </div>
              )}

              {/* Follow-up suggestions */}
              {aiSchemes !== null && aiSuggestions && aiSuggestions.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-wrap gap-2 animate-fade-in print:hidden">
                  <div className="w-full text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Suggested Follow-ups:</div>
                  {aiSuggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="text-xs bg-white text-slate-650 border border-slate-200 px-3.5 py-2 rounded-xl shadow-3xs font-semibold"
                    >
                      💡 {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
