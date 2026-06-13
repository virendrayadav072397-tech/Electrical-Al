import React, { useState, useEffect } from 'react';

export default function App() {
  // Navigation & Preferences Layout Grid States
  const [globalMode, setGlobalMode] = useState('troubleshoot'); // troubleshoot, learning, research
  const [currentLanguage, setCurrentLanguage] = useState('hinglish'); // english, hindi, hinglish
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyBufferLogs, setHistoryBufferLogs] = useState([]);

  // Troubleshoot Core Structural Pipeline Matrices
  const [file, setFile] = useState(null);
  const [problemDescription, setProblemDescription] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [userReadingInput, setUserReadingInput] = useState('');
  const [conclusionData, setConclusionData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Learning Core Structural Pipeline Matrices
  const [learningQuery, setLearningQuery] = useState('');
  const [learningResponse, setLearningResponse] = useState(null);
  const [learningFollowUp, setLearningFollowUp] = useState('');

  const BASE_URL = 'https://vy0723-electrical-ai.hf.space';

  useEffect(() => {
    fetchHistoryTrackerLogs();
  }, [activeSession, conclusionData, learningResponse]);

  const fetchHistoryTrackerLogs = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v3/global/history-logs`);
      const logs = await res.json();
      setHistoryBufferLogs(logs);
    } catch (err) {
      console.error("Historical node trace exception:", err);
    }
  };

  const handleTroubleshootInitSubmit = async (e) => {
    e.preventDefault();
    if (!file || !problemDescription) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", currentLanguage);
    formData.append("problem_statement", problemDescription);

    try {
      const res = await fetch(`${BASE_URL}/api/v3/troubleshoot/init`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error("100MB premium buffer boundary initialization fault exception.");
      const data = await res.json();
      setActiveSession(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
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
        const finalData = await conclusionRes.json();
        setConclusionData(finalData);
        setActiveSession(null);
      } else {
        setActiveSession(data);
        setUserReadingInput('');
      }
    } catch (err) {
      console.error("Loop iteration constraint update execution fault:", err);
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
      console.error("Curriculum engine index mapping failure:", err);
    }
  };

  const handleLearningFollowUpSubmit = async (e) => {
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
      console.error("Deep trace serialization mismatch exception:", err);
    }
  };

  const triggerResetTroubleshooting = () => {
    setFile(null);
    setProblemDescription('');
    setActiveSession(null);
    setUserReadingInput('');
    setConclusionData(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-emerald-400 selection:text-black">
      
      {/* 🌐 ABSOLUTE PREMIUM MULTI-LANGUAGE DROPDOWN ANCHOR TRIGGER MODULE */}
      <div className="absolute top-4 right-4 z-50 flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 shadow-2xl">
        <span className="text-xs px-2 text-slate-400 font-semibold uppercase tracking-wider">🌐 Lang:</span>
        {['english', 'hindi', 'hinglish'].map((lang) => (
          <button
            key={lang}
            onClick={() => setCurrentLanguage(lang)}
            className={`px-3 py-1 text-[11px] font-black rounded-lg uppercase tracking-wide transition-all duration-200 ${currentLanguage === lang ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'}`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* 🍔 THREE-LINE FLYOUT SIDEBAR OPTION HAMBURGER NAV BUTTON */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-50 p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl shadow-2xl transition-transform active:scale-95"
      >
        <div className="w-5 h-0.5 bg-emerald-400 my-1 rounded"></div>
        <div className="w-5 h-0.5 bg-emerald-400 my-1 rounded"></div>
        <div className="w-5 h-0.5 bg-emerald-400 my-1 rounded"></div>
      </button>

      {/* 🗂️ SLIDING SYSTEM ANALYSIS REGISTRY DRAWER OVERLAY PANEL */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 p-6 z-40 transform transition-transform duration-300 shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mt-14 border-b border-slate-800 pb-4 mb-6">
          <h2 className="text-sm font-black tracking-widest text-emerald-400 uppercase">SYSTEM REGISTRY HUB</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-white font-bold text-xs uppercase tracking-wider">❌ CLOSE</button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">OPERATOR METADATA</h3>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400">
              ROLE: AUTOMATION_ENGINEER_V3
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">TROUBLESHOOTING ARCHIVE STACK</h3>
            <div className="space-y-2 overflow-y-auto max-h-[65vh] pr-1">
              {historyBufferLogs.length === 0 ? (
                <p className="text-xs text-slate-600 italic">No historical iterations cached in local loop memory storage units.</p>
              ) : (
                historyBufferLogs.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs hover:border-emerald-500/30 transition-all">
                    <div className="flex justify-between items-center font-semibold text-slate-300 mb-1">
                      <span className="truncate max-w-[140px]">{item.label}</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0">{item.resolved_state}</span>
                    </div>
                    <p className="text-[9px] text-slate-600 font-mono truncate">{item.session_id}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🖥️ MAIN CONTROL DASHBOARD ARCHITECTURE SURFACE VIEW */}
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        
        <header className="text-center mb-10">
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 text-[10px] font-bold rounded-full text-emerald-400 uppercase tracking-widest mb-3 shadow-xl">
            ⚡ Premium Engineering Dashboard Suite ⚡
          </div>
          <h1 className="text-5xl font-black tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-emerald-400 to-teal-500">
            ELECTRICAL AI PLATFORM
          </h1>
        </header>

        {/* 🎛️ COGNITIVE DROP-DOWN HUB SELECTOR MODULE CENTER ALIGNED */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex items-center gap-2 shadow-2xl relative">
            <span className="text-xs font-bold px-3 text-slate-400 uppercase tracking-widest">Select Operational Mode:</span>
            <select
              value={globalMode}
              onChange={(e) => { setGlobalMode(e.target.value); triggerResetTroubleshooting(); setLearningResponse(null); }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-black uppercase text-emerald-400 tracking-wider focus:outline-none focus:border-emerald-500 cursor-pointer shadow-inner transition-colors"
            >
              <option value="troubleshoot">🛠️ Troubleshoot System Faults</option>
              <option value="learning">📚 Interactive Learning Hub</option>
              <option value="research">🔬 System Engineering Research</option>
            </select>
          </div>
        </div>

        {/* 🛠️ MODULE NODE VIEW A: TROUBLESHOOTING PROCESSING GRID */}
        {globalMode === 'troubleshoot' && (
          <div className="space-y-6">
            
            {/* START NEW TROUBLESHOOTING CONTROL BLOCK BUTTON LINKS */}
            <div className="flex justify-end">
              <button
                onClick={triggerResetTroubleshooting}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-emerald-500/30 text-emerald-400 text-xs font-extrabold rounded-xl shadow-xl transition-all active:scale-95 uppercase tracking-wider"
              >
                🔄 Start New Troubleshooting
              </button>
            </div>

            {!activeSession && !conclusionData && (
              <form onSubmit={handleTroubleshootInitSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 animate-fadeIn">
                <h2 className="text-lg font-black uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-3">Isolate Hardware Malfunction Parameters</h2>

                {/* Drag-Drop Target Container Node Allocation Field (100MB Restrictive Protection) */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Upload Target Engineering Drawing Sheet (Max 100MB File - PDF, PNG, JPG)</label>
                  <div className="border-2 border-dashed border-slate-700 bg-slate-950/40 p-8 rounded-2xl text-center cursor-pointer hover:border-emerald-500/40 transition-colors relative group">
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg" 
                      onChange={(e) => setFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <div className="space-y-2">
                      <span className="text-3xl block group-hover:scale-110 transition-transform">⚙️</span>
                      <p className="text-xs font-bold text-slate-300">{file ? `Target Data Buffer Verified: ${file.name}` : "Drop engineering layout document here or scan network storage units"}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Maximum file limits hardcoded to 100MB threshold constraints.</p>
                    </div>
                  </div>
                </div>

                {/* Manual Issue Reporting Data Fields */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Describe System Fault Telemetry Readings</label>
                  <textarea
                    rows={4}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Provide description (e.g., PLC Digital output loop failure, VFD acceleration overloading circuit parameters trip indicator, etc.)"
                    className="w-full bg-slate-950 border border-slate-800 font-medium rounded-xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl font-black shadow-lg shadow-emerald-950/20 active:scale-[0.99] disabled:opacity-50 transition-transform"
                >
                  {isProcessing ? "Analyzing 100MB Topology Vector Coordinates..." : "⚡ Let's Begin Diagnostic Run"}
                </button>
              </form>
            )}

            {/* DYNAMIC COMPILER ACTIVE INSTANCE TRACKER LOGIC WINDOW VIEW */}
            {activeSession && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
                
                {/* Left Metrics View: Isolated Token Identifiers */}
                <div className="md:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit space-y-4 shadow-xl">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Multimodal Topology Analytics</h3>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded">Engine Classification</span>
                    <p className="text-sm font-black text-slate-100 mt-1">{activeSession.system_type}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-teal-950 text-teal-400 border border-teal-800/60 px-2 py-0.5 rounded">File Format Analysis</span>
                    <p className="text-xs font-bold text-slate-300 mt-1">{activeSession.drawing_format}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Target Statement Logged:</span>
                    <p className="text-slate-300 italic">"{activeSession.problem_statement}"</p>
                  </div>
                </div>

                {/* Right Interactive Loop View Frame: Advanced Solution Maps */}
                <div className="md:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                      <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Active Resolution Queue</h3>
                      <span className="bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[10px] px-2.5 py-1 rounded-md font-bold">SEQUENCE SEQUENCE INDEX: #{activeSession.current_idx}</span>
                    </div>

                    {/* Filter Out Next Step Node Logic To Avoid Screen Render Multi-Key Repetition Code Errors */}
                    {activeSession.all_steps.filter(s => s.index === activeSession.current_idx).map((step) => (
                      <div key={step.index} className="space-y-4 animate-fadeIn">
                        <div className="bg-slate-950 p-4 rounded-xl border-l-4 border-l-emerald-400 text-xs font-medium leading-relaxed text-slate-200">
                          {step.instruction[currentLanguage] || step.instruction['english']}
                          <div className="mt-2 text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">CRITICAL SCHEMATIC COMPONENT REFERENCE TAG: {step.tag_no}</div>
                        </div>

                        {/* HIGH ZOOMABLE MACRO POSITION PLOT COMPONENT BOX GRAPHIC VIEW REFERENCE IMAGE */}
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Interactive Magnification Target Vector Window View</p>
                          <div className="relative w-full h-64 overflow-hidden rounded-xl border border-slate-800 bg-black cursor-zoom-in group">
                            <img 
                              src={step.section_image} 
                              alt="Isolated Pin Connections Schematic Representation" 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-170 transform origin-center" 
                            />
                            <div className="absolute bottom-2 right-2 bg-slate-950/80 text-[9px] text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700 pointer-events-none">
                              Hover Cursor Array To Zoom Connections
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Operational Telemetry Values Input Forms */}
                  <form onSubmit={handleTroubleshootStepProgression} className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Type Hardware Feedback Loop Measurement Reading</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={userReadingInput}
                        onChange={(e) => setUserReadingInput(e.target.value)}
                        placeholder="e.g., '115 Amps normal load', 'terminal check ok', or type 'problem solved'"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-xs font-semibold text-slate-200 placeholder-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      <button 
                        type="submit"
                        className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-200 transform active:scale-95 shrink-0"
                      >
                        Submit Step Evaluation ➡️
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* 📝 COMPILER AUDIT SYSTEM DATA SHEET LAYER VIEW PARSER CLOSURE SUMMARY WINDOW */}
            {conclusionData && (
              <div className="bg-slate-900 border border-emerald-500/20 p-8 rounded-3xl shadow-2xl border-t-4 border-t-emerald-400 space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-emerald-400 uppercase tracking-tight">Root Cause Investigation Analysis Matrix Consolidated</h2>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">Static validation checks closed. Record registry tracking locked successful.</p>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold font-mono px-3 py-1 rounded border border-emerald-800 uppercase tracking-widest">SUCCESS LOCK</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800"><span className="text-slate-500 font-bold uppercase">IDENTIFIED SYSTEM HUB:</span> <span className="text-slate-200">{conclusionData.system_type}</span></div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800"><span className="text-slate-500 font-bold uppercase">DOCUMENTATION TYPE:</span> <span className="text-slate-200">{conclusionData.drawing_format}</span></div>
                </div>

                {/* MAIN ROOT CAUSE LOCALIZATION SHEET TEXT BLOCK */}
                <div className="bg-emerald-950/20 border border-emerald-800/40 p-5 rounded-2xl">
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 font-mono">🛡️ Root Cause Evaluation Summary</h4>
                  <p className="text-xs font-semibold leading-relaxed text-slate-200">
                    {conclusionData.root_cause_analysis[currentLanguage] || conclusionData.root_cause_analysis['english']}
                  </p>
                </div>

                {/* LIST OF STEPS EXECUTED LOOP TRACE MATRIX DISPLAY */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 font-mono">Telemetry Trail Tracking Sequence Logs</h4>
                  <div className="space-y-2">
                    {conclusionData.detailed_audit_trail.map((log, index) => (
                      <div key={index} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-bold">Sequence Trace Node Index #{log.step_index}</span>
                        <span className="text-slate-400">Feedback Matrix Parameter Input: <strong className="text-slate-200">"{log.user_input_reading}"</strong></span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={triggerResetTroubleshooting}
                  className="w-full py-4 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold tracking-widest rounded-xl transition-all uppercase"
                >
                  Clear Session History Buffers & Return To Central Hub View
                </button>
              </div>
            )}

          </div>
        )}

        {/* 📚 MODULE NODE VIEW B: INTERACTIVE MODULAR LEARNING ENGINE ACQUISITION CURRICULUM */}
        {globalMode === 'learning' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 animate-fadeIn">
            <h2 className="text-lg font-black uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-3">Automation Engineering Asset Academy Data Vault</h2>

            <form onSubmit={handleLearningQuerySubmit} className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Input Component Name or Circuit Architecture System Query</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={learningQuery}
                  onChange={(e) => setLearningQuery(e.target.value)}
                  placeholder="e.g., VFD Dynamic Braking Resistors layout, optocoupler electrical separation bounds..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs font-semibold text-slate-200 placeholder-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button 
                  type="submit"
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl font-black"
                >
                  Query Vault Matrix 🧠
                </button>
              </div>
            </form>

            {learningResponse && (
              <div className="mt-8 border-t border-slate-800 pt-6 space-y-6 animate-fadeIn">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-base font-black text-slate-100 uppercase tracking-wide border-b border-slate-800 pb-2">{learningResponse.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-300 font-medium">
                    {learningResponse.structured_data[currentLanguage] || learningResponse.structured_data['english']}
                  </p>

                  {/* Structured Graphic Image Render Target For Component Definitions */}
                  <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Structural Assembly Reference Schematic Representation Plot</p>
                    <div className="w-full max-w-sm h-44 overflow-hidden rounded-xl border border-slate-800 bg-black">
                      <img 
                        src={learningResponse.component_schematic_url} 
                        alt="HD Curriculum Explanatory Target Frame Plot" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* END PAGE DEEP CONTINUOUS TYPING FIELD BOX COMPONENT FOR SUBSEQUENT TRACES */}
                <form onSubmit={handleLearningFollowUpSubmit} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <label className="block text-[9px] font-black text-emerald-400 uppercase tracking-widest font-mono">Request Granular Deep-Dive Trace Extensions On Current Asset</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={learningFollowUp}
                      onChange={(e) => setLearningFollowUp(e.target.value)}
                      placeholder="Ask for deeper details or clarify micro-structural attributes of this asset frame module..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 placeholder-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg uppercase tracking-wide"
                    >
                      Deep Trace Analysis ➡️
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* 🔬 MODULE NODE VIEW C: SYSTEM ENGINEERING RESEARCH POINTER MONITOR CONTROL */}
        {globalMode === 'research' && (
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl text-center space-y-4 animate-fadeIn">
            <span className="text-4xl block">🔬</span>
            <h2 className="text-base font-black text-emerald-400 uppercase tracking-widest">Advanced Systems Engineering Research Node</h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto font-medium leading-relaxed">
              Research index vectors are synced concurrently inside the primary FastAPI loop structure. Multimodal prompt structures are logged active waiting for code processing queries.
            </p>
            <div className="inline-block px-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-500 animate-pulse uppercase tracking-wider">
              Telemetry Status: Active Operational Standby Node Matrix Locked
            </div>
          </div>
        )}

      </div>
    </div>
  );
}