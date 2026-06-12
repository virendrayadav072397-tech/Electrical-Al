import React, { useState } from 'react';

export default function App() {
  const [file, setFile] = useState(null);
  const [problem, setProblem] = useState('');
  const [language, setLanguage] = useState('hinglish');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]); // {sender: 'user'|'ai', text: ''}
  const [userInput, setUserInput] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 100 * 1024 * 1024) {
      alert("File size 100MB se zyada nahi honi chahiye!");
      return;
    }
    setFile(selectedFile);
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!file || !problem) return alert("Please upload a file and describe the problem.");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('problem', problem);
    formData.append('language', language);

    try {
      const res = await fetch('https://vy0723-electrical-ai.hf.space/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setSessionId(data.session_id);
      setChat([{ sender: 'ai', text: data.response }]);
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (!userInput) return;

    const currentInput = userInput;
    setUserInput('');
    setChat((prev) => [...prev, { sender: 'user', text: currentInput }]);

    try {
      const res = await fetch('https://vy0723-electrical-ai.hf.space/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, user_input: currentInput }),
      });
      const data = await res.json();
      setChat((prev) => [...prev, { sender: 'ai', text: data.response }]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-6">
      <header className="max-w-5xl mx-auto border-b border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-yellow-500">⚡ AI Electrical Troubleshooter</h1>
        <p className="text-sm text-gray-400">Upload high-res drawings (up to 100MB) & fix problems step-by-step.</p>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT PANEL: Setup & Upload */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">1. Upload Diagnostics</h2>
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Select Preferred Language</label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-yellow-500"
              >
                <option value="hinglish">Hinglish (Mix)</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Electrical Drawing (Max 100MB)</label>
              <input 
                type="file" 
                accept=".pdf,.png,.jpg,.jpeg,.dxf" 
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-500 cursor-pointer"
              />
              {file && <p className="text-xs text-green-400 mt-1">Selected: {file.name} ({(file.size/1024/1024).toFixed(2)} MB)</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Describe the current issue</label>
              <textarea 
                rows="4" 
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="E.g., Breaker tripping continuously on load, or transformer overheating..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading || sessionId}
              className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 text-white font-bold py-2.5 px-4 rounded-lg transition duration-200"
            >
              {loading ? "Analyzing Schematic..." : sessionId ? "Analysis Complete ✅" : "Start AI Debugging"}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Iterative AI Troubleshooting Loop */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col h-[600px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">2. Live Troubleshooting Engine</h2>
          
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto space-y-4 p-2 bg-gray-900 rounded-lg mb-4 border border-gray-800">
            {chat.length === 0 && (
              <div className="text-center text-gray-500 mt-20">Aapki system analysis aur steps yahan dikhenge.</div>
            )}
            {chat.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 whitespace-pre-line text-sm ${msg.sender === 'user' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Response Form */}
          {sessionId && (
            <form onSubmit={handleNextStep} className="flex gap-2">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Give input (e.g., 'Done, meter reading is 240V' or 'Problem Solved')"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 text-sm text-white focus:ring-2 focus:ring-yellow-500"
              />
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}