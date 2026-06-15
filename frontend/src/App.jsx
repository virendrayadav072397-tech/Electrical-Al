import { useState, useRef, useEffect, useCallback } from "react";

const BASE_URL = "https://vy0723-electrical-ai.hf.space";

// ─── LANGUAGE LABELS ───────────────────────────────────────────────────────────
const LABELS = {
  english: {
    appTitle: "Electrical AI",
    appSubtitle: "Intelligent Electrical & Automation Assistant",
    selectMode: "What would you like to do?",
    troubleshoot: "Troubleshoot",
    learning: "Learning",
    research: "Research",
    uploadTitle: "Upload Electrical Drawing",
    uploadSub: "Drag & drop or click — PDF, PNG, JPG (max 100MB)",
    uploadBtn: "Browse File",
    drawingUploaded: "Drawing uploaded",
    describeIssue: "Describe Your Issue",
    describePlaceholder: `Describe the problem in detail. Examples:\n• "MH kaam nahi kr rha" (Main Hoist not working)\n• "LT nahi chal rha" (Long Travel not running)\n• "Drive fault aa gaya"\n• "Motor start nahi ho rha"`,
    letsBegin: "Let's Begin →",
    newTroubleshoot: "+ New Troubleshooting",
    solutionStep: "Step",
    yourInput: "Your Reading / Observation",
    inputPlaceholder: "Enter what you observed or measured...",
    submitInput: "Submit Reading →",
    problemSolved: "✓ Problem Solved",
    conclusionTitle: "Troubleshooting Report",
    rootCause: "Root Cause Analysis",
    stepsTitle: "Steps Performed",
    drawingRef: "Drawing Reference",
    learningTitle: "Learning Mode",
    learningPlaceholder: "Enter component or topic name...\nExamples: VFD Drive, PLC DI/DO, Contactor, Relay, Circuit Breaker, Encoder",
    learnBtn: "Learn Now →",
    researchTitle: "Research Mode",
    researchPlaceholder: "Enter your research query...\nExamples: IEC standards for motor protection, Crane electrical safety norms",
    researchBtn: "Start Research →",
    followUp: "Ask a follow-up or request deeper detail...",
    followUpBtn: "Ask →",
    menuHistory: "History",
    menuLearning: "Lessons",
    menuProfile: "Profile",
    troubleshootHistory: "Troubleshooting History",
    learningHistory: "Learning Sessions",
    changeDrawing: "Change Drawing",
    solved: "SOLVED",
    ongoing: "ONGOING",
    analyzing: "Analyzing drawing...",
    thinking: "AI is analyzing your input...",
    noFile: "Please upload a drawing first.",
    noDesc: "Please describe your issue.",
    quickInputs: ["Fault cleared", "No reading", "Fixed ✓"],
    examples: ["MH not working", "LT not running", "Drive fault", "Motor tripped"],
  },
  hindi: {
    appTitle: "इलेक्ट्रिकल AI",
    appSubtitle: "बुद्धिमान इलेक्ट्रिकल और ऑटोमेशन सहायक",
    selectMode: "आप क्या करना चाहते हैं?",
    troubleshoot: "समस्या निवारण",
    learning: "सीखना",
    research: "अनुसंधान",
    uploadTitle: "ड्रॉइंग अपलोड करें",
    uploadSub: "खींचें या क्लिक करें — PDF, PNG, JPG (अधिकतम 100MB)",
    uploadBtn: "फ़ाइल चुनें",
    drawingUploaded: "ड्रॉइंग अपलोड हो गई",
    describeIssue: "अपनी समस्या बताएं",
    describePlaceholder: "समस्या का विस्तार से वर्णन करें...\nउदाहरण: MH काम नहीं कर रहा, LT नहीं चल रहा, ड्राइव फॉल्ट आ गया",
    letsBegin: "शुरू करें →",
    newTroubleshoot: "+ नई समस्या निवारण",
    solutionStep: "चरण",
    yourInput: "आपकी रीडिंग / अवलोकन",
    inputPlaceholder: "आपने जो देखा या मापा वह दर्ज करें...",
    submitInput: "रीडिंग जमा करें →",
    problemSolved: "✓ समस्या हल हो गई",
    conclusionTitle: "समस्या निवारण रिपोर्ट",
    rootCause: "मूल कारण विश्लेषण",
    stepsTitle: "किए गए चरण",
    drawingRef: "ड्रॉइंग संदर्भ",
    learningTitle: "सीखने का मोड",
    learningPlaceholder: "घटक या विषय का नाम दर्ज करें...",
    learnBtn: "अभी सीखें →",
    researchTitle: "अनुसंधान मोड",
    researchPlaceholder: "अपनी अनुसंधान क्वेरी दर्ज करें...",
    researchBtn: "अनुसंधान शुरू करें →",
    followUp: "अनुवर्ती प्रश्न पूछें...",
    followUpBtn: "पूछें →",
    menuHistory: "इतिहास",
    menuLearning: "पाठ",
    menuProfile: "प्रोफ़ाइल",
    troubleshootHistory: "समस्या निवारण इतिहास",
    learningHistory: "सीखने के सत्र",
    changeDrawing: "ड्रॉइंग बदलें",
    solved: "हल",
    ongoing: "जारी",
    analyzing: "ड्रॉइंग का विश्लेषण हो रहा है...",
    thinking: "AI विश्लेषण कर रहा है...",
    noFile: "कृपया पहले ड्रॉइंग अपलोड करें।",
    noDesc: "कृपया अपनी समस्या बताएं।",
    quickInputs: ["फॉल्ट ठीक हो गया", "कोई रीडिंग नहीं", "ठीक हो गया ✓"],
    examples: ["MH काम नहीं कर रहा", "LT नहीं चल रहा", "ड्राइव फॉल्ट", "मोटर ट्रिप हो गई"],
  },
  hinglish: {
    appTitle: "Electrical AI",
    appSubtitle: "Aapka Smart Electrical & Automation Saathi",
    selectMode: "Aap kya karna chahte hain?",
    troubleshoot: "Troubleshoot Karo",
    learning: "Seekho",
    research: "Research Karo",
    uploadTitle: "Electrical Drawing Upload Karo",
    uploadSub: "Drag & drop karo ya click karo — PDF, PNG, JPG (max 100MB)",
    uploadBtn: "File Choose Karo",
    drawingUploaded: "Drawing upload ho gayi ✓",
    describeIssue: "Apni Problem Batao",
    describePlaceholder: `Problem detail me batao. Examples:\n• "MH kaam nahi kr rha"\n• "LT nahi chal rha"\n• "Drive fault aa gaya"\n• "Motor start nahi ho rha"`,
    letsBegin: "Chalo Shuru Karte Hain →",
    newTroubleshoot: "+ Nayi Troubleshooting Shuru Karo",
    solutionStep: "Step",
    yourInput: "Tumhari Reading / Observation",
    inputPlaceholder: "Jo tumne dekha ya measure kiya vo likho...",
    submitInput: "Reading Submit Karo →",
    problemSolved: "✓ Problem Solve Ho Gayi!",
    conclusionTitle: "Troubleshooting Report",
    rootCause: "Root Cause Analysis",
    stepsTitle: "Kiye Gaye Steps",
    drawingRef: "Drawing Reference",
    learningTitle: "Learning Mode",
    learningPlaceholder: "Component ya topic ka naam likho...\nExamples: VFD Drive, PLC DI/DO, Contactor, Relay, Circuit Breaker",
    learnBtn: "Seekhna Shuru Karo →",
    researchTitle: "Research Mode",
    researchPlaceholder: "Research query likho...",
    researchBtn: "Research Shuru Karo →",
    followUp: "Aur sawaal pucho ya zyada detail maango...",
    followUpBtn: "Pucho →",
    menuHistory: "History",
    menuLearning: "Lessons",
    menuProfile: "Profile",
    troubleshootHistory: "Troubleshooting History",
    learningHistory: "Learning Sessions",
    changeDrawing: "Drawing Badlo",
    solved: "SOLVE",
    ongoing: "CHAL RAHA HAI",
    analyzing: "Drawing analyze ho rahi hai...",
    thinking: "AI tumhara input samajh raha hai...",
    noFile: "Pehle drawing upload karo.",
    noDesc: "Apni problem batao.",
    quickInputs: ["Fault clear ho gaya", "Koi reading nahi", "Theek ho gaya ✓"],
    examples: ["MH kaam nahi kr rha", "LT nahi chal rha", "Drive fault aa gaya", "Motor trip ho gaya"],
  },
};

