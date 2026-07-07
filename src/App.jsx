import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AIAssistant from './pages/AIAssistant';
import SchemeFinder from './pages/SchemeFinder';
import ComplaintGenerator from './pages/ComplaintGenerator';
import DocumentExplainer from './pages/DocumentExplainer';
import PromptOptimizer from './pages/PromptOptimizer';
import PromptStudio from './pages/PromptStudio';
import Settings from './pages/Settings';

export default function App() {
  // Global Profile State (Shared with Header and editable in Settings)
  const [userProfile, setUserProfile] = useState({
    name: "Rajesh Kumar",
    state: "Delhi",
    city: "New Delhi"
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout userProfile={userProfile} />}>
          <Route index element={<Home />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="schemes" element={<SchemeFinder />} />
          <Route path="complaints" element={<ComplaintGenerator />} />
          <Route path="explainer" element={<DocumentExplainer />} />
          <Route path="optimizer" element={<PromptOptimizer />} />
          <Route path="prompt-studio" element={<PromptStudio />} />
          <Route 
            path="settings" 
            element={
              <Settings 
                userProfile={userProfile} 
                setUserProfile={setUserProfile} 
              />
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
