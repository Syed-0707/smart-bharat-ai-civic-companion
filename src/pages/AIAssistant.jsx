import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';
import { generateResponse } from '../services/ai';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! I am your Smart Bharat Civic AI Assistant. I can answer queries regarding electoral registrations, municipal taxes, Aadhaar updates, citizen complaints, and general administration. What can I do for you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        "How to register a new voter ID card?",
        "Process to pay municipal property tax",
        "Where to complain about a clogged sewer/garbage?",
        "How to update address on Aadhaar card online?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  /**
   * Safe custom parser to compile basic markdown tags (headers, bullet items, bold tags, linebreaks)
   * to valid React elements, avoiding React 19 peer-dependency issues.
   */
  const renderMarkdown = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, i) => {
      let cleanLine = line;

      // Handle bold formatting: **text** -> <strong>text</strong>
      cleanLine = cleanLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Handle headers: ### -> h4, ## -> h3, # -> h2
      if (cleanLine.startsWith('### ')) {
        return (
          <h4 
            key={i} 
            className="font-extrabold text-slate-850 text-xs mt-2.5 mb-1" 
            dangerouslySetInnerHTML={{ __html: cleanLine.substring(4) }} 
          />
        );
      }
      if (cleanLine.startsWith('## ')) {
        return (
          <h3 
            key={i} 
            className="font-extrabold text-slate-850 text-sm mt-3.5 mb-1.5 border-b border-slate-100 pb-1" 
            dangerouslySetInnerHTML={{ __html: cleanLine.substring(3) }} 
          />
        );
      }
      if (cleanLine.startsWith('# ')) {
        return (
          <h2 
            key={i} 
            className="font-black text-slate-900 text-base mt-3.5 mb-1.5" 
            dangerouslySetInnerHTML={{ __html: cleanLine.substring(2) }} 
          />
        );
      }

      // Handle bullet lists: * or -
      if (cleanLine.trim().startsWith('* ') || cleanLine.trim().startsWith('- ')) {
        const content = cleanLine.trim().substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <li 
            key={i} 
            className="list-disc ml-4 mb-0.5 font-medium text-slate-650 text-[11px]" 
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        );
      }

      // Handle numbered lists: 1., 2., etc.
      const numListMatch = cleanLine.trim().match(/^(\d+)\.\s(.*)/);
      if (numListMatch) {
        const content = numListMatch[2].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <li 
            key={i} 
            className="list-decimal ml-4 mb-1 font-bold text-slate-750 text-[11px]" 
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        );
      }

      // Handle empty lines
      if (!cleanLine.trim()) {
        return <div key={i} className="h-1.5" />;
      }

      return (
        <p 
          key={i} 
          className="mb-1 last:mb-0 leading-relaxed font-medium text-slate-650 text-[11px]" 
          dangerouslySetInnerHTML={{ __html: cleanLine }} 
        />
      );
    });
  };

  const handleSend = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const systemInstruction = `You are Smart Bharat AI, an AI-powered civic assistant for India.
Your role is to help citizens understand government services in simple language.

Always return exactly a JSON object containing these keys:
- text (The response text. Format using standard Markdown containing: 1. Summary, 2. Eligibility, 3. Required Documents, 4. Application Process, 5. Important Notes. Keep it short, professional, and easy to understand under 200 words. If you are uncertain, advise users to verify information using official government websites.)
- suggestions (A JSON array of exactly 3 relevant, highly specific follow-up questions the user might ask next based on this response).

Constraints:
- Response text must be short, professional, and easy to understand.
- No conversational intros/outros.
- Do not return any markdown code block syntax (like \`\`\`json). Just the raw JSON string.`;

      // Compile conversation history context
      let compiledPrompt = "Conversation history:\n";
      updatedMessages.slice(1).forEach((msg) => {
        const role = msg.sender === 'user' ? 'User' : 'Model';
        // If msg is JSON structure parse it
        let msgText = msg.text;
        compiledPrompt += `${role}: ${msgText}\n`;
      });
      compiledPrompt += `User: ${textToSend}\n`;

      // Request live response from Gemini API
      const aiResponse = await generateResponse(compiledPrompt, systemInstruction);

      // Clean JSON string of markdown delimiters
      let cleanedJson = aiResponse.trim();
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

      const botMsg = {
        id: messages.length + 2,
        sender: 'bot',
        text: parsedData.text || aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: parsedData.suggestions || []
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Gemini AI Chat Error:", error);
      
      const errorMsg = {
        id: messages.length + 2,
        sender: 'bot',
        text: `⚠️ Error: ${error.message || "Failed to communicate with the civic AI engine. Please configure your API key."}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ["Try resending the message", "Check API Key configuration"]
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear your conversation history?")) {
      setMessages([
        {
          id: 1,
          sender: 'bot',
          text: "Conversation cleared. Feel free to ask another question about public facilities, rights, or civic programs.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            "How to register a new voter ID card?",
            "Process to pay municipal property tax",
            "Where to complain about a clogged sewer/garbage?"
          ]
        }
      ]);
    }
  };

  const latestMessage = messages[messages.length - 1];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-190px)] min-h-[500px] animate-fade-in">
      
      {/* Chat header */}
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800 relative">
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron via-white to-green-flag opacity-80"></div>
        
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shadow-inner">
            <Bot className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white flex items-center gap-2">
              National Civic AI Companion
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Bilingual Support (English / Hindi)</div>
          </div>
        </div>
        
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden md:inline">Clear Chat</span>
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-5">
        
        {/* Prompt tips */}
        <div className="bg-sky-50/80 border border-sky-100/60 backdrop-blur-md rounded-2xl p-4 text-xs text-sky-850 flex items-start gap-3 shadow-xs">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 shrink-0">
            <Sparkles className="w-4 h-4 text-saffron fill-saffron" />
          </div>
          <div className="leading-relaxed font-semibold">
            <span className="font-bold">AI Civic Assistant Tips:</span> Ask anything regarding public grievance registration, land certificates, or regional governance schemes. Click on any suggested question chip below to send it instantly.
          </div>
        </div>

        {/* Message bubble loop */}
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex items-end gap-3.5 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border text-xs shadow-sm shrink-0 transition-transform hover:scale-105 ${
              msg.sender === 'user' 
                ? 'bg-sky-600 border-sky-500 text-white' 
                : 'bg-white border-slate-200 text-slate-700'
            }`}>
              {msg.sender === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
            </div>

            {/* Bubble details */}
            <div className="space-y-1">
              <div className={`px-4.5 py-3.5 rounded-2xl text-xs shadow-xs border leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sky-700 text-white rounded-tr-none border-sky-850'
                  : 'bg-white text-slate-800 rounded-tl-none border-slate-200'
              }`}>
                {msg.sender === 'user' ? (
                  <p className="font-medium">{msg.text}</p>
                ) : (
                  renderMarkdown(msg.text)
                )}
              </div>
              <div className={`text-[9px] text-slate-400 font-bold px-1.5 uppercase ${
                msg.sender === 'user' ? 'text-right' : ''
              }`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {/* Typing container */}
        {isTyping && (
          <div className="flex items-end gap-3.5 max-w-[70%]">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-700 shadow-sm shrink-0">
              <Bot className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div className="bg-white text-slate-800 px-5 py-3.5 rounded-2xl rounded-tl-none border border-slate-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        
        <div ref={scrollToBottom} />
      </div>

      {/* Suggested Follow-up Chips (Linked dynamically to latest message) */}
      {!isTyping && latestMessage && latestMessage.suggestions && latestMessage.suggestions.length > 0 && (
        <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-200/60 flex flex-wrap gap-2.5 animate-fade-in">
          <div className="w-full text-[9px] font-extrabold uppercase tracking-widest text-slate-405 mb-1.5">Suggested Follow-ups:</div>
          {latestMessage.suggestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs bg-white hover:bg-sky-50/50 text-slate-600 hover:text-sky-600 border border-slate-200 hover:border-sky-300 px-3.5 py-2 rounded-xl shadow-2xs hover:shadow-sm transition-all duration-200 text-left font-semibold cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input panel */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
        className="px-6 py-4.5 bg-white border-t border-slate-200 flex items-center gap-3.5"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about passport procedures, municipal grievances, or building regulations..."
          className="flex-1 px-4.5 py-3 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all form-input-focus"
        />
        
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-3 bg-sky-700 hover:bg-sky-655 text-white rounded-xl shadow-md shadow-sky-700/10 hover:shadow-sky-700/20 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none shrink-0 cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

    </div>
  );
}