// ─── DRAWING HIGHLIGHT ──────────────────────────────────────────────────────────
function DrawingHighlight({ imageDataUrl, highlightInfo, lang }) {
  if (!imageDataUrl) return null;
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #f59e0b", borderRadius: 10,
      padding: "12px", marginTop: 12
    }}>
      <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
        📐 {LABELS[lang].drawingRef} {highlightInfo?.component_tag ? `— TAG: ${highlightInfo.component_tag}` : ""}
      </div>
      <div style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
        <img src={imageDataUrl} alt="drawing" style={{ width: "100%", borderRadius: 8, display: "block" }} />
        {highlightInfo?.drawing_highlight && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "rgba(245,158,11,0.9)", padding: "6px 10px",
            fontSize: 12, color: "#000", fontWeight: 600
          }}>
            🔍 {highlightInfo.drawing_highlight}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SPINNER ───────────────────────────────────────────────────────────────────
function Spinner({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "#1e293b", borderRadius: 10, margin: "10px 0" }}>
      <div style={{
        width: 18, height: 18, border: "3px solid #334155", borderTop: "3px solid #f59e0b",
        borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0
      }} />
      <span style={{ color: "#94a3b8", fontSize: 13 }}>{text || "Processing..."}</span>
    </div>
  );
}

