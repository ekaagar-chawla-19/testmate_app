import React, { useState, useEffect, useRef } from "react";
import { 
  Home,
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Settings, 
  Bell, 
  Search, 
  ArrowLeft, 
  Clock, 
  TrendingUp, 
  Brain, 
  Send, 
  Loader2, 
  AlertTriangle,
  Users2,
  CalendarDays,
  User as UserIcon,
  Filter,
  Trophy,
  X,
  Info,
  MessageSquare,
  ShieldAlert,
  GraduationCap
} from "lucide-react";

const apiKey = ""; // Provided by environment

const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, className = "", variant = "primary", disabled = false }) => {
  const variants = {
    primary: "bg-[#6D28D9] text-white hover:bg-[#5B21B6] shadow-md hover:shadow-lg", 
    gold: "bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-md hover:shadow-lg", 
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
    ghost: "text-[#6D28D9] hover:bg-purple-50",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
  };
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default function App() {
  const teacherProfile = {
    name: "Mr. Alex",
    class: "10th Grade Calculus",
    department: "Math"
  };

  const syncPartners = [
    { name: "Dr. Aris", subject: "Biology", sharedStudents: "85%", testsThisMonth: 4, color: "bg-blue-500", textColor: "text-blue-700" },
    { name: "Mrs. Miller", subject: "English II", sharedStudents: "82%", testsThisMonth: 3, color: "bg-purple-500", textColor: "text-purple-700" },
    { name: "Mr. Roberts", subject: "Chemistry", sharedStudents: "78%", testsThisMonth: 5, color: "bg-emerald-500", textColor: "text-emerald-700" }
  ];

  const [scheduledTests, setScheduledTests] = useState([
    { id: 1, day: 25, subject: "Math", teacher: "Mr. Alex", title: "Calculus Unit 2", color: "bg-[#6D28D9]" },
    { id: 2, day: 2, subject: "Math", teacher: "Mr. Alex", title: "Limits Quiz", color: "bg-[#6D28D9]" },
    { id: 3, day: 4, subject: "Science", teacher: "Dr. Aris", title: "Photosynthesis Lab", color: "bg-blue-500" },
    { id: 4, day: 16, subject: "Science", teacher: "Dr. Aris", title: "Biology Test", color: "bg-blue-500" },
    { id: 5, day: 19, subject: "English", teacher: "Mrs. Miller", title: "Macbeth Essay", color: "bg-purple-500" },
    { id: 6, day: 19, subject: "Science", teacher: "Mr. Roberts", title: "Chemistry Quiz", color: "bg-emerald-500" },
    { id: 7, day: 12, subject: "Science", teacher: "Mr. Roberts", title: "Stoichiometry", color: "bg-emerald-500" },
    { id: 8, day: 28, subject: "Science", teacher: "Mr. Roberts", title: "Gas Laws Final", color: "bg-emerald-500" }
  ]);

  const [screen, setScreen] = useState("home");
  const [selectedDay, setSelectedDay] = useState(15);
  const [showModal, setShowModal] = useState(false);
  const [testTitle, setTestTitle] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: `Hello Mr. Alex! I'm focusing on your Top 3 Sync Partners: Aris, Miller, and Roberts. May 19th is currently a high-density day for your shared roster. How can I help you sync your schedule?` 
    }
  ]);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const scrollRef = useRef(null);

  const getTestsOnDay = (day) => scheduledTests.filter(t => t.day === day);
  const conflictsOnSelected = getTestsOnDay(selectedDay);

  const handleScheduleTest = () => {
    if (!testTitle || !selectedDay) return;
    const newTest = {
      id: Date.now(),
      day: selectedDay,
      subject: "Math",
      teacher: teacherProfile.name,
      title: testTitle,
      color: "bg-[#6D28D9]"
    };
    setScheduledTests([...scheduledTests, newTest]);
    setTestTitle("");
    setShowModal(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setIsTyping(true);

    const systemPrompt = `You are the TestMate Schedule Advisor for ${teacherProfile.name}. Help coordinate with Aris, Miller, and Roberts. Recommend low-density days like May 20 or 24.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMsg }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I've analyzed the student rosters. May 21st or 27th appear to be conflict-free for your core sync group.";
      setMessages(prev => [...prev, { role: "assistant", content: resultText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble analyzing the schedule right now. Generally, the last week of May looks best." }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  return (
    <div className="min-h-screen bg-[#FDFCFE] font-sans text-slate-900 pb-12 text-left">
      {/* --- TOP NAV --- */}
      <nav className="bg-white border-b border-slate-200 h-20 flex items-center px-12 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 mr-12 cursor-pointer" onClick={() => setScreen("home")}>
          <div className="w-12 h-12 bg-[#6D28D9] rounded-2xl flex items-center justify-center text-white shadow-lg">
            <CalendarDays size={28} />
          </div>
          <span className="text-3xl font-black tracking-tighter text-[#6D28D9]">TestMate</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 flex-1">
          <button onClick={() => setScreen("home")} className={`text-sm font-black uppercase tracking-widest transition-all ${screen === "home" ? "text-[#6D28D9] border-b-4 border-[#6D28D9] py-7" : "text-slate-400"}`}>Dashboard</button>
          <button onClick={() => setScreen("advisor")} className={`text-sm font-black uppercase tracking-widest transition-all ${screen === "advisor" ? "text-[#6D28D9] border-b-4 border-[#6D28D9] py-7" : "text-slate-400"}`}>Sync Advisor</button>
          <button className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-[#6D28D9] transition-colors">Shared Rosters</button>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-base font-black text-slate-800 leading-none">{teacherProfile.name}</p>
            <p className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-widest mt-1.5">{teacherProfile.class}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 border-2 border-amber-200 shadow-sm cursor-pointer hover:bg-amber-200 transition-colors">
            <UserIcon size={24} />
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-10 flex flex-col xl:flex-row gap-12">
        
        {/* --- LEFT SECTION: CALENDAR OR ADVISOR --- */}
        <div className="flex-[3] space-y-8">
          {screen === "home" ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">May 2026</h1>
                  <p className="text-slate-500 font-bold text-lg mt-1">Personnel View: Core Sync Partners Only</p>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline"><Filter size={20}/> Class View</Button>
                  <Button variant="gold" onClick={() => { setSelectedDay(15); setShowModal(true); }}>
                    <Plus size={20} /> Schedule Assessment
                  </Button>
                </div>
              </div>

              <Card className="p-1 border-2 border-slate-100 shadow-xl">
                <div className="grid grid-cols-7 border-b-2 border-slate-100 bg-white">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                    <div key={d} className="py-6 text-center text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-slate-100">
                  {daysInMonth.map((day) => {
                    const tests = getTestsOnDay(day);
                    const isToday = day === 15;
                    const hasConflict = tests.length >= 2;

                    return (
                      <div 
                        key={day}
                        onClick={() => { setSelectedDay(day); setShowModal(true); }}
                        className={`min-h-[160px] bg-white p-4 transition-all hover:bg-slate-50 cursor-pointer group relative ${isToday ? 'bg-purple-50/40 shadow-inner' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-lg font-black ${isToday ? 'text-purple-600 bg-purple-100 w-10 h-10 flex items-center justify-center rounded-2xl shadow-sm border border-purple-200' : 'text-slate-300'}`}>
                            {day}
                          </span>
                          {hasConflict && (
                            <div className="bg-rose-500 text-white p-1.5 rounded-xl shadow-lg animate-pulse">
                              <AlertTriangle size={16} />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1.5 overflow-hidden">
                          {tests.map(t => (
                            <div key={t.id} className={`text-[11px] px-2.5 py-1.5 rounded-xl border-2 truncate font-black tracking-tight ${
                              t.teacher === teacherProfile.name ? 'bg-[#6D28D9] text-white border-purple-800' :
                              'bg-slate-50 border-slate-200 text-slate-600'
                            }`}>
                              {t.teacher === teacherProfile.name ? 'MY TEST' : t.teacher.split(' ')[1]}: {t.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          ) : (
            /* AI Advisor Screen */
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setScreen("home")} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-600 border border-slate-100 shadow-sm bg-white">
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">Sync Advisor</h1>
              </div>
              <Card className="h-[650px] flex flex-col bg-slate-50 border-2">
                <div ref={scrollRef} className="flex-1 p-8 space-y-6 overflow-y-auto">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}>
                      {msg.role === "assistant" && (
                        <div className="w-10 h-10 rounded-2xl bg-[#6D28D9] flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-200">
                          <Brain size={20} />
                        </div>
                      )}
                      <div className={`p-5 rounded-3xl border shadow-sm max-w-[70%] ${
                        msg.role === "user" ? "bg-[#6D28D9] text-white rounded-tr-none border-purple-700" : "bg-white text-slate-800 rounded-tl-none border-slate-200"
                      }`}>
                        <p className="text-base leading-relaxed font-medium">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4 animate-pulse">
                      <div className="w-10 h-10 rounded-2xl bg-purple-100" />
                      <div className="bg-white p-5 h-16 w-64 rounded-3xl border border-slate-200 flex items-center gap-2">
                         <Loader2 className="animate-spin text-[#6D28D9]" size={18} />
                         <span className="text-sm font-bold text-slate-400">Analyzing rosters...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 bg-white border-t-2 flex gap-4">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    placeholder="Suggest a gap in the 10th grade calendar..." 
                    className="flex-1 bg-slate-50 rounded-2xl px-6 py-4 text-base font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-[#6D28D9] border-2 border-slate-100 outline-none transition-all" 
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={isTyping} className="w-16 h-16"><Send size={24}/></Button>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* --- RIGHT SIDEBAR: TOP 3 PARTNERS --- */}
        <aside className="flex-1 space-y-10">
          <div className="space-y-5">
            <div className="flex items-center gap-3 px-2">
              <Users2 size={24} className="text-[#6D28D9]" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Primary Coordination</h3>
            </div>
            <p className="text-sm text-slate-400 px-2 font-medium leading-relaxed">
              Mr. Alex, avoiding overlaps with these 3 teachers will resolve 82% of student stress alerts.
            </p>
            <div className="space-y-4">
              {syncPartners.map((partner, idx) => (
                <Card key={idx} className="hover:border-purple-200 transition-all border-l-8 border-l-[#F59E0B] shadow-md group">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl ${partner.color} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                        {partner.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-base font-black text-slate-800">{partner.name}</p>
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase border border-emerald-100">{partner.sharedStudents} Match</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{partner.subject}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
                      <p className="text-[11px] font-black text-slate-400 uppercase">May Schedule: <span className={`${partner.textColor} text-sm ml-1`}>{partner.testsThisMonth} Assessments</span></p>
                      <button className="text-[11px] font-black text-[#6D28D9] hover:underline uppercase tracking-wider">Timeline</button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-[#6D28D9] border-none text-white overflow-visible shadow-2xl">
            <CardContent className="p-8 relative">
              <div className="absolute -top-4 -right-4 bg-[#F59E0B] p-4 rounded-3xl shadow-2xl rotate-12 border-4 border-[#6D28D9]">
                <Trophy size={28} className="text-white" />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <TrendingUp size={28} className="text-purple-200" />
                <h2 className="text-xl font-black tracking-tight uppercase">Roster Harmony</h2>
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                  <span>Prep Buffer</span>
                  <span className="text-amber-400 text-lg">7.2/10</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[72%]" />
                </div>
                <p className="text-[11px] text-purple-100 leading-relaxed italic opacity-90 font-medium">
                  "Only one conflict detected with Dr. Aris this month. You're doing a great job balancing the load!"
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* --- ADD TEST MODAL --- */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-slate-900/75 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          onClick={() => setShowModal(false)}
        >
          <Card 
            className="w-full max-w-xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-2 border-[#6D28D9]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <GraduationCap className="text-[#6D28D9]" size={32} />
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Assessment Plan</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors">
                  <X size={28} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-2.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Assessment Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={testTitle} 
                    onChange={(e) => setTestTitle(e.target.value)} 
                    placeholder="e.g. Differentiation & Integrals" 
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 text-base font-black focus:ring-4 focus:ring-purple-500/10 focus:border-[#6D28D9] outline-none transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Department</label>
                    <div className="p-5 rounded-2xl bg-slate-100 border-2 border-slate-200 text-sm font-black text-slate-500 uppercase tracking-widest shadow-inner">
                      {teacherProfile.department}
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Proposed Day</label>
                    <input 
                      type="number" 
                      min="1" max="31"
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 text-base font-black outline-none focus:border-[#6D28D9]" 
                    />
                  </div>
                </div>

                {/* OVERLAP WARNING PROMPT */}
                {conflictsOnSelected.length > 0 && (
                  <div className="bg-amber-50 border-4 border-[#F59E0B]/30 rounded-3xl p-8 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-4 text-amber-700 mb-3">
                      <ShieldAlert size={28} className="shrink-0" />
                      <p className="text-xl font-black uppercase tracking-tight italic">Workload Collision</p>
                    </div>
                    <div className="text-sm text-amber-800 leading-relaxed font-bold">
                      May {selectedDay} has assessments scheduled by your core coordination partners:
                      <div className="mt-4 p-4 bg-white/70 rounded-2xl border border-amber-200 space-y-2 shadow-sm">
                        {conflictsOnSelected.map(c => (
                          <div key={c.id} className="flex justify-between items-center">
                            <span className="font-black text-purple-700">● {c.title}</span>
                            <span className="text-[11px] uppercase text-slate-400 font-black">{c.teacher}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-5 text-amber-600 font-black italic">
                        {conflictsOnSelected.length >= 2 
                          ? "CRITICAL: Student cognitive load exceeded. Moving your test is strongly advised." 
                          : "Overlap detected. Adding this test will create a double-assessment day for your roster."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-5">
                  <Button className="flex-[2] py-5 text-lg" onClick={handleScheduleTest} variant="primary">Confirm Schedule</Button>
                  <Button className="flex-1 py-5 text-lg" variant="outline" onClick={() => setShowModal(false)}>Discard</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
