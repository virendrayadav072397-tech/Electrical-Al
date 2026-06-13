import React, { useState, useEffect } from 'react';

export default function App() {
  // Global App States Configuration Matrix
  const [globalMode, setGlobalMode] = useState('troubleshoot'); // troubleshoot, learning, research
  const [currentLanguage, setCurrentLanguage] = useState('hinglish'); // english, hindi, hinglish
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalHistory, setGlobalHistory] = useState([]);

  // Troubleshoot Core Pipeline States
  const [file, setFile] = useState(null);
  const [problemDescription, setProblemDescription] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [userReadingInput, setUserReadingInput] = useState('');
  const [conclusionData, setConclusionData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Learning Core Pipeline States
  const [learningQuery, setLearningQuery] = useState('');
  const [learningResponse, setLearningResponse] = useState(null);
  const [learningFollowUp, setLearningFollowUp] = useState('');

  const BASE_URL = 'https://vy0723-electrical-ai.hf.space';

  // Fetch Global Logs Engine Status at Periodic Interval Anchors
  useEffect(() => {
    fetchGlobalLogs();
  }, [activeSession, conclusionData, learningResponse]);

  const fetchGlobalLogs = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v3/global/history-logs`);
      const logs = await res.json();
      setGlobalHistory(logs);
    } catch (err) {
      console.error("System structural history logs parse constraint:", err);
    }
  };

  // --- ACTIONS LOGIC EXECUTION LAYERS ---

  const resetTroubleshootPipeline = () => {
    setFile(null);
    setProblemDescription('');
    setActiveSession(null);
    setUserReadingInput('');
    setConclusionData(null);
  };

  const handleTroubleshootInitSubmit = async (e) => {
    e.preventDefault();
    if (!file || !problemDescription) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", currentLanguage);
    formData.append("problem_statement", problemDescription);

    try {
      const res = await fetch(`${BASE_URL}/api/v3/troubleshoot/init`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error("File validation framework overflow exception.");
      const data = await res.json();
      setActiveSession(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTroubleshootStepProgression = async (e) => {
    e.preventDefault();
    if (!userReadingInput || !activeSession) return;

    try {
      const res = await fetch(`${BASE_URL}/api/v3/troubleshoot/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSession.session_id,
          user_reading_input: userReadingInput,
          selected_language: currentLanguage
        })
      });
      const data = await res.json();

      if (data.redirect_to_conclusion) {
        const conclusionRes = await fetch(`${BASE_URL}/api/v3/troubleshoot/conclusion/${activeSession.session_id}`);
        const finalSheet = await conclusionRes.json();
        setConclusionData(finalSheet);
        setActiveSession(null);
      } else {
        setActiveSession(data);
        setUserReadingInput('');
      }
    } catch (err) {
      console.error("Context evaluation transaction system block error:", err);
    }
  };

  const handleLearningQuerySubmit = async (e) => {
    e.preventDefault();
    if (!learningQuery) return;

    try {
      const res = await fetch(`${BASE_URL}/api/v3/learning/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query_text: learningQuery,
          selected_language: currentLanguage
        })
      });
      const data = await res.json();
      setLearningResponse(data);
    } catch (err) {
      console.error("Curriculum node evaluation error:", err);
    }
  };

  const handleLearningDeepFollowUpSubmit = async (e) => {
    e.preventDefault();
    if (!learningFollowUp || !learningResponse) return;

    try {
      const res = await fetch(`${BASE_URL}/api/v3/learning/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query_text: learningQuery,
          selected_language: currentLanguage,
          deep_follow_up: learningFollowUp
        })
      });
      const data = await res.json();
      setLearningResponse(data);
      setLearningFollowUp('');
    } catch (err) {
      console.error("Deep sequence trace validation error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased relative selection:bg-cyan-500 selection:text-black">
      
      {/* 🌐 ABSOLUTE LANGUAGE SELECTOR: TOP RIGHT BLOCK NODES */}
      <div className="absolute top-4 right-4 z-50 flex items-center bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-1 shadow-2xl">
        <span className="text-sm px-2 text-slate-400 font-medium">🌐 Language:</span>
        {['english', 'hindi', 'hinglish'].map((lang) => (
          <button
            key={lang}
            onClick={() => setCurrentLanguage(lang)}
            className={`px-3 py-1 text-xs font-semibold rounded-md uppercase transition-all duration-200 ${currentLanguage === lang ? 'bg-cyan-500 text-slate-950 shadow-lg font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* 🍔 TOP LEFT THREE-LINE OPTION NAV TRIGGER MENU BUTTON */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 active:scale-95 transition-all rounded-lg shadow-xl"
      >
        <div className="w-6 h-0.5 bg-cyan-400 my-1 rounded"></div>
        <div className="w-6 h-0.5 bg-cyan-400 my-1 rounded"></div>
        <div className="w-6 h-0.5 bg-cyan-400 my-1 rounded"></div>
      </button>

      {/* 🗂️ FLYOUT CONTROL ARCHIVE OVERLAY PANEL */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-slate-900/95 backdrop-blur border-r border-slate-800 p-6 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mt-12 mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-lg font-black text-cyan-400 tracking-wider">SYSTEM CONTROL BOX</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm">❌ CLOSE</button>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">User Engine Profile</h3>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
            <p className="font-mono text-cyan-400">ID: automation-engineer-v3</p>
            <p className="text-slate-400 mt-1">Tier Level: Mission-Critical Enterprise</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Operational Analytics History</h3>
          <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-1">
            {globalHistory.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No historical traces cached in current buffer matrix stack block loop index.</p>
            ) : (
              globalHistory.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs hover:border-cyan-500/40 transition-colors">
                  <div className="flex justify-between font-medium text-slate-300 mb-1">
                    <span className="truncate max-w-[150px]">{item.label}</span>
                    <span className="text-[10px] text-cyan-400 shrink-0 font-mono">{item.resolved_state}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono truncate">{item.session_id}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 🖥️ MAIN VIEW DISPLAY CONTAINER PLATFORM TIER */}
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 tracking-tight mb-2 uppercase">
            Autonomous Electrical & Automation Systems Diagnostics
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Production environment configured for sub-station analysis, drive modules, handwritten blueprints parsing, and dynamic sequence resolution logic pipelines.
          </p>
        </header>

        {/* 🎛️ CORE RUNTIME SEGMENT MODAL ACCELERATOR */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex gap-2 shadow-2xl">
            {['troubleshoot', 'learning', 'research'].map((mode) => (
              <button
                key={mode}
                onClick={() => { setGlobalMode(mode); resetTroubleshootPipeline(); setLearningResponse(null); }}
                className={`px-6 py-2.5 text-sm font-bold rounded-lg uppercase tracking-wider transition-all duration-300 ${globalMode === mode ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* 🛠️ STEP STATE CONTAINER VIEW BLOCK A: TROUBLESHOOTING CONTROLLER LAYER */}
        {globalMode === 'troubleshoot' && (
          <div className="space-y-6">
            
            {/* SIDE OPTION CONTROL BLOCK FLAGGED LINK LOOP FOR CONCURRENT FAULT DIAGNOSTICS */}
            <div className="flex justify-end">
              <button 
                onClick={resetTroubleshootPipeline}
                className="px-4 py-2 text-xs bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 rounded-lg shadow font-bold tracking-wider uppercase transition-all duration-200 active:scale-95"
              >
                🔄 Start New Troubleshooting Loop
              </button>
            </div>

            {!activeSession && !conclusionData && (
              <form onSubmit={handleTroubleshootInitSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 animate-fadeIn">
                <h2 className="text-xl font-bold border-b border-slate-800 pb-3 text-cyan-400 uppercase tracking-wide">Initialization Framework Parameters</h2>
                
                {/* File Upload Drag-Drop Area Container (Supports up to 100MB Vector Buffers) */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Upload Schematic Document (Max 100MB - PDF, PNG, JPG)</label>
                  <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 bg-slate-950/50 p-8 rounded-xl text-center cursor-pointer transition-colors relative group">
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                      <span className="text-3xl block group-hover:scale-110 transition-transform">📁</span>
                      <p className="text-sm font-medium text-slate-300">{file ? `Selected Target: ${file.name}` : "Drag & drop file or browse local drive directory structures"}</p>
                      <p className="text-xs text-slate-500 font-mono">Payload buffer max allocation: 100MB threshold constraints enforced.</p>
                    </div>
                  </div>
                </div>

                {/* Manual Problem Description Box Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Diagnostic Problem Statement</label>
                  <textarea
                    rows={4}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Describe specific fault telemetry (e.g., VFD overcurrent trip during acceleration loop, PLC digital output card fault on CH2...)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 text-sm font-extrabold rounded-xl shadow-lg uppercase tracking-widest transition-transform duration-200 active:scale-[0.99] disabled:opacity-50 font-black"
                >
                  {isUploading ? "Processing 100MB Buffer Layer Analytics..." : "⚡ Let's Begin System Diagnostics"}
                </button>
              </form>
            )}

            {/* LIVE CONTEXT PIPELINE LOOP TRACKER PANEL VIEW */}
            {activeSession && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
                
                {/* Left Stream View Panel: Drawing Topology Analytics Dashboard */}
                <div className="md:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit space-y-4">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Drawing Topology Analysis</h3>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2.5 py-1 rounded">System Engine Classification</span>
                    <p className="text-base font-bold text-slate-100 mt-1.5">{activeSession.system_type}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-purple-950 text-purple-400 border border-purple-800/60 px-2.5 py-1 rounded">Structural Layout Profile</span>
                    <p className="text-sm font-semibold text-slate-300 mt-1.5">{activeSession.drawing_format}</p>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Active Target Fault Parameter:</p>
                    <p className="text-xs text-slate-300 font-medium italic">"{activeSession.problem_statement}"</p>
                  </div>
                </div>

                {/* Right Interactive Loop Frame: Next Non-Repetitive Solution Matrix */}
                <div className="md:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                      <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider">Active Sequence State Pointer</h3>
                      <span className="bg-amber-950/80 border border-amber-800 text-amber-400 px-3 py-1 rounded-md text-xs font-mono font-bold">STEP NODE INDEX: #{activeSession.current_active_idx}</span>
                    </div>

                    {/* Sequential Active Target Tracker Node Data Rendering Block */}
                    {activeSession.all_diagnostic_steps.filter(s => s.index === activeSession.current_active_idx).map((step) => (
                      <div key={step.index} className="space-y-4">
                        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl border-l-4 border-l-cyan-500">
                          <p className="text-sm font-semibold leading-relaxed text-slate-100">
                            {step.instruction[currentLanguage] || step.instruction['english']}
                          </p>
                          <p className="text-xs font-mono mt-2 text-cyan-400 font-bold uppercase">TARGET COMPONENT TAG REF NO: {step.tag_no}</p>
                        </div>

                        {/* HIGH REF SOLUTION POSITION ZOOMABLE INTERACTIVE MAP VIEW COMPONENT */}
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Zoomable Target Macro Graphic Map View Pointer Component</p>
                          <div className="relative w-full h-64 overflow-hidden rounded-xl border border-slate-800 bg-black cursor-zoom-in group">
                            <img 
                              src={step.section_image} 
                              alt="Schematic Isolated Frame View Matrix" 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-170 transform origin-center"
                            />
                            <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 pointer-events-none">
                              Hover to Magnify Connection Pins & Tags
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Feedback Multi-Language Parser Form Interface */}
                  <form onSubmit={handleTroubleshootStepProgression} className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Type Diagnostic Feedback Response Reading</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userReadingInput}
                        onChange={(e) => setUserReadingInput(e.target.value)}
                        placeholder="Type reading or feedback (e.g., '115 Amps load', 'MCB checked ok', or 'problem solved')"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-sm font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold rounded-xl uppercase tracking-wider transition-all duration-200 transform active:scale-95 shrink-0"
                      >
                        Submit Step Evaluation ➡️
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 italic font-medium">System supports input analysis parsing across cross-translated multi-lingual texts globally.</p>
                  </form>
                </div>

              </div>
            )}

            {/* 📝 CONCLUSION TIER AGGREGATION AUDIT SHEET CONTAINER VIEW */}
            {conclusionData && (
              <div className="bg-slate-900 border border-emerald-500/20 p-8 rounded-2xl shadow-2xl space-y-6 animate-fadeIn border-t-4 border-t-emerald-500">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-2xl font-black text-emerald-400 uppercase tracking-tight">Root Cause Evaluation & Operational Diagnostics Closed</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Diagnostic closure matrix archived successfully.</p>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 text-xs font-bold px-3 py-1 rounded border border-emerald-800 uppercase tracking-widest">ARCHIVED RECORD</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800"><span className="text-slate-500 font-bold uppercase">EQUIPMENT ASSEMBLY LEVEL:</span> <span className="text-slate-200">{conclusionData.system_type}</span></div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800"><span className="text-slate-500 font-bold uppercase">FILE STRUCTURE PROFILE:</span> <span className="text-slate-200">{conclusionData.drawing_format}</span></div>
                </div>

                {/* ROOT CAUSE SPECIFIC ANALYSIS FIELD PANEL */}
                <div className="bg-emerald-950/30 border border-emerald-800/50 p-5 rounded-xl">
                  <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 font-mono">🛡️ Core Root Cause Analysis Sheet View</h3>
                  <p className="text-sm font-semibold leading-relaxed text-slate-200">
                    {conclusionData.root_cause_analysis[currentLanguage] || conclusionData.root_cause_analysis['english']}
                  </p>
                </div>

                {/* DEEP SEQUENCE AUDIT LOGS TRAIL VIEWS */}
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 font-mono">Sequential Audit Trail Records ({conclusionData.steps_traversed_count} Steps)</h3>
                  <div className="space-y-2">
                    {conclusionData.detailed_audit_trail.map((log, index) => (
                      <div key={index} className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg flex justify-between text-xs font-mono">
                        <span className="text-cyan-400 font-bold">Step Run Context Sequence Node Index #{log.step_index}</span>
                        <span className="text-slate-400 font-medium">User Value Feedback Point Input Data: <strong className="text-slate-200">"{log.user_input_reading}"</strong></span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={resetTroubleshootPipeline}
                  className="w-full py-3.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 text-sm font-bold rounded-xl tracking-wider transition-colors uppercase"
                >
                  Clear Archive Data Registers & Return To Main Fleet Portal View
                </button>
              </div>
            )}

          </div>
        )}

        {/* 📚 STEP STATE CONTAINER VIEW BLOCK B: LEARNING ACCELERATOR MODULE PANEL */}
        {globalMode === 'learning' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-3 text-cyan-400 uppercase tracking-wide">Automation & Electrical Modular Learning Engine</h2>

            <form onSubmit={handleLearningQuerySubmit} className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Enter Target Equipment / Circuit Component Query</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={learningQuery}
                  onChange={(e) => setLearningQuery(e.target.value)}
                  placeholder="e.g., Variable Frequency Drive Braking Resistor, PLC Optocoupler Isolation Circuits..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold rounded-xl uppercase tracking-wider font-black"
                >
                  Query Engine ⚙️
                </button>
              </div>
            </form>

            {/* CURRICULUM DATA INTERACTIVE RENDERING BOX PANEL */}
            {learningResponse && (
              <div className="mt-8 border-t border-slate-800 pt-6 space-y-6 animate-fadeIn">
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="text-lg font-bold text-slate-100">{learningResponse.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {learningResponse.structured_data[currentLanguage] || learningResponse.structured_data['english']}
                  </p>
                  
                  {/* Detailed Image Display Component Layout View Link Block */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Structural Assembly Reference Schematic Representation Plot</p>
                    <div className="w-full max-w-md h-48 overflow-hidden rounded-lg border border-slate-800 bg-black">
                      <img 
                        src={learningResponse.component_schematic_url} 
                        alt="High-Definition Curriculum Explanatory Plot Frame" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* END BLOCK DEEP TYPING QUERY FEEDBACK ROUTER PANEL CONTAINER LINK */}
                <form onSubmit={handleLearningDeepFollowUpSubmit} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono text-cyan-400">Request Advanced Granular Sub-Topic Trace Iteration</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={learningFollowUp}
                      onChange={(e) => setLearningFollowUp(e.target.value)}
                      placeholder="Ask for deeper details or clarify micro-structural attributes of this asset frame module context..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg uppercase tracking-wider"
                    >
                      Deep Trace ➡️
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 🔬 STEP STATE CONTAINER VIEW BLOCK C: RESEARCH ARCHIVE PIPELINE MODULE CONTROL */}
        {globalMode === 'research' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center space-y-4 animate-fadeIn">
            <span className="text-4xl block">🔬</span>
            <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wide">Advanced Systems Engineering Research Node</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Research index vectors are synced concurrently inside the primary FastAPI loop structure. Core compilation models remain listening for validation updates.
            </p>
            <div className="inline-block px-4 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs font-mono text-slate-500 animate-pulse">
              System Context State: Active Operational Standby Loop Enforced
            </div>
          </div>
        )}

      </div>
    </div>
  );
}