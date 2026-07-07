import React, { useState } from 'react';
import { FileText, Sparkles, HelpCircle, Check, BookOpen, AlertCircle, PlayCircle, Loader2, UploadCloud, CheckCircle, Info } from 'lucide-react';
import { generateResponse } from '../services/ai';

export default function DocumentExplainer() {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // API loading states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [aiExplanations, setAiExplanations] = useState(null); // stores parsed JSON from Gemini

  // Jargon dictionary for hover tooltip lookup
  const jargonDict = {
    'mutation': 'Land mutation (Dakhil Kharij) is the process of registering the transfer of property title from one person to another in the local revenue records.',
    'patwari': 'A government administrative officer at the village/local level who maintains land transaction and land ownership records.',
    'encumbrance': 'A legal claim, lien, or financial liability on a property (such as an unpaid mortgage or tax dispute) that restricts its sale.',
    'easement': 'The legal right of someone to use a portion of another person\'s property for a specific purpose (e.g., a shared driveway, water pipes, or power lines).',
    'khata': 'A legal document containing property assessment records, including tax owner details, location, and dimensions, used primarily in Karnataka.',
    'noc': 'No Objection Certificate. A formal legal certificate indicating that a department or agency has no objection to a proposed development or transaction.',
    'stamp duty': 'A mandatory state government tax levied on legal documents, usually relating to the sale or transfer of real estate.',
    'sale deed': 'The core legally binding document that records the final sale and transfers the absolute ownership of property from seller to buyer.',
    'bylaws': 'Local rules and building regulations enacted by municipal corporations regarding structure heights, setbacks, or safety mandates.',
    'demarcation': 'The process of physically marking and certifying the exact boundary lines of a land plot by revenue officials.'
  };

  const sampleTexts = {
    municipal: `Notice from the Office of the Municipal Ward Inspector.
Subject: Violation of Building Bylaws under Section 12-A.
It is observed during inspection that the construction at Plot 5A violates municipal bylaws regarding frontal setbacks. You are required to submit a copy of the approved Sanction Plan along with the NOC from the Fire Services Department. Failure to produce this within 7 working days will result in penalty and potential demolition orders.`,
    
    property: `Memorandum of Property Transfer.
Please note that the applicant has requested a mutation of the land title registered under Khata number 405. The revenue surveyor has completed the physical demarcation. The property tax assessment registry reports no outstanding dues. However, the buyer must produce the original Sale Deed, proof of stamp duty clearance, and a certified non-encumbrance certificate before the mutation is finalized in the registry by the Patwari.`
  };

  const handleLoadSample = (key) => {
    setInputText(sampleTexts[key]);
    setSelectedFile(null);
    setAnalyzed(false);
    setAiExplanations(null);
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Unsupported file format. Please upload a PDF or Image (JPEG, PNG, WEBP).");
      return;
    }

    setSelectedFile(file);
    setInputText(`[Uploaded File: ${file.name}]`);
    setAnalyzed(false);
    setAiExplanations(null);
    setError('');
    setSuccess('');
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() && !selectedFile) {
      alert("Please upload a PDF/Image or enter some notice text first!");
      return;
    }

    setLoading(true);
    setLoadingStep(1);
    setError('');
    setSuccess('');
    setAiExplanations(null);

    // Step progress interval
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : 3));
    }, 1500);

    try {
      const systemInstruction = `You are a professional Document Analysis Assistant.
Your task is to analyze the provided document (which can be a text description, an uploaded image, or a PDF file) and explain its core details.

You must return exactly a JSON object, and absolutely nothing else. Do not include markdown code block syntax (like \`\`\`json) or any conversational text.
The JSON object must contain exactly these fields:
- extractedText (The literal extracted text from the document, or a clean transcription if it's an image/PDF. If OCR fails or document is blank, set to 'OCR failed or no text found')
- purpose (The purpose of this document in simple citizen-friendly terms)
- usage (How and when the citizen should use this document)
- documents (Suggested required documents associated with this document or to apply for it)
- validity (The legal validity period of this document, e.g., 6 months, Lifetime, etc.)
- summary (A clear 3-sentence summary of what this document says)
- notes (Important notes or warnings for the citizen)
- suggestions (A JSON array of exactly 3 relevant, highly specific follow-up actions or queries the user might do next, e.g. "Where do I submit this certificate?", "What is the fee for renewal?")

Constraints:
- Every response text inside purpose, usage, validity, summary, and notes must be short, professional, and easy to understand.
- No conversational intros/outros.
- If the image or document is unreadable or corrupted, set extractedText to 'OCR failed or no text found' and explain the OCR failure inside the notes field.`;

      const prompt = selectedFile 
        ? `Please extract text from the attached file and explain it.` 
        : `Please explain the following notice text:\n"${inputText}"`;

      const filesPayload = selectedFile ? [selectedFile] : [];
      const responseText = await generateResponse(prompt, systemInstruction, filesPayload);

      // Clean JSON string of markdown block delimiters
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
      
      if (parsedData.purpose && parsedData.summary) {
        setAiExplanations(parsedData);
        setAnalyzed(true);
        setSuccess("Document text extracted and explained successfully!");
      } else {
        throw new Error("Invalid document analysis format received from the AI engine.");
      }
    } catch (err) {
      console.error("Document explainer error:", err);
      setError(err.message || "Failed to analyze document. Please check your Gemini API key in the .env file.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSelectedFile(null);
    setAnalyzed(false);
    setAiExplanations(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Legal & Civic Notice Explainer</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Understand complex municipal legal alerts, tax notices, and land registry applications using simplified local glossary terms.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        
        {/* Left Column: Input and Uploader (2/5 width) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-2">
              <h3 className="font-extrabold text-slate-855 text-xs uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                Raw Notice Source
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleLoadSample('municipal')}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-[10px] text-slate-600 font-bold border border-slate-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-sky-500" />
                  Municipal Notice
                </button>
                <button
                  onClick={() => handleLoadSample('property')}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-[10px] text-slate-600 font-bold border border-slate-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Land Notice
                </button>
              </div>
            </div>

            {/* Drag drop mockup file selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">Upload Document (PDF / Image) *</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="doc-upload"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="doc-upload"
                  className="flex-1 py-4 px-4 border-2 border-dashed border-slate-200 hover:border-sky-500 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 bg-slate-50 hover:bg-sky-50/50"
                >
                  <UploadCloud className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">
                    {selectedFile ? `Selected: ${selectedFile.name}` : "Click to select PDF or Image file"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Supports PDF, PNG, JPG (Max 5MB)</span>
                </label>
              </div>
            </div>

            {/* Textarea fallback */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">Or Paste Document Text</label>
              <textarea
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setAnalyzed(false); setSelectedFile(null); }}
                rows="5"
                placeholder="Paste notice alert, property tax directives, or land records here..."
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white resize-none form-input-focus font-medium"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 py-3 bg-sky-700 hover:bg-sky-650 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-700/10 hover:shadow-sky-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider disabled:bg-slate-200 disabled:text-slate-400"
              >
                {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin text-slate-400" /> : <Sparkles className="w-4 h-4 text-saffron fill-saffron" />}
                Analyze Document
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-3 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>

          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-xs flex gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">
                <span className="font-bold">OCR/Processing Error:</span> {error}
              </div>
            </div>
          )}

          {/* Extracted text panel */}
          {analyzed && aiExplanations?.extractedText && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 animate-fade-in">
              <h3 className="font-extrabold text-slate-855 text-xs uppercase tracking-wider border-b border-slate-100 pb-2.5">
                Extracted Document Text (OCR)
              </h3>
              <div className="text-[11px] text-slate-600 bg-slate-50 p-3.5 border border-slate-200 rounded-xl font-mono max-h-[160px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {aiExplanations.extractedText}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Explanations Display (3/5 width) */}
        <div className="lg:col-span-3 space-y-6">
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

          {loading ? (
            <div className="space-y-6">
              {/* Progress Steps Indicators Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-405 uppercase tracking-wider">AI OCR & Analysis Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      loadingStep > 1 ? 'bg-emerald-500 text-white' : 'bg-sky-100 text-sky-600 animate-pulse'
                    }`}>
                      {loadingStep > 1 ? '✓' : '1'}
                    </div>
                    <span className={`font-semibold ${loadingStep === 1 ? 'text-slate-800' : 'text-slate-400'}`}>Uploading file & reading metadata</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      loadingStep > 2 ? 'bg-emerald-500 text-white' : loadingStep === 2 ? 'bg-sky-100 text-sky-600 animate-pulse' : 'bg-slate-100 text-slate-350'
                    }`}>
                      {loadingStep > 2 ? '✓' : '2'}
                    </div>
                    <span className={`font-semibold ${loadingStep === 2 ? 'text-slate-800' : 'text-slate-400'}`}>Extracting layout text characters (OCR)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      loadingStep === 3 ? 'bg-sky-100 text-sky-600 animate-pulse' : 'bg-slate-100 text-slate-350'
                    }`}>
                      3
                    </div>
                    <span className={`font-semibold ${loadingStep === 3 ? 'text-slate-800' : 'text-slate-400'}`}>Translating legal notice instructions and glossary</span>
                  </div>
                </div>
              </div>

              {/* Skeleton loading grid */}
              <div className="grid md:grid-cols-2 gap-5 animate-pulse">
                <div className="h-28 bg-slate-200 rounded-2xl"></div>
                <div className="h-28 bg-slate-200 rounded-2xl"></div>
                <div className="h-32 bg-slate-200 rounded-2xl md:col-span-2"></div>
                <div className="h-32 bg-slate-200 rounded-2xl md:col-span-2"></div>
              </div>
            </div>
          ) : aiExplanations ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                
                {/* Card 1: Core Purpose */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all relative overflow-hidden group hover-card-trigger">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-saffron"></div>
                  <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest block mb-2">
                    1. Purpose & Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      <span className="text-sky-655 font-black">Purpose:</span> {aiExplanations.purpose}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      <span className="font-bold text-slate-750">Summary:</span> {aiExplanations.summary}
                    </div>
                  </div>
                </div>

                {/* Card 2: Usage & Validity */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all relative overflow-hidden group hover-card-trigger">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-600"></div>
                  <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest block mb-2">
                    2. Usage & Validity Period
                  </h4>
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      <span className="text-sky-655 font-black">Usage:</span> {aiExplanations.usage}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      <span className="font-bold text-slate-750">Legal Validity:</span> {aiExplanations.validity}
                    </div>
                  </div>
                </div>

                {/* Card 3: Associated Documents */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all relative overflow-hidden group hover-card-trigger md:col-span-2">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
                  <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest block mb-2">
                    3. Associated Required Documents
                  </h4>
                  <div className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                    {aiExplanations.documents}
                  </div>
                </div>

                {/* Card 4: Important Notes */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all relative overflow-hidden group hover-card-trigger md:col-span-2">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-650"></div>
                  <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest block mb-2">
                    4. Important Notes & Advisories
                  </h4>
                  <div className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                    {aiExplanations.notes}
                  </div>
                </div>

              </div>

              {/* Follow-up suggestions */}
              {aiExplanations.suggestions && aiExplanations.suggestions.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-wrap gap-2 animate-fade-in print:hidden">
                  <div className="w-full text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Suggested Follow-ups:</div>
                  {aiExplanations.suggestions.map((suggestion, index) => (
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
            <div className="bg-slate-100 border-2 border-dashed border-slate-250 rounded-3xl p-16 text-center space-y-4 h-[500px] flex flex-col justify-center items-center">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-655 border border-sky-100/55 animate-bounce">
                <Info className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-slate-700 text-sm">No Document Analyzed</h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium font-sans">
                Drag or upload a PDF/Image notice, or paste document instructions on the left to review visual AI explanations.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
