import React, { useState } from 'react';
import { FileEdit, Clipboard, Check, Download, AlertTriangle, Printer, Loader2, Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { generateResponse } from '../services/ai';

export default function ComplaintGenerator() {
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: 'Delhi',
    department: 'Municipal Corporation',
    issueType: 'Garbage Accumulation',
    title: '',
    details: ''
  });

  // API states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aiResponse, setAiResponse] = useState(null); // stores parsed JSON output from Gemini

  const departments = {
    'Municipal Corporation': ['Garbage Accumulation', 'Streetlight Maintenance', 'Potholes / Road Repair', 'Illegal Construction'],
    'Electricity Board': ['Frequent Power Outages', 'Damaged Transformer', 'Billing Grievance', 'Sparking Overhead Wires'],
    'Water & Sewerage Board': ['Contaminated Water Supply', 'Drainage / Sewer Overflow', 'Low Water Pressure', 'Water Leakage'],
    'Police Department': ['Nuisance / Noise Pollution', 'General Theft/Safety Concern', 'Traffic Obstruction', 'Illegal Parking']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'department') {
        updated.issueType = departments[value][0];
      }
      return updated;
    });
  };

  // Generate Complaint calling Gemini
  const handleGenerateComplaintAI = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.title || !formData.details) {
      alert("Please fill in all mandatory fields (*).");
      return;
    }

    setLoading(true);
    setLoadingStep(1);
    setError('');
    setSuccess('');
    setAiResponse(null);

    // Step progress interval
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : 3));
    }, 1500);

    try {
      const systemInstruction = `You are an Indian Government Public Grievance Officer.
Your task is to take the user's civic grievance details (Category, Issue Title, Description, Location, Contact) and draft a formal, legally structured, and highly professional complaint letter.

You must return exactly a JSON object, and absolutely nothing else. Do not include markdown code block syntax (like \`\`\`json) or any conversational text.
The JSON object must contain exactly these fields:
- department (The concerned government department, e.g., Municipal Corporation, Water & Sewerage Board, etc.)
- category (The specific category of the complaint, e.g. Garbage Accumulation, Potholes, etc.)
- priority (The priority category: Low, Medium, or High)
- subject (A concise, formal subject line for the complaint)
- letter (The complete, formal complaint letter formatted with Date, To, Subject, Body, and Sincerely signature block, including placeholders where necessary)
- documents (Suggested supporting documents to attach, e.g. photographs, neighborhood signatures)
- timeline (Expected resolution time under citizen charters, e.g., 7 working days)
- summary (A clear, 2-sentence summary of the core complaint details)
- suggestions (A JSON array of exactly 3 relevant, highly specific follow-up actions or queries the user might do next, e.g. "Where do I submit this printed letter?", "What photo proof works best?")

Constraints:
- Response text inside summary, subject, and documents must be short, professional, and easy to understand.
- Write the letter in professional government-style language. Include date, subject line, and formal greeting.
- Limit letter text to under 300 words.`;

      const prompt = `Citizen Grievance Details:
- Citizen Name: ${formData.name}
- Contact Number: ${formData.phone || 'Not provided'}
- Complaint Department: ${formData.department}
- Complaint Category: ${formData.issueType}
- Issue Title: ${formData.title}
- Detailed Description: ${formData.details}
- Location: ${formData.address}, ${formData.city}, ${formData.state}

Please generate the structured complaint dossier.`;

      const responseText = await generateResponse(prompt, systemInstruction);

      // Clean JSON string of markdown delimiters
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
      
      if (parsedData.letter && parsedData.department) {
        setAiResponse(parsedData);
        setSuccess("Formal complaint dossier compiled successfully!");
      } else {
        throw new Error("Invalid dossier format received from the AI engine.");
      }
    } catch (err) {
      console.error("Gemini Complaint Generator Error:", err);
      setError(err.message || "Failed to generate your complaint letter. Please check your Gemini API key in the .env file.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiResponse?.letter) return;
    navigator.clipboard.writeText(aiResponse.letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDFMock = () => {
    if (!aiResponse?.letter) return;
    const dossierText = `CITIZEN GRIEVANCE PETITION DOSSIER
======================================
DEPARTMENT: ${aiResponse.department}
CATEGORY: ${aiResponse.category}
PRIORITY: ${aiResponse.priority}
EXPECTED TIMELINE: ${aiResponse.timeline}
======================================

SUMMARY:
${aiResponse.summary}

======================================
FORMAL COMPLAINT PETITION:

${aiResponse.letter}

======================================
SUGGESTED SUPPORTING DOCUMENTS:
${aiResponse.documents}`;

    const element = document.createElement("a");
    const file = new Blob([dossierText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `grievance_petition_${formData.issueType.toLowerCase().replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Triggers browser print dialog targeting the letter block (allows user to save directly as PDF)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">AI Complaint Letter Generator</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Draft structured, professional petition drafts addressed to municipal authorities, state utilities, or police commands.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        
        {/* Form panel */}
        <form onSubmit={handleGenerateComplaintAI} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4.5">
          <h3 className="font-extrabold text-slate-855 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileEdit className="w-4 h-4 text-sky-600 animate-pulse" />
            Grievance Letter Parameters
          </h3>

          {/* Row 1: Name and Phone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-655 uppercase tracking-wide">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-655 uppercase tracking-wide">Contact Number (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
              />
            </div>
          </div>

          {/* Row 2: Location */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-655 uppercase tracking-wide">Location / Street Address *</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              placeholder="e.g. H.No 24, Lane 3, Sector 12, Dwarka"
              className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
            />
          </div>

          {/* Row 3: City and State */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-655 uppercase tracking-wide">City / District</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. New Delhi"
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-650 uppercase tracking-wide">State Registry</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
              >
                {['Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Punjab', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Department & Issue */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-655 uppercase tracking-wide">Concerned Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
              >
                {Object.keys(departments).map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-655 uppercase tracking-wide">Grievance Category</label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
              >
                {departments[formData.department].map((issue) => (
                  <option key={issue} value={issue}>{issue}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Issue Title */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-655 uppercase tracking-wide">Issue Title / Subject Summary *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Backlog of garbage near Block C school gate"
              className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white form-input-focus"
            />
          </div>

          {/* Detailed Description */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-655 uppercase tracking-wide">Detailed Description *</label>
            <textarea
              name="details"
              required
              rows="4"
              value={formData.details}
              onChange={handleInputChange}
              placeholder="Provide exact details (e.g. Garbage backlog is blocking the school gates. Strays are scattering waste onto public streets...)"
              className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white resize-none form-input-focus"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-700 hover:bg-sky-655 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-700/10 hover:shadow-sky-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider disabled:bg-slate-200 disabled:text-slate-400"
          >
            {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin text-slate-405" /> : <Sparkles className="w-4 h-4 text-saffron fill-saffron" />}
            Generate Complaint
          </button>
        </form>

        {/* Output Column */}
        <div className="space-y-4.5">
          <div className="flex items-center justify-between min-h-[40px]">
            <h3 className="font-extrabold text-slate-855 text-xs uppercase tracking-wider">Letter Preview</h3>
            {aiResponse && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 bg-white border border-slate-200 text-slate-655 hover:text-sky-750 hover:border-sky-300 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-2xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Letter'}
                </button>
                <button
                  onClick={handleDownloadPDFMock}
                  className="px-3.5 py-2 bg-white border border-slate-200 text-slate-655 hover:text-sky-750 hover:border-sky-300 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-2xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-sky-655" />
                  Download PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 bg-white border border-slate-200 text-slate-655 hover:text-sky-750 hover:border-sky-300 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-2xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-500" />
                  Print Complaint
                </button>
              </div>
            )}
          </div>

          {/* Success Notification Banner */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-2xl text-xs flex items-center justify-between animate-fade-in font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                <span>{success}</span>
              </div>
              <button onClick={() => setSuccess('')} className="text-slate-400 hover:text-slate-600 font-bold ml-2">✕</button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl text-xs flex gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Grievance draft error:</span> {error}
              </div>
            </div>
          )}

          {/* Preview panel */}
          {loading ? (
            <div className="space-y-4">
              {/* Progress Steps Indicators Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-405 uppercase tracking-wider">AI Drafting Steps Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      loadingStep > 1 ? 'bg-emerald-500 text-white' : 'bg-sky-100 text-sky-600 animate-pulse'
                    }`}>
                      {loadingStep > 1 ? '✓' : '1'}
                    </div>
                    <span className={`font-semibold ${loadingStep === 1 ? 'text-slate-800' : 'text-slate-400'}`}>Formulating administrative grievance parameters</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      loadingStep > 2 ? 'bg-emerald-500 text-white' : loadingStep === 2 ? 'bg-sky-100 text-sky-600 animate-pulse' : 'bg-slate-100 text-slate-350'
                    }`}>
                      {loadingStep > 2 ? '✓' : '2'}
                    </div>
                    <span className={`font-semibold ${loadingStep === 2 ? 'text-slate-800' : 'text-slate-400'}`}>Drafting legal government-style complaint text</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      loadingStep === 3 ? 'bg-sky-100 text-sky-600 animate-pulse' : 'bg-slate-100 text-slate-350'
                    }`}>
                      3
                    </div>
                    <span className={`font-semibold ${loadingStep === 3 ? 'text-slate-800' : 'text-slate-400'}`}>Compiling expected citizen redressal timelines</span>
                  </div>
                </div>
              </div>

              {/* Skeleton loading preview panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 animate-pulse">
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                </div>
                <div className="h-12 bg-slate-100 rounded-xl"></div>
                <div className="h-[280px] bg-slate-200 rounded-2xl w-full"></div>
                <div className="h-14 bg-slate-200 rounded-2xl"></div>
              </div>
            </div>
          ) : aiResponse ? (
            <div className="space-y-4">
              {/* Dossier Metadata cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Department</div>
                  <div className="text-[10px] font-bold text-slate-800 truncate mt-0.5">{aiResponse.department}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Category</div>
                  <div className="text-[10px] font-bold text-slate-800 truncate mt-0.5">{aiResponse.category}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Priority</div>
                  <div className={`text-[10px] font-extrabold mt-0.5 ${
                    aiResponse.priority?.toLowerCase() === 'high' ? 'text-rose-600' : 'text-amber-600'
                  }`}>{aiResponse.priority || 'Medium'}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Resolution Time</div>
                  <div className="text-[10px] font-bold text-emerald-600 truncate mt-0.5">{aiResponse.timeline}</div>
                </div>
              </div>

              {/* Complaint Summary card */}
              {aiResponse.summary && (
                <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-xl text-xs text-sky-850 font-medium">
                  <span className="font-extrabold text-sky-855 uppercase text-[9px] block mb-0.5">Complaint Summary</span>
                  {aiResponse.summary}
                </div>
              )}

              {/* The Letter block */}
              <div id="printable-letter" className="bg-white border-2 border-slate-300/80 rounded-2xl shadow-lg p-8 font-mono text-[11px] text-slate-750 whitespace-pre-wrap leading-relaxed relative overflow-hidden h-[340px] overflow-y-auto">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron via-white to-green-flag"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] print:hidden">
                  <svg viewBox="0 0 100 100" className="w-80 h-80 text-navy-flag">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </div>
                <div className="text-center border-b border-slate-200 pb-3 mb-4 space-y-1 print:hidden">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">OFFICIAL CIVIC GRIEVANCE PETITION</div>
                  <div className="text-[8px] font-semibold text-slate-400">SMART BHARAT COMPLIANCE FRAMEWORK</div>
                </div>
                {aiResponse.letter}
              </div>

              {/* Citizen checklist & docs grid */}
              {aiResponse.documents && (
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl print:hidden">
                  <span className="font-bold text-[10px] text-slate-800 uppercase tracking-wide block mb-1">Suggested Supporting Documents</span>
                  <div className="text-[11px] text-slate-500 whitespace-pre-line leading-relaxed font-medium">{aiResponse.documents}</div>
                </div>
              )}

              {/* Follow-up suggestions */}
              {aiResponse.suggestions && aiResponse.suggestions.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-wrap gap-2 animate-fade-in print:hidden">
                  <div className="w-full text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Suggested Follow-ups:</div>
                  {aiResponse.suggestions.map((suggestion, index) => (
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
          ) : (
            /* Empty state */
            <div className="bg-white border-2 border-dashed border-slate-250 rounded-3xl p-16 text-center space-y-4 h-[500px] flex flex-col justify-center items-center">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-655 border border-sky-100/55 animate-bounce">
                <Info className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-slate-700 text-sm">No Document Drafted Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                Complete the grievance parameters inside the form on the left and click "Generate Complaint" to draft your professional petition.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