// ─── PARSE AI RESPONSE ─────────────────────────────────────────────────────────
function parseAIResponse(text) {
  let highlight = null;
  let conclusion = null;
  let cleanText = text;

  const jsonMatches = text.match(/\{[^{}]*"drawing_highlight"[^{}]*\}/g);
  if (jsonMatches) {
    try {
      highlight = JSON.parse(jsonMatches[jsonMatches.length - 1]);
      cleanText = cleanText.replace(/\{[^{}]*"drawing_highlight"[^{}]*\}/g, "").trim();
    } catch (_) {}
  }

  const conclusionMatch = text.match(/\{[^{}]*"conclusion"\s*:\s*true[\s\S]*?\}/);
  if (conclusionMatch) {
    try {
      conclusion = JSON.parse(conclusionMatch[0]);
      cleanText = cleanText.replace(conclusionMatch[0], "").trim();
    } catch (_) {}
  }

  return { cleanText, highlight, conclusion };
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("hinglish");
  const [mode, setMode] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [menuTab, setMenuTab] = useState("history");

  // Troubleshoot
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState(null);
  const [issueDesc, setIssueDesc] = useState("");
  const [tsStarted, setTsStarted] = useState(false);
  const [tsMessages, setTsMessages] = useState([]);
  const [tsInput, setTsInput] = useState("");
  const [tsLoading, setTsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [tsSolved, setTsSolved] = useState(false);
  const [tsConclusion, setTsConclusion] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Learning/Research
  const [lrQuery, setLrQuery] = useState("");
  const [lrMessages, setLrMessages] = useState([]);
  const [lrInput, setLrInput] = useState("");
  const [lrLoading, setLrLoading] = useState(false);
  const [lrStarted, setLrStarted] = useState(false);
  const [lrConversation, setLrConversation] = useState([]);

  // History
  const [troubleshootHistory, setTroubleshootHistory] = useState([]);
  const [learningHistory, setLearningHistory] = useState([]);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const L = LABELS[lang];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tsMessages, lrMessages, tsLoading, lrLoading]);

  // ── FILE HANDLING ──────────────────────────────────────────────────────────
  const handleFile = useCallback((file) => {
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) { alert("File too large. Max 100MB."); return; }
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) { alert("Only PDF, PNG, JPG allowed."); return; }
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (file.type !== "application/pdf") setUploadedImageDataUrl(e.target.result);
      else setUploadedImageDataUrl(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  // ── TROUBLESHOOT START → POST /api/upload ─────────────────────────────────
  async function startTroubleshoot() {
    if (!uploadedFile) { alert(L.noFile); return; }
    if (!issueDesc.trim()) { alert(L.noDesc); return; }
    setTsStarted(true);
    setTsLoading(true);
    setTsMessages([]);
    setTsSolved(false);
    setTsConclusion(null);

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("problem", issueDesc);
    formData.append("language", lang);

    try {
      const res = await fetch(`${BASE_URL}/api/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setSessionId(data.session_id);
      const { cleanText, highlight, conclusion } = parseAIResponse(data.response);
      if (conclusion) { setTsConclusion(conclusion); setTsSolved(true); }
      setTsMessages([{ role: "ai", text: cleanText, highlight, stepNumber: 1 }]);
      setTroubleshootHistory(prev => [{ date: new Date().toLocaleDateString(), issue: issueDesc, status: "ongoing" }, ...prev].slice(0, 20));
    } catch (err) {
      setTsMessages([{ role: "ai", text: `Connection error: ${err.message}. Please check backend is running.`, highlight: null, stepNumber: 1 }]);
    }
    setTsLoading(false);
  }

  // ── TROUBLESHOOT CONTINUE → POST /api/chat ────────────────────────────────
  async function submitTsInput() {
    if (!tsInput.trim() || tsSolved || !sessionId) return;
    const userText = tsInput.trim();
    setTsInput("");
    setTsMessages(prev => [...prev, { role: "user", text: userText }]);
    setTsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, user_input: userText }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const { cleanText, highlight, conclusion } = parseAIResponse(data.response);
      const stepN = tsMessages.filter(m => m.role === "ai").length + 1;
      if (conclusion) {
        setTsConclusion(conclusion);
        setTsSolved(true);
        setTroubleshootHistory(prev => prev.map((h, i) => i === 0 ? { ...h, status: "solved" } : h));
      }
      setTsMessages(prev => [...prev, { role: "ai", text: cleanText, highlight, stepNumber: stepN }]);
    } catch (err) {
      setTsMessages(prev => [...prev, { role: "ai", text: `Error: ${err.message}`, highlight: null, stepNumber: 0 }]);
    }
    setTsLoading(false);
  }

  // ── LEARNING/RESEARCH → POST /api/chat with session ──────────────────────
  async function startLR() {
    if (!lrQuery.trim()) return;
    setLrStarted(true);
    setLrLoading(true);
    setLrMessages([]);

    // Learning/Research uses /api/upload with a dummy text "file"
    const formData = new FormData();
    const blob = new Blob([`MODE:${mode.toUpperCase()}\nQUERY:${lrQuery}`], { type: "text/plain" });
    formData.append("file", blob, "query.txt");
    formData.append("problem", `${mode === "learning" ? "LEARNING REQUEST" : "RESEARCH REQUEST"}: ${lrQuery}`);
    formData.append("language", lang);

    try {
      const res = await fetch(`${BASE_URL}/api/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setSessionId(data.session_id);
      setLrConversation([data.session_id]);
      setLrMessages([{ role: "ai", text: data.response }]);
      setLearningHistory(prev => [{ date: new Date().toLocaleDateString(), query: lrQuery, mode }, ...prev].slice(0, 20));
    } catch (err) {
      setLrMessages([{ role: "ai", text: `Error: ${err.message}` }]);
    }
    setLrLoading(false);
  }

  async function submitLRFollowUp() {
    if (!lrInput.trim() || !sessionId) return;
    const userText = lrInput.trim();
    setLrInput("");
    setLrMessages(prev => [...prev, { role: "user", text: userText }]);
    setLrLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, user_input: userText }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setLrMessages(prev => [...prev, { role: "ai", text: data.response }]);
    } catch (err) {
      setLrMessages(prev => [...prev, { role: "ai", text: `Error: ${err.message}` }]);
    }
    setLrLoading(false);
  }

  // ── RESET ──────────────────────────────────────────────────────────────────
  function newTroubleshoot() {
    setTsStarted(false); setTsMessages([]); setTsInput("");
    setTsSolved(false); setTsConclusion(null); setSessionId(null);
    setUploadedFile(null); setUploadedImageDataUrl(null); setIssueDesc("");
  }

  function resetLR() {
    setLrStarted(false); setLrMessages([]); setLrInput(""); setLrQuery(""); setSessionId(null);
  }

  // ── CONCLUSION PAGE ────────────────────────────────────────────────────────
  function ConclusionPage() {
    return (
      <div style={{ padding: "20px 0" }}>
        <div style={{
          background: "linear-gradient(135deg, #064e3b, #065f46)", borderRadius: 14,
          padding: "20px 24px", marginBottom: 20, border: "1px solid #10b981"
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#10b981", marginBottom: 6 }}>✅ {L.conclusionTitle}</div>
          <div style={{ color: "#6ee7b7", fontSize: 13 }}>{issueDesc}</div>
        </div>

        {tsConclusion?.root_cause && (
          <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px", marginBottom: 16, border: "1px solid #f59e0b" }}>
            <div style={{ color: "#f59e0b", fontWeight: 700, marginBottom: 8, fontSize: 14 }}>🔍 {L.rootCause}</div>
            <div style={{ color: "#e2e8f0", lineHeight: 1.7, fontSize: 14 }}>{tsConclusion.root_cause}</div>
          </div>
        )}

        <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ color: "#94a3b8", fontWeight: 700, marginBottom: 12, fontSize: 13 }}>📋 {L.stepsTitle}</div>
          {tsMessages.map((m, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, marginBottom: 10,
              padding: "10px 14px", borderRadius: 8,
              background: m.role === "ai" ? "#0f172a" : "#1a2744",
              border: `1px solid ${m.role === "ai" ? "#334155" : "#2d3f6b"}`
            }}>
              <div style={{
                minWidth: 28, height: 28, borderRadius: "50%",
                background: m.role === "ai" ? "#f59e0b" : "#3b82f6",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "#000", flexShrink: 0
              }}>
                {m.role === "ai" ? "AI" : "U"}
              </div>
              <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          ))}
        </div>

        <button onClick={newTroubleshoot} style={{
          width: "100%", padding: "14px", background: "#f59e0b", color: "#000",
          border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer"
        }}>
          {L.newTroubleshoot}
        </button>
      </div>
    );
  }

  // ── TROUBLESHOOT CHAT ──────────────────────────────────────────────────────
  function TroubleshootChat() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{
          background: "#1e293b", borderRadius: 12, padding: "12px 16px", marginBottom: 14,
          display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #334155"
        }}>
          <div>
            <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>🔧 TROUBLESHOOTING SESSION</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{uploadedFile?.name}</div>
          </div>
          <button onClick={newTroubleshoot} style={{
            padding: "6px 12px", background: "#0f172a", color: "#f59e0b",
            border: "1px solid #f59e0b", borderRadius: 8, fontSize: 11, cursor: "pointer", fontWeight: 600
          }}>
            {L.newTroubleshoot}
          </button>
        </div>

        <div style={{
          background: "#172033", borderRadius: 10, padding: "10px 14px", marginBottom: 14,
          border: "1px solid #1e3a5f", fontSize: 13, color: "#94a3b8"
        }}>
          <span style={{ color: "#60a5fa", fontWeight: 600 }}>Problem: </span>{issueDesc}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tsMessages.map((m, i) => (
            <div key={i}>
              {m.role === "ai" ? (
                <div style={{ background: "#0f172a", borderRadius: 12, padding: "16px 18px", border: "1px solid #1e293b" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ background: "#f59e0b", color: "#000", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>
                      ⚡ {L.solutionStep} {m.stepNumber}
                    </div>
                  </div>
                  <div style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{m.text}</div>
                  {m.highlight && uploadedImageDataUrl && (
                    <DrawingHighlight imageDataUrl={uploadedImageDataUrl} highlightInfo={m.highlight} lang={lang} />
                  )}
                  {m.highlight?.component_tag && (
                    <div style={{
                      marginTop: 10, display: "inline-block", background: "#1e3a5f",
                      color: "#60a5fa", padding: "4px 10px", borderRadius: 6,
                      fontSize: 12, fontWeight: 700, border: "1px solid #2d5fa6"
                    }}>
                      🏷️ TAG: {m.highlight.component_tag}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{
                    background: "#1a2744", borderRadius: 12, padding: "12px 16px",
                    border: "1px solid #2d3f6b", maxWidth: "85%"
                  }}>
                    <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>👷 Your Reading</div>
                    <div style={{ color: "#e2e8f0", fontSize: 14, whiteSpace: "pre-wrap" }}>{m.text}</div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {tsLoading && <Spinner text={L.thinking} />}
          {tsSolved && tsConclusion && <ConclusionPage />}
        </div>

        {!tsSolved && (
          <div style={{ marginTop: 16, background: "#0f172a", borderRadius: 12, padding: "14px", border: "1px solid #1e293b" }}>
            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>📟 {L.yourInput}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <textarea
                value={tsInput}
                onChange={e => setTsInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) submitTsInput(); }}
                placeholder={L.inputPlaceholder}
                disabled={tsLoading}
                rows={2}
                style={{
                  flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
                  padding: "10px 12px", color: "#e2e8f0", fontSize: 13, resize: "none",
                  fontFamily: "inherit", outline: "none"
                }}
              />
              <button onClick={submitTsInput} disabled={tsLoading || !tsInput.trim()} style={{
                background: tsLoading || !tsInput.trim() ? "#334155" : "#f59e0b",
                color: "#000", border: "none", borderRadius: 8,
                padding: "0 16px", cursor: tsLoading ? "default" : "pointer",
                fontWeight: 700, fontSize: 16, minWidth: 48
              }}>→</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {L.quickInputs.map(q => (
                <button key={q} onClick={() => setTsInput(q)} style={{
                  background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
                  color: "#94a3b8", padding: "4px 10px", fontSize: 11, cursor: "pointer"
                }}>{q}</button>
              ))}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    );
  }

  // ── LR CHAT ────────────────────────────────────────────────────────────────
  function LRChat() {
    return (
      <div>
        <div style={{
          background: "#1e293b", borderRadius: 12, padding: "12px 16px", marginBottom: 14,
          display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #334155"
        }}>
          <div>
            <div style={{ color: mode === "learning" ? "#818cf8" : "#34d399", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
              {mode === "learning" ? "📚 LEARNING" : "🔬 RESEARCH"} SESSION
            </div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{lrQuery}</div>
          </div>
          <button onClick={resetLR} style={{
            padding: "6px 12px", background: "#0f172a",
            color: mode === "learning" ? "#818cf8" : "#34d399",
            border: `1px solid ${mode === "learning" ? "#818cf8" : "#34d399"}`,
            borderRadius: 8, fontSize: 11, cursor: "pointer", fontWeight: 600
          }}>New Query</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {lrMessages.map((m, i) => (
            <div key={i}>
              {m.role === "ai" ? (
                <div style={{ background: "#0f172a", borderRadius: 12, padding: "18px 20px", border: "1px solid #1e293b" }}>
                  <div style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{m.text}</div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ background: "#1a2744", borderRadius: 12, padding: "12px 16px", border: "1px solid #2d3f6b", maxWidth: "85%" }}>
                    <div style={{ color: "#e2e8f0", fontSize: 14 }}>{m.text}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {lrLoading && <Spinner text={L.thinking} />}
        </div>

        {lrStarted && !lrLoading && (
          <div style={{ marginTop: 16, background: "#0f172a", borderRadius: 12, padding: "14px", border: "1px solid #1e293b" }}>
            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 8 }}>{L.followUp}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input value={lrInput} onChange={e => setLrInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") submitLRFollowUp(); }}
                placeholder="Ask more..."
                style={{
                  flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
                  padding: "10px 12px", color: "#e2e8f0", fontSize: 13, outline: "none"
                }}
              />
              <button onClick={submitLRFollowUp} disabled={!lrInput.trim()} style={{
                background: lrInput.trim() ? (mode === "learning" ? "#818cf8" : "#34d399") : "#334155",
                color: "#000", border: "none", borderRadius: 8,
                padding: "0 16px", cursor: "pointer", fontWeight: 700, fontSize: 14
              }}>{L.followUpBtn}</button>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    );
  }

  // ── SIDE MENU ──────────────────────────────────────────────────────────────
  function SideMenu() {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 290,
        background: "#0b1120", borderRight: "1px solid #1e293b",
        zIndex: 1000, padding: "60px 20px 20px", overflowY: "auto",
        transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease"
      }}>
        <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 17, marginBottom: 22 }}>⚡ Electrical AI</div>
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderRadius: 8, overflow: "hidden", border: "1px solid #1e293b" }}>
          {["history", "learning", "profile"].map(tab => (
            <button key={tab} onClick={() => setMenuTab(tab)} style={{
              flex: 1, padding: "8px 0", background: menuTab === tab ? "#f59e0b" : "#0f172a",
              color: menuTab === tab ? "#000" : "#64748b", border: "none",
              fontSize: 10, fontWeight: 700, cursor: "pointer", textTransform: "uppercase"
            }}>{LABELS[lang][`menu${tab.charAt(0).toUpperCase() + tab.slice(1)}`] || tab}</button>
          ))}
        </div>

        {menuTab === "history" && (
          <div>
            <div style={{ color: "#64748b", fontSize: 11, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>{L.troubleshootHistory}</div>
            {troubleshootHistory.length === 0 ? (
              <div style={{ color: "#334155", fontSize: 13, padding: "12px 0" }}>No sessions yet</div>
            ) : troubleshootHistory.map((s, i) => (
              <div key={i} style={{ background: "#1e293b", borderRadius: 8, padding: "10px 12px", marginBottom: 8, border: "1px solid #334155" }}>
                <div style={{ color: "#e2e8f0", fontSize: 12, marginBottom: 4 }}>{s.issue}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#475569", fontSize: 11 }}>{s.date}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                    background: s.status === "solved" ? "#064e3b" : "#1e3a5f",
                    color: s.status === "solved" ? "#10b981" : "#60a5fa"
                  }}>{s.status === "solved" ? L.solved : L.ongoing}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {menuTab === "learning" && (
          <div>
            <div style={{ color: "#64748b", fontSize: 11, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>{L.learningHistory}</div>
            {learningHistory.length === 0 ? (
              <div style={{ color: "#334155", fontSize: 13, padding: "12px 0" }}>No sessions yet</div>
            ) : learningHistory.map((s, i) => (
              <div key={i} style={{ background: "#1e293b", borderRadius: 8, padding: "10px 12px", marginBottom: 8, border: "1px solid #334155" }}>
                <div style={{ color: "#e2e8f0", fontSize: 12, marginBottom: 4 }}>{s.query}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#475569", fontSize: 11 }}>{s.date}</span>
                  <span style={{ color: "#818cf8", fontSize: 11, fontWeight: 700 }}>{s.mode?.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {menuTab === "profile" && (
          <div>
            <div style={{ background: "#1e293b", borderRadius: 12, padding: "20px", border: "1px solid #334155", textAlign: "center" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, margin: "0 auto 12px"
              }}>👷</div>
              <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14 }}>Field Engineer</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>Electrical & Automation</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 20 }}>{troubleshootHistory.length}</div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>Sessions</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#818cf8", fontWeight: 800, fontSize: 20 }}>{learningHistory.length}</div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>Lessons</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── HOME SCREEN ────────────────────────────────────────────────────────────
  function HomeScreen() {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 32, paddingTop: 8 }}>
          <div style={{ fontSize: 46, marginBottom: 8, filter: "drop-shadow(0 0 20px #f59e0b55)" }}>⚡</div>
          <h1 style={{
            fontSize: 32, fontWeight: 900, margin: 0, lineHeight: 1.1,
            background: "linear-gradient(135deg, #f59e0b, #fbbf24, #fde68a)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>{L.appTitle}</h1>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 8 }}>{L.appSubtitle}</p>
        </div>

        {/* Mode buttons */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ color: "#64748b", fontSize: 11, fontWeight: 700, textAlign: "center", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
            {L.selectMode}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { key: "troubleshoot", label: L.troubleshoot, icon: "🔧", color: "#f59e0b" },
              { key: "learning", label: L.learning, icon: "📚", color: "#818cf8" },
              { key: "research", label: L.research, icon: "🔬", color: "#34d399" },
            ].map(m => (
              <button key={m.key} onClick={() => { setMode(m.key); setTsStarted(false); setLrStarted(false); }} style={{
                background: mode === m.key ? `${m.color}18` : "#0f172a",
                border: `2px solid ${mode === m.key ? m.color : "#1e293b"}`,
                borderRadius: 14, padding: "16px 8px", cursor: "pointer", textAlign: "center", transition: "all 0.2s"
              }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
                <div style={{ color: mode === m.key ? m.color : "#94a3b8", fontWeight: 700, fontSize: 11 }}>{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* TROUBLESHOOT PANEL */}
        {mode === "troubleshoot" && !tsStarted && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                background: dragOver ? "#1e3a5f" : "#0f172a",
                border: `2px dashed ${dragOver ? "#f59e0b" : uploadedFile ? "#10b981" : "#1e293b"}`,
                borderRadius: 14, padding: "24px 20px", textAlign: "center",
                cursor: "pointer", transition: "all 0.2s"
              }}
              onClick={() => !uploadedFile && fileInputRef.current?.click()}
            >
              {uploadedFile ? (
                <div>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{uploadedFile.type === "application/pdf" ? "📄" : "🖼️"}</div>
                  <div style={{ color: "#10b981", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>✓ {L.drawingUploaded}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginBottom: 10 }}>{uploadedFile.name}</div>
                  {uploadedImageDataUrl && (
                    <img src={uploadedImageDataUrl} alt="preview" style={{
                      maxHeight: 110, maxWidth: "100%", borderRadius: 8,
                      border: "1px solid #334155", marginBottom: 10, display: "block", margin: "0 auto 10px"
                    }} />
                  )}
                  <button onClick={e => { e.stopPropagation(); setUploadedFile(null); setUploadedImageDataUrl(null); }} style={{
                    background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
                    color: "#94a3b8", padding: "5px 12px", fontSize: 12, cursor: "pointer"
                  }}>{L.changeDrawing}</button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 34, marginBottom: 10 }}>📐</div>
                  <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{L.uploadTitle}</div>
                  <div style={{ color: "#475569", fontSize: 12, marginBottom: 14 }}>{L.uploadSub}</div>
                  <button style={{
                    background: "#f59e0b", color: "#000", border: "none",
                    borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer"
                  }} onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>{L.uploadBtn}</button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg"
                style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            {uploadedFile && (
              <div style={{ background: "#0f172a", borderRadius: 14, padding: "16px", border: "1px solid #1e293b" }}>
                <div style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>🗣️ {L.describeIssue}</div>
                <textarea value={issueDesc} onChange={e => setIssueDesc(e.target.value)}
                  placeholder={L.describePlaceholder} rows={4} style={{
                    width: "100%", background: "#1e293b", border: "1px solid #334155",
                    borderRadius: 8, padding: "12px", color: "#e2e8f0", fontSize: 13,
                    resize: "none", fontFamily: "inherit", outline: "none",
                    boxSizing: "border-box", lineHeight: 1.6
                  }} />
                <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {L.examples.map(ex => (
                    <button key={ex} onClick={() => setIssueDesc(ex)} style={{
                      background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
                      color: "#94a3b8", padding: "4px 10px", fontSize: 11, cursor: "pointer"
                    }}>{ex}</button>
                  ))}
                </div>
              </div>
            )}

            {uploadedFile && issueDesc && (
              <button onClick={startTroubleshoot} style={{
                width: "100%", padding: "16px",
                background: "linear-gradient(135deg, #d97706, #f59e0b)",
                color: "#000", border: "none", borderRadius: 12,
                fontSize: 16, fontWeight: 800, cursor: "pointer",
                boxShadow: "0 4px 24px #f59e0b33"
              }}>{L.letsBegin}</button>
            )}
          </div>
        )}

        {/* LEARNING / RESEARCH PANEL */}
        {(mode === "learning" || mode === "research") && !lrStarted && (
          <div style={{ background: "#0f172a", borderRadius: 14, padding: "20px", border: "1px solid #1e293b" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
              {mode === "learning" ? `📚 ${L.learningTitle}` : `🔬 ${L.researchTitle}`}
            </div>
            <textarea value={lrQuery} onChange={e => setLrQuery(e.target.value)}
              placeholder={mode === "learning" ? L.learningPlaceholder : L.researchPlaceholder}
              rows={4} style={{
                width: "100%", background: "#1e293b", border: "1px solid #334155",
                borderRadius: 8, padding: "12px", color: "#e2e8f0", fontSize: 13,
                resize: "none", fontFamily: "inherit", outline: "none",
                boxSizing: "border-box", lineHeight: 1.6
              }} />
            {mode === "learning" && (
              <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["VFD Drive", "PLC DI/DO", "Contactor", "VVVF Drive", "Encoder", "Safety Relay"].map(ex => (
                  <button key={ex} onClick={() => setLrQuery(ex)} style={{
                    background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
                    color: "#94a3b8", padding: "4px 10px", fontSize: 11, cursor: "pointer"
                  }}>{ex}</button>
                ))}
              </div>
            )}
            <button onClick={startLR} disabled={!lrQuery.trim()} style={{
              width: "100%", marginTop: 14, padding: "14px",
              background: lrQuery.trim()
                ? (mode === "learning" ? "linear-gradient(135deg, #4f46e5, #818cf8)" : "linear-gradient(135deg, #059669, #34d399)")
                : "#1e293b",
              color: lrQuery.trim() ? "#fff" : "#475569", border: "none", borderRadius: 10,
              fontSize: 15, fontWeight: 700, cursor: lrQuery.trim() ? "pointer" : "default"
            }}>
              {mode === "learning" ? L.learnBtn : L.researchBtn}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top, #0d1b2a 0%, #060d18 60%, #000 100%)",
      fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#e2e8f0"
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        textarea::placeholder { color: #475569; }
        input::placeholder { color: #475569; }
      `}</style>

      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999 }} />}
      <SideMenu />

      {/* TOP BAR */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(6,13,24,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e293b",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", height: 52
      }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 8,
          display: "flex", flexDirection: "column", gap: 5
        }}>
          {[0,1,2].map(i => <span key={i} style={{ display: "block", width: 22, height: 2, background: "#94a3b8", borderRadius: 2 }} />)}
        </button>

        <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 16 }}>⚡ {L.appTitle}</div>

        {/* LANGUAGE SELECTOR */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setLangOpen(!langOpen)} style={{
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8,
            padding: "6px 12px", color: "#94a3b8", fontSize: 12,
            cursor: "pointer", fontWeight: 600
          }}>
            🌐 {lang === "hinglish" ? "HG" : lang === "hindi" ? "HI" : "EN"} ▾
          </button>
          {langOpen && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 6px)",
              background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10,
              overflow: "hidden", zIndex: 200, minWidth: 130,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
            }}>
              {[["english","🇬🇧 English"],["hindi","🇮🇳 हिन्दी"],["hinglish","🔀 Hinglish"]].map(([l, label]) => (
                <button key={l} onClick={() => { setLang(l); setLangOpen(false); }} style={{
                  width: "100%", padding: "10px 16px", background: lang === l ? "#1e293b" : "none",
                  border: "none", color: lang === l ? "#f59e0b" : "#94a3b8",
                  fontSize: 13, cursor: "pointer", textAlign: "left", fontWeight: lang === l ? 700 : 400
                }}>{label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 40px" }}>
        {mode === "troubleshoot" && tsStarted ? <TroubleshootChat />
          : (mode === "learning" || mode === "research") && lrStarted ? <LRChat />
          : <HomeScreen />}
      </div>
    </div>
  );
}
