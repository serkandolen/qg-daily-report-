import { useState, useEffect, useRef } from "react";

const STORAGE_KEY  = "qg_reports_v8";
const ENG_KEY      = "qg_engineering_v8";
const USERS_KEY    = "qg_users_v8";
const CHAT_KEY     = "qg_chat_v8";
const TARGETS_KEY  = "qg_targets_v8";
const ADMIN_USER  = "Serkan";
const SUPERVISORS = ["Arun", "Asim", "Botan", "Alkan", "Serkan", "Supervisor01", "Supervisor02", "Supervisor03"];
const AREAS       = ["North-A", "North-B", "SLC", "South"];
const DEFAULT_PASSWORDS = { Arun:"arun01", Asim:"asim01", Botan:"botan01", Alkan:"alkan01", Serkan:"643844", Supervisor01:"sup0101", Supervisor02:"sup0201", Supervisor03:"sup0301" };

const GAS_URL  = "https://script.google.com/macros/s/AKfycbwbgUUgOpOSf7cHaiVOjjk5K8O8czC9SjGXT0j0N1ed65xdDAf5LNbalHGt73ZRrQeD/exec";

// Clean short ID: e.g. "R-20260416-A3F2"
function makeId(prefix="R") {
  const d = new Date();
  const date = d.toISOString().slice(0,10).replace(/-/g,"");
  const rand = Math.random().toString(36).slice(2,6).toUpperCase();
  return `${prefix}-${date}-${rand}`;
}

// Format ISO to "16 Apr 2026 14:32"
function fmtDT(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
  } catch { return iso; }
}

// Human-readable for Sheets: "16/04/2026 20:45"
function fmtForSheet() {
  const d = new Date();
  const pad = n => String(n).padStart(2,"0");
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const TAB_MAP = {
  [STORAGE_KEY]: "Reports",
  [ENG_KEY]:     "Engineering",
  [USERS_KEY]:   "Users",
  [CHAT_KEY]:    "Chat",
  [TARGETS_KEY]: "Targets"
};

async function gasCall(params) {
  try {
    const qs = Object.entries(params).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join("&");
    const res = await fetch(`${GAS_URL}?${qs}`);
    return await res.json();
  } catch(e) { console.error("GAS error:", e); return null; }
}

async function sget(key) {
  try {
    const data = await gasCall({ action:"get", tab: TAB_MAP[key] });
    if (key === USERS_KEY) {
      if (!Array.isArray(data) || !data.length) return DEFAULT_PASSWORDS;
      const obj = {};
      data.forEach(r => { if (r.name) obj[r.name] = r.password; });
      return obj;
    }
    return Array.isArray(data) ? data : [];
  } catch { return null; }
}

async function sappend(key, newRows) {
  try {
    const rows = Array.isArray(newRows) ? newRows : [newRows];
    const clean = key === ENG_KEY
      ? rows.map(r => ({ ...r, photos: [] }))
      : rows;
    await gasCall({ action:"append", tab: TAB_MAP[key], data: JSON.stringify(clean) });
  } catch(e) { console.error("append error:", e); }
}

async function sset(key, data) {
  try {
    let rows = data;
    if (key === USERS_KEY) {
      rows = Object.entries(data).map(([name,password]) => ({ name, password }));
    }
    await gasCall({ action:"set", tab: TAB_MAP[key], data: JSON.stringify(rows) });
  } catch(e) { console.error("sset error:", e); }
}

async function supdateStatus(id, status, resolvedAt) {
  try {
    await gasCall({ action:"update_status", tab:"Engineering", id, status, resolvedAt: resolvedAt||"" });
  } catch(e) { console.error("status error:", e); }
}

function compressImage(file) {
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX=600, w0=img.width, h0=img.height;
        const w=w0>MAX?MAX:w0, h=w0>MAX?Math.round(h0*MAX/w0):h0;
        const c=document.createElement("canvas"); c.width=w; c.height=h;
        c.getContext("2d").drawImage(img,0,0,w,h);
        res(c.toDataURL("image/jpeg",0.72));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function exportCSV(rows, isEng=false) {
  const h = isEng ? ["Date","Area","Sub-Area","Status","Description"] : ["Date","Supervisor","Area","Sub-Area","Welder","Pipe Fitter","Total Manpower","Job Description"];
  const lines = [h.join(","), ...rows.map(r => isEng
    ? [r.date,r.area,r.subArea||"",r.status||"open",`"${(r.description||"").replace(/"/g,'""')}"`].join(",")
    : [r.date,r.supervisor,r.area,r.subArea||"",r.welder,r.pipeFitter,r.totalManpower,`"${(r.jobDescription||"").replace(/"/g,'""')}"`].join(",")
  )];
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/csv"}));
  a.download=`Report_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
}

function exportTargetCSV(rows) {
  const h = ["Date","Supervisor","Area","Welding (Dia/In)","Fit-Up (Dia/In)","TP Completion (No.)"];
  const lines = [h.join(","), ...rows.map(r =>
    [r.date,r.supervisor,r.area,r.weldTarget||"-",r.fitUpTarget||"-",r.tpCompletion||"-"].join(",")
  )];
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/csv"}));
  a.download=`Targets_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
}

const C = {
  bg:"#0d1117", surface:"#161b22", border:"#30363d",
  accent:"#f0811a", text:"#e6edf3", muted:"#8b949e",
  success:"#2ea043", successBg:"#0f2d1a",
  danger:"#f85149", dangerBg:"#2d0f0f",
  eng:"#58a6ff", engBg:"#0d1f38",
  resolved:"#3fb950", resolvedBg:"#0f2d1a",
  altRow:"#111820", headBg:"#1c2128",
  chat:"#1c2128"
};

const inp = (x={}) => ({ width:"100%", padding:"10px 14px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Courier New',monospace", ...x });
const LBL = { display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:C.muted, textTransform:"uppercase", marginBottom:6 };
const todayStr = () => new Date().toISOString().split("T")[0];
const emptyForm    = (sup="") => ({ date:todayStr(), supervisor:sup, area:"", subArea:"", welder:"", pipeFitter:"", jobDescription:"" });
const emptyTarget  = (sup="") => ({ date:todayStr(), supervisor:sup, area:"", weldTarget:"", fitUpTarget:"", tpCompletion:"" });
const emptyEng     = () => ({ date:todayStr(), area:"", subArea:"", description:"", photos:[] });

/* Avatar color per user */
const AVATAR_COLORS = { Arun:"#e05c2a", Asim:"#2ea043", Botan:"#a371f7", Alkan:"#e3b341", Serkan:"#f0811a", Supervisor01:"#58a6ff", Supervisor02:"#f778ba", Supervisor03:"#39d353" };
function Avatar({ name, size=32 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:AVATAR_COLORS[name]||C.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.4, fontWeight:700, color:"#fff", flexShrink:0 }}>{name[0]}</div>;
}

function Stat({ label, value, color }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"14px 12px", textAlign:"center" }}>
      <div style={{ fontSize:24, fontWeight:700, color:color||C.accent }}>{value}</div>
      <div style={{ fontSize:10, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:4 }}>{label}</div>
    </div>
  );
}

function EngCard({ issue, onToggle }) {
  const [lb,setLb]=useState(null);
  const isRes=issue.status==="resolved";
  return (
    <div style={{ background:isRes?C.resolvedBg:C.engBg, border:`1px solid ${isRes?C.resolved+"55":C.eng+"44"}`, borderRadius:10, padding:"14px 16px", marginBottom:10, transition:"all 0.2s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:10 }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontSize:11, color:C.accent }}>{issue.date}</span>
          <span style={{ background:C.headBg, border:`1px solid ${C.border}`, borderRadius:4, padding:"1px 8px", fontSize:11 }}>{issue.area}</span>
          {issue.subArea&&issue.subArea!=="-"&&<span style={{ color:C.eng, fontSize:11 }}>↳ {issue.subArea}</span>}
          <span style={{ background:isRes?C.resolvedBg:C.dangerBg, border:`1px solid ${isRes?C.resolved:C.danger}`, color:isRes?C.resolved:C.danger, borderRadius:10, padding:"1px 10px", fontSize:10, fontWeight:700 }}>
            {isRes?"✔ RESOLVED":"⚠ OPEN"}
          </span>
          <span style={{ fontSize:10, color:C.muted }}>#{issue.id}</span>
        </div>
        {onToggle&&<button onClick={()=>onToggle(issue.id)} style={{ padding:"5px 14px", borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"'Courier New',monospace", whiteSpace:"nowrap", background:isRes?C.dangerBg:C.resolvedBg, color:isRes?C.danger:C.resolved, border:`1px solid ${isRes?C.danger:C.resolved}` }}>{isRes?"↩ Reopen":"✔ Resolve"}</button>}
      </div>
      <div style={{ fontSize:13, color:C.text, lineHeight:1.7, whiteSpace:"pre-wrap", marginBottom:isRes||issue.photos?.length?10:0 }}>{issue.description}</div>
      {isRes && issue.resolvedAt && (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(46,160,67,0.08)", border:`1px solid ${C.resolved}44`, borderRadius:6, padding:"7px 12px", marginBottom:issue.photos?.length?10:0 }}>
          <span style={{ color:C.resolved, fontSize:12 }}>✅ Resolved</span>
          <span style={{ color:C.muted, fontSize:11 }}>{fmtDT(issue.resolvedAt)}</span>
        </div>
      )}
      {issue.photos?.length>0&&<div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>{issue.photos.map((ph,i)=><img key={i} src={ph} onClick={()=>setLb(ph)} style={{ width:72, height:72, objectFit:"cover", borderRadius:6, border:`1px solid ${C.border}`, cursor:"zoom-in" }} />)}</div>}
      {lb&&<div onClick={()=>setLb(null)} style={{ position:"fixed", inset:0, background:"#000c", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }}><img src={lb} style={{ maxWidth:"90vw", maxHeight:"90vh", borderRadius:8 }} /><div style={{ position:"absolute", top:20, right:28, color:"#fff", fontSize:28, cursor:"pointer" }}>✕</div></div>}
    </div>
  );
}

/* ══════════════════════════ CHAT ══════════════════════════ */
function ChatPanel({ session }) {
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState("");
  const [loading, setLoading]   = useState(true);
  const bottomRef               = useRef();
  const pollRef                 = useRef();

  const fetchMessages = async () => {
    const data = await sget(CHAT_KEY);
    if (data && Array.isArray(data)) setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000); // poll every 5s
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages]);

  const send = async () => {
    const t = text.trim();
    if (!t) return;
    const msg = { id:makeId("C"), author:session.name, text:t, ts:new Date().toISOString() };
    setMessages(p=>[...p, msg]);
    await sappend(CHAT_KEY, [msg]);
    setText("");
  };

  const formatTime = ts => fmtDT(ts);

  // Group consecutive messages by same author
  const grouped = messages.reduce((acc, msg, i) => {
    const prev = messages[i-1];
    const sameAuthor = prev && prev.author === msg.author && (new Date(msg.ts)-new Date(prev.ts)) < 5*60*1000;
    acc.push({ ...msg, showHeader: !sameAuthor });
    return acc;
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 160px)", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
      {/* Chat header */}
      <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ fontSize:16 }}>💬</div>
        <div>
          <div style={{ fontWeight:700, fontSize:13 }}>Team Chat</div>
          <div style={{ fontSize:10, color:C.muted }}>TR Qatar EPC_04 Piping · {SUPERVISORS.length} members</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          {SUPERVISORS.map(s=><Avatar key={s} name={s} size={24} />)}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 18px" }}>
        {loading && <div style={{ textAlign:"center", color:C.muted, fontSize:13 }}>Loading...</div>}
        {!loading && messages.length===0 && (
          <div style={{ textAlign:"center", color:C.muted, fontSize:13, marginTop:40 }}>
            No messages yet. Say hello! 👋
          </div>
        )}
        {grouped.map((msg) => {
          const isMe = msg.author === session.name;
          return (
            <div key={msg.id} style={{ marginBottom: msg.showHeader ? 16 : 4, display:"flex", flexDirection:"column", alignItems:isMe?"flex-end":"flex-start" }}>
              {msg.showHeader && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexDirection:isMe?"row-reverse":"row" }}>
                  <Avatar name={msg.author} size={28} />
                  <div style={{ display:"flex", alignItems:"baseline", gap:8, flexDirection:isMe?"row-reverse":"row" }}>
                    <span style={{ fontSize:12, fontWeight:700, color:AVATAR_COLORS[msg.author]||C.muted }}>{msg.author}</span>
                    <span style={{ fontSize:10, color:C.muted }}>{formatTime(msg.ts)}</span>
                  </div>
                </div>
              )}
              <div style={{
                maxWidth:"72%", padding:"9px 14px",
                background:isMe?C.accent:C.headBg,
                color:isMe?"#000":C.text,
                borderRadius:isMe?"14px 14px 4px 14px":"14px 14px 14px 4px",
                fontSize:13, lineHeight:1.6,
                marginLeft:isMe?0:36, marginRight:isMe?36:0,
                wordBreak:"break-word"
              }}>{msg.text}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding:"12px 18px", borderTop:`1px solid ${C.border}`, display:"flex", gap:10, alignItems:"flex-end" }}>
        <Avatar name={session.name} size={32} />
        <textarea
          value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); } }}
          rows={1}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          style={{ ...inp({ padding:"10px 14px", resize:"none", flex:1, fontSize:13, lineHeight:1.5 }) }}
        />
        <button onClick={send} disabled={!text.trim()} style={{ padding:"10px 18px", background:text.trim()?C.accent:"#2a2a2a", color:text.trim()?"#000":C.muted, border:"none", borderRadius:8, cursor:text.trim()?"pointer":"default", fontSize:13, fontWeight:700, fontFamily:"'Courier New',monospace", whiteSpace:"nowrap", transition:"all 0.15s" }}>
          Send ↗
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════ MAIN ══════════════════════════ */
export default function App() {
  const [session, setSession] = useState(null);
  const [users, setUsers]     = useState(null);
  const [loginName, setLoginName] = useState("");
  const [loginPw, setLoginPw]     = useState("");
  const [loginErr, setLoginErr]   = useState("");

  const [reports, setReports]       = useState([]);
  const [engIssues, setEngIssues]   = useState([]);
  const [targets, setTargets]       = useState([]);
  const [loading, setLoading]       = useState(true);

  const [tab, setTab]   = useState("report");
  const [flash, setFlash] = useState("");

  const [staged, setStaged] = useState([]);
  const [form, setForm]     = useState(emptyForm());
  const [addErr, setAddErr] = useState("");
  const [supErr, setSupErr] = useState("");

  const [stagedEng, setStagedEng] = useState([]);
  const [engForm, setEngForm]     = useState(emptyEng());
  const [addEngErr, setAddEngErr] = useState("");
  const [engFilter, setEngFilter] = useState("all");
  const photoRef = useRef();

  const [targetForm, setTargetForm]     = useState(emptyTarget());
  const [stagedTargets, setStagedTargets] = useState([]);
  const [targetErr, setTargetErr]       = useState("");

  const [fSup, setFSup]   = useState("All");
  const [fArea, setFArea] = useState("All");
  const [fDate, setFDate] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [sumDate, setSumDate]   = useState(todayStr());
  const [pwEdit, setPwEdit]     = useState({});
  const [pwSaved, setPwSaved]   = useState("");

  useEffect(() => {
    (async () => {
      const [r,e,u,t] = await Promise.all([sget(STORAGE_KEY),sget(ENG_KEY),sget(USERS_KEY),sget(TARGETS_KEY)]);
      setReports(r||[]); setEngIssues(e||[]); setTargets(t||[]);
      if (u) { setUsers(u); } else { await sset(USERS_KEY,DEFAULT_PASSWORDS); setUsers(DEFAULT_PASSWORDS); }
      setLoading(false);
    })();
  }, []);

  const showFlash = msg => { setFlash(msg); setTimeout(()=>setFlash(""),3000); };

  const handleLogin = () => {
    if (!loginName) { setLoginErr("Please select your name."); return; }
    if (!users) { setLoginErr("Loading..."); return; }
    if (users[loginName]===loginPw) {
      const isAdmin = loginName===ADMIN_USER;
      setSession({ name:loginName, isAdmin });
      setLoginErr("");
      setForm(emptyForm(loginName));
      setTargetForm(emptyTarget(loginName));
    } else { setLoginErr("❌ Incorrect password."); setLoginPw(""); }
  };

  const savePasswords = async () => {
    const updated = { ...users };
    Object.entries(pwEdit).forEach(([n,p])=>{ if(p.trim()) updated[n]=p.trim(); });
    await sset(USERS_KEY, updated);
    setUsers(updated); setPwEdit({});
    setPwSaved("✅ Passwords updated."); setTimeout(()=>setPwSaved(""),3000);
  };

  /* Report */
  const sf = (f,v) => {
    // Lock supervisor to own name for non-admin
    if (f==="supervisor" && !session?.isAdmin && v !== session?.name) {
      setSupErr(`You can only submit reports under your own name (${session?.name}).`);
      setTimeout(()=>setSupErr(""),3000);
      return;
    }
    setSupErr("");
    setForm(p=>({...p,[f]:v}));
  };

  const addEntry = () => {
    const { date, supervisor, area, subArea, welder, pipeFitter, jobDescription } = form;
    if (!session?.isAdmin && supervisor !== session?.name) { setAddErr(`You can only submit as ${session?.name}.`); return; }
    if (!date||!supervisor||!area||welder===""||pipeFitter===""||!jobDescription) { setAddErr("Please fill in all required (*) fields."); return; }
    setAddErr("");
    setStaged(p=>[...p,{ id:makeId("R"), date, supervisor, area, subArea:subArea||"-", welder:parseInt(welder)||0, pipeFitter:parseInt(pipeFitter)||0, totalManpower:(parseInt(welder)||0)+(parseInt(pipeFitter)||0), jobDescription }]);
    setForm(p=>({...p, area:"", subArea:"", welder:"", pipeFitter:"", jobDescription:""}));
  };

  const submitAll = async () => {
    if (!staged.length) return;
    const now = fmtForSheet();
    const newEntries = staged.map(e=>({...e, submittedAt:now}));
    await sappend(STORAGE_KEY, newEntries);
    setReports(p=>[...p, ...newEntries]);
    setStaged([]); setForm(emptyForm(session?.name));
    showFlash("✅ All entries submitted!");
  };

  /* Target handlers */
  const st = (f,v) => setTargetForm(p=>({...p,[f]:v}));
  const addTarget = () => {
    const {date,supervisor,area,weldTarget,fitUpTarget,tpCompletion}=targetForm;
    if (!session?.isAdmin && supervisor!==session?.name) { setTargetErr(`You can only submit targets as ${session?.name}.`); return; }
    if (!date||!supervisor||!area) { setTargetErr("Please fill Date, Supervisor and Area."); return; }
    setTargetErr("");
    setStagedTargets(p=>[...p,{id:makeId("T"),date,supervisor,area,weldTarget:weldTarget||"-",fitUpTarget:fitUpTarget||"-",tpCompletion:tpCompletion||"-"}]);
    setTargetForm(p=>({...p,area:"",weldTarget:"",fitUpTarget:"",tpCompletion:""}));
  };
  const submitAllTargets = async () => {
    if (!stagedTargets.length) return;
    const now = fmtForSheet();
    const newEntries = stagedTargets.map(e=>({...e, submittedAt:now}));
    await sappend(TARGETS_KEY, newEntries);
    setTargets(p=>[...p, ...newEntries]);
    setStagedTargets([]); setTargetForm(emptyTarget(session?.name));
    showFlash("✅ Targets submitted!");
  };

  /* Eng */
  const se = (f,v) => setEngForm(p=>({...p,[f]:v}));
  const handlePhotoAdd = async e => {
    const comp=await Promise.all(Array.from(e.target.files).map(compressImage));
    setEngForm(p=>({...p,photos:[...(p.photos||[]),...comp]}));
    e.target.value="";
  };
  const addEng = () => {
    const {date,area,description}=engForm;
    if (!date||!area||!description) { setAddEngErr("Please fill in all required (*) fields."); return; }
    setAddEngErr("");
    setStagedEng(p=>[...p,{id:makeId("E"),date,area,subArea:engForm.subArea||"-",description,photos:engForm.photos||[],status:"open"}]);
    setEngForm(p=>({...p,area:"",subArea:"",description:"",photos:[]}));
  };
  const submitAllEng = async () => {
    if (!stagedEng.length) return;
    const now = fmtForSheet();
    const newEntries = stagedEng.map(e=>({...e, submittedAt:now}));
    await sappend(ENG_KEY, newEntries);
    setEngIssues(p=>[...p, ...newEntries]);
    setStagedEng([]); setEngForm(emptyEng());
    showFlash("✅ Engineering issues submitted!");
  };
  const toggleResolve = async id => {
    const issue = engIssues.find(e=>e.id===id);
    if (!issue) return;
    const newStatus = issue.status==="resolved" ? "open" : "resolved";
    const resolvedAt = newStatus==="resolved" ? fmtForSheet() : "";
    const updated = engIssues.map(e => e.id===id ? {...e, status:newStatus, resolvedAt} : e);
    setEngIssues(updated);
    await supdateStatus(id, newStatus, resolvedAt);
  };

  const fReports = reports.filter(r=>(fSup==="All"||r.supervisor===fSup)&&(fArea==="All"||r.area===fArea)&&(!fDate||r.date===fDate)).sort((a,b)=>b.date.localeCompare(a.date));
  const fEng = engIssues.filter(r=>(fArea==="All"||r.area===fArea)&&(!fDate||r.date===fDate)&&(engFilter==="all"||(r.status||"open")===engFilter)).sort((a,b)=>b.date.localeCompare(a.date));
  const openCount = engIssues.filter(e=>(e.status||"open")==="open").length;

  const sumReports = reports.filter(r=>r.date===sumDate);
  const sumEng = engIssues.filter(r=>r.date===sumDate);
  const areaMap = {};
  sumReports.forEach(r=>{
    if (!areaMap[r.area]) areaMap[r.area]={welder:0,pipeFitter:0,total:0,entries:[]};
    areaMap[r.area].welder+=r.welder; areaMap[r.area].pipeFitter+=r.pipeFitter; areaMap[r.area].total+=r.totalManpower; areaMap[r.area].entries.push(r);
  });
  const openOnDate = engIssues.filter(e=>{
    const sub=(e.submittedAt||e.date).slice(0,10);
    if (sub>sumDate) return false;
    if ((e.status||"open")==="open") return true;
    return e.resolvedAt && e.resolvedAt.slice(0,10)>sumDate;
  });

  const Tab = ({id,label,color,badge}) => (
    <button onClick={()=>setTab(id)} style={{ padding:"8px 16px", background:tab===id?(color||C.accent):"transparent", color:tab===id?(color?C.text:"#000"):C.muted, border:`1px solid ${tab===id?(color||C.accent):C.border}`, borderRadius:4, cursor:"pointer", fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"'Courier New',monospace", transition:"all 0.15s" }}>
      {label}{badge>0&&<span style={{ marginLeft:6,background:C.danger,color:"#fff",borderRadius:10,padding:"0 6px",fontSize:10 }}>{badge}</span>}
    </button>
  );

  /* ── LOGIN ── */
  if (!session) return (
    <div style={{ minHeight:"100vh", background:"#0e0a06", color:C.text, fontFamily:"'Courier New',monospace", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" }}>

      {/* Evening sky - warm amber horizon */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, #08090f 0%, #160e06 42%, #2e1b07 58%, #3a2008 68%, #1e1006 80%, #0e0a06 100%)", zIndex:0 }} />

      {/* Setting sun glow behind towers */}
      <div style={{ position:"absolute", bottom:"36%", left:"52%", width:110, height:110, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,190,70,0.5) 0%, rgba(255,120,20,0.25) 45%, transparent 70%)", zIndex:1 }} />

      {/* Horizon warmth band */}
      <div style={{ position:"absolute", bottom:"32%", left:0, right:0, height:70, background:"linear-gradient(180deg, transparent 0%, rgba(160,70,10,0.2) 50%, rgba(200,100,20,0.3) 80%, transparent 100%)", zIndex:1 }} />

      {/* A few stars - early evening */}
      {[[8,10],[18,5],[72,8],[88,4],[94,13],[47,3],[62,6],[30,8]].map(([l,t],i)=>(
        <div key={i} style={{ position:"absolute", width:1.5, height:1.5, borderRadius:"50%", background:"#fff", opacity:0.4, top:`${t}%`, left:`${l}%`, zIndex:1 }} />
      ))}

      {/* ── REFINERY SCENE ── */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:340, zIndex:2 }}>

        {/* Ground */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:30, background:"linear-gradient(180deg,#1c1106,#110b04)", borderTop:"1px solid #3a2208" }} />
        {/* Ground amber reflections */}
        <div style={{ position:"absolute", bottom:2, left:"3%", width:110, height:10, background:"radial-gradient(ellipse, rgba(220,120,20,0.3) 0%, transparent 70%)", borderRadius:"50%" }} />
        <div style={{ position:"absolute", bottom:2, left:"56%", width:80, height:8, background:"radial-gradient(ellipse, rgba(200,100,15,0.22) 0%, transparent 70%)", borderRadius:"50%" }} />

        {/* Tower 1 - main tall distillation */}
        <div style={{ position:"absolute", bottom:30, left:"12%", width:36, height:235, background:"linear-gradient(90deg,#1e1208,#2c1e0c,#1e1208)", border:"1px solid #4a2e10", borderRadius:"3px 3px 0 0", boxShadow:"4px 0 24px rgba(200,100,15,0.1)" }}>
          {[40,85,130,175,210].map(t=><div key={t} style={{ position:"absolute", top:t, left:-10, right:-10, height:7, background:"#130c04", border:"1px solid #3a2208", borderRadius:2 }} />)}
          {[58,103,148].map(t=><div key={t} style={{ position:"absolute", top:t, left:7, width:6, height:4, background:"rgba(255,170,50,0.65)", borderRadius:1, boxShadow:"0 0 7px rgba(255,150,30,0.9)" }} />)}
          <div style={{ position:"absolute", top:-24, left:9, width:18, height:24, background:"#1e1208", borderRadius:"50% 50% 0 0", border:"1px solid #4a2e10" }} />
          <div style={{ position:"absolute", top:-40, left:2, width:32, height:20, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(255,160,40,0.7) 0%, rgba(255,80,10,0.35) 55%, transparent 75%)" }} />
        </div>

        {/* Flare stack left - big warm flame */}
        <div style={{ position:"absolute", bottom:30, left:"5%", width:8, height:190, background:"linear-gradient(90deg,#1a1008,#241808)", borderRadius:"4px 4px 0 0" }}>
          <div style={{ position:"absolute", top:-38, left:-14, width:36, height:40, borderRadius:"50%", background:"radial-gradient(circle, #ffe066 0%, #ffaa00 30%, #ff6600 55%, transparent 78%)", opacity:0.95 }} />
          <div style={{ position:"absolute", top:-56, left:-7, width:22, height:26, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,220,100,0.75) 0%, rgba(255,130,30,0.35) 55%, transparent 75%)" }} />
          <div style={{ position:"absolute", top:-68, left:-2, width:13, height:18, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,240,160,0.45) 0%, transparent 70%)" }} />
          <div style={{ position:"absolute", top:0, left:-6, right:-6, height:70, background:"linear-gradient(180deg, rgba(255,140,20,0.12) 0%, transparent 100%)" }} />
        </div>

        {/* Flare stack right */}
        <div style={{ position:"absolute", bottom:30, right:"8%", width:6, height:215, background:"linear-gradient(90deg,#1a1008,#241808)", borderRadius:"4px 4px 0 0" }}>
          <div style={{ position:"absolute", top:-28, left:-10, width:26, height:28, borderRadius:"50%", background:"radial-gradient(circle, #ffd044 0%, #ff9900 35%, #ff5500 60%, transparent 80%)", opacity:0.9 }} />
          <div style={{ position:"absolute", top:-42, left:-4, width:15, height:20, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,200,80,0.6) 0%, transparent 70%)" }} />
        </div>

        {/* Storage tanks */}
        <div style={{ position:"absolute", bottom:30, right:"15%" }}>
          <div style={{ width:74, height:60, background:"linear-gradient(135deg,#2c1c0a,#1e1208,#2c1c0a)", border:"1px solid #4e3012", borderRadius:"3px 3px 0 0" }}>
            <div style={{ height:10, background:"linear-gradient(90deg,#3e2610,#4e3415,#3e2610)", borderRadius:"3px 3px 0 0", borderBottom:"1px solid #4e3012" }} />
            <div style={{ position:"absolute", top:0, right:0, width:22, height:"100%", background:"linear-gradient(90deg,transparent,rgba(240,130,30,0.1))", borderRadius:"0 3px 0 0" }} />
          </div>
          <div style={{ position:"absolute", top:-10, right:-46, width:60, height:48, background:"linear-gradient(135deg,#2c1c0a,#1e1208)", border:"1px solid #4e3012", borderRadius:"3px 3px 0 0" }}>
            <div style={{ height:8, background:"linear-gradient(90deg,#3e2610,#4e3415,#3e2610)", borderRadius:"3px 3px 0 0", borderBottom:"1px solid #4e3012" }} />
          </div>
          <div style={{ position:"absolute", top:16, left:7, width:5, height:5, borderRadius:"50%", background:"#ff4400", boxShadow:"0 0 9px rgba(255,80,0,1)" }} />
        </div>

        {/* Tower 2 */}
        <div style={{ position:"absolute", bottom:30, right:"28%", width:28, height:178, background:"linear-gradient(90deg,#1e1208,#2c1e0c,#1e1208)", border:"1px solid #4a2e10", borderRadius:"3px 3px 0 0" }}>
          {[35,78,122].map(t=><div key={t} style={{ position:"absolute", top:t, left:-7, right:-7, height:6, background:"#130c04", border:"1px solid #3a2208", borderRadius:2 }} />)}
          {[52,97].map(t=><div key={t} style={{ position:"absolute", top:t, right:5, width:5, height:3, background:"rgba(255,160,40,0.6)", borderRadius:1, boxShadow:"0 0 6px rgba(255,140,20,0.8)" }} />)}
          <div style={{ position:"absolute", top:-18, left:7, width:14, height:18, background:"#1e1208", borderRadius:"50% 50% 0 0", border:"1px solid #4a2e10" }} />
        </div>

        {/* Foreground pipe rack */}
        <div style={{ position:"absolute", bottom:63, left:0, right:0, height:11, background:"linear-gradient(180deg,#5a3818,#3a2210,#1e1208)", borderTop:"1px solid #7a5228", borderBottom:"1px solid #0e0804" }} />
        <div style={{ position:"absolute", bottom:58, left:0, right:0, height:6, background:"linear-gradient(180deg,#2e1c0a,#1a1006)", borderTop:"1px solid #4a2e10" }} />
        {[8,18,30,42,55,67,80,92].map((pct,i)=>(
          <div key={i} style={{ position:"absolute", bottom:30, left:`${pct}%`, width:6, height:34, background:"#130c04", border:"1px solid #2a1808" }}>
            <div style={{ position:"absolute", bottom:0, left:-4, width:14, height:5, background:"#130c04", border:"1px solid #2a1808" }} />
          </div>
        ))}
        {[15,25,35,50,62,74,86].map((pct,i)=>(
          <div key={i} style={{ position:"absolute", bottom:57, left:`${pct}%`, width:5, height:18, background:"#7a4820", borderRadius:1 }} />
        ))}

        {/* Upper pipe */}
        <div style={{ position:"absolute", bottom:95, left:"10%", right:"20%", height:8, background:"linear-gradient(180deg,#4a2e12,#281808)", borderTop:"1px solid #6a4018", borderBottom:"1px solid #0e0804" }} />
        {[15,28,42,56,70,84].map((pct,i)=>(
          <div key={i} style={{ position:"absolute", bottom:93, left:`${pct}%`, width:4, height:30, background:"#130c04", border:"1px solid #1e1208" }} />
        ))}

        {/* Welding arc - bright, warm */}
        <div style={{ position:"absolute", bottom:69, left:"38%" }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:"#fffff0", boxShadow:"0 0 8px 5px rgba(255,250,200,0.95), 0 0 18px 10px rgba(255,200,80,0.65), 0 0 38px 16px rgba(255,120,20,0.35)" }} />
          {[[9,-7],[13,2],[7,11],[-5,11],[-11,2],[-9,-8],[3,-13],[15,-5]].map(([dx,dy],i)=>(
            <div key={i} style={{ position:"absolute", top:5+dy*0.6, left:5+dx*0.6, width:i%3===0?3:2, height:i%3===0?3:2, borderRadius:"50%", background:i%2===0?"#ffff99":"#ffbb00", opacity:0.92 }} />
          ))}
          <div style={{ position:"absolute", top:-22, left:-32, width:74, height:22, background:"radial-gradient(ellipse, rgba(255,210,90,0.18) 0%, transparent 70%)" }} />
        </div>

        {/* Worker silhouettes */}
        <div style={{ position:"absolute", bottom:63, left:"34.5%" }}>
          <div style={{ width:10, height:13, background:"#0a0704", borderRadius:"50% 50% 0 0", marginLeft:2 }} />
          <div style={{ width:14, height:19, background:"#0a0704", borderRadius:2 }} />
        </div>
        <div style={{ position:"absolute", bottom:63, left:"46%" }}>
          <div style={{ width:9, height:11, background:"#0a0704", borderRadius:"50% 50% 0 0", marginLeft:1 }} />
          <div style={{ width:12, height:17, background:"#0a0704", borderRadius:2 }} />
        </div>

        {/* Crane silhouette */}
        <div style={{ position:"absolute", bottom:30, left:"58%", width:10, height:255, background:"linear-gradient(90deg,#150f06,#201608,#150f06)", borderRadius:"2px 2px 0 0" }}>
          {[212,168,126,84,42].map(t=>(
            <div key={t} style={{ position:"absolute", top:t, left:0, right:0, borderTop:"1px solid #3a2808", opacity:0.7 }}>
              <div style={{ position:"absolute", top:0, left:0, width:"100%", height:42, borderLeft:"1px solid #3a2808", opacity:0.5, transform:"skewX(45deg)", transformOrigin:"bottom left" }} />
            </div>
          ))}
        </div>
        <div style={{ position:"absolute", bottom:273, left:"30%", width:"30%", height:6, background:"linear-gradient(180deg,#3a2510,#201408)", transform:"rotate(-4deg)", transformOrigin:"right center", borderRadius:3 }} />
        <div style={{ position:"absolute", bottom:210, left:"40%", width:2, height:65, background:"#2a1808" }} />
        <div style={{ position:"absolute", bottom:184, left:"38%", width:8, height:10, border:"2px solid #4a2e12", borderRadius:"0 0 50% 50%", borderTop:"none" }} />

        {/* Warm scene tint */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(0deg, rgba(90,42,8,0.25) 0%, rgba(70,30,5,0.12) 50%, transparent 100%)", pointerEvents:"none" }} />
      </div>

      {/* Soft bottom fade */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:110, background:"linear-gradient(0deg, rgba(14,10,6,0.65) 0%, transparent 100%)", zIndex:3 }} />

      {/* Content */}
      <div style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:10, letterSpacing:"0.28em", color:C.accent, textTransform:"uppercase", marginBottom:8, opacity:0.9 }}>TR Qatar EPC_04 Piping</div>
          <div style={{ fontSize:30, fontWeight:700, letterSpacing:"0.08em", textShadow:"0 0 30px rgba(240,129,26,0.4)" }}>DAILY REPORT</div>
          <div style={{ width:60, height:2, background:`linear-gradient(90deg, transparent, ${C.accent}, transparent)`, margin:"12px auto" }} />
          <div style={{ fontSize:10, color:"rgba(230,237,243,0.28)", letterSpacing:"0.14em", fontStyle:"italic" }}>created by Serkan</div>
        </div>
        <div style={{ width:"100%", background:"rgba(18,12,6,0.9)", border:`1px solid rgba(180,90,20,0.3)`, borderRadius:12, padding:32, backdropFilter:"blur(8px)", boxShadow:"0 0 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,160,60,0.07)" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", color:C.muted, textTransform:"uppercase", marginBottom:22, textAlign:"center" }}>— Sign In —</div>
          {loginErr&&<div style={{ background:C.dangerBg,border:`1px solid ${C.danger}`,borderRadius:6,padding:"9px 14px",marginBottom:14,color:C.danger,fontSize:13 }}>{loginErr}</div>}
          <div style={{ marginBottom:16 }}>
            <label style={LBL}>Name</label>
            <select value={loginName} onChange={e=>{setLoginName(e.target.value);setLoginErr("");}} style={{ ...inp(),cursor:"pointer" }}>
              <option value="">— Select —</option>
              {SUPERVISORS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={LBL}>Password</label>
            <input type="password" value={loginPw} onChange={e=>{setLoginPw(e.target.value);setLoginErr("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="Enter your password" style={inp()} />
          </div>
          <button onClick={handleLogin} style={{ width:"100%", padding:13, background:`linear-gradient(135deg, ${C.accent}, #c16714)`, color:"#000", border:"none", borderRadius:6, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Courier New',monospace", letterSpacing:"0.12em", textTransform:"uppercase", boxShadow:`0 0 20px rgba(240,129,26,0.35)` }}>Sign In →</button>
          {loading&&<div style={{ textAlign:"center",marginTop:12,color:C.muted,fontSize:12 }}>Loading...</div>}
        </div>
      </div>
    </div>
  );

  /* ── MAIN ── */
  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'Courier New',monospace" }}>
      <div style={{ background:C.surface, borderBottom:`2px solid ${C.accent}`, padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:"0.22em", color:C.accent, textTransform:"uppercase", marginBottom:2 }}>TR Qatar EPC_04 Piping</div>
          <div style={{ fontSize:20, fontWeight:700, letterSpacing:"0.04em" }}>DAILY REPORT</div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          <Tab id="report" label="📝 Report" />
          <Tab id="target" label="🎯 Target" color="#58a6ff" />
          <Tab id="engineering" label="⚠️ Engineering" color={C.eng} badge={openCount} />
          <Tab id="summary" label="📊 Summary" />
          <Tab id="chat" label="💬 Chat" color="#6e40c9" />
          {session.isAdmin && <Tab id="records" label="🔒 Records" />}
          <div style={{ marginLeft:8, display:"flex", alignItems:"center", gap:8 }}>
            <Avatar name={session.name} size={28} />
            <span style={{ fontSize:11, color:C.muted }}>{session.name}</span>
            <button onClick={()=>{setSession(null);setLoginPw("");setTab("report");}} style={{ padding:"4px 10px", background:"transparent", border:`1px solid ${C.border}`, color:C.muted, borderRadius:4, cursor:"pointer", fontSize:10, fontFamily:"'Courier New',monospace" }}>Sign out</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:880, margin:"0 auto", padding:"24px 20px" }}>
        {flash&&<div style={{ background:C.successBg,border:`1px solid ${C.success}`,borderRadius:8,padding:"11px 16px",marginBottom:18,color:"#3fb950",fontSize:14 }}>{flash}</div>}

        {/* ══ REPORT ══ */}
        {tab==="report"&&(
          <div>
            {staged.length>0&&(
              <div style={{ background:C.surface,border:`1px solid ${C.accent}55`,borderRadius:10,padding:18,marginBottom:22 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                  <span style={{ fontSize:11,fontWeight:700,color:C.accent,textTransform:"uppercase",letterSpacing:"0.1em" }}>⏳ Pending <span style={{ background:C.accent,color:"#000",borderRadius:10,padding:"1px 8px",marginLeft:6 }}>{staged.length}</span></span>
                  <button onClick={submitAll} style={{ padding:"8px 18px",background:C.success,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Courier New',monospace" }}>✔ Submit All to Records</button>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
                    <thead><tr style={{ borderBottom:`1px solid ${C.border}` }}>{["Date","Supervisor","Area","Sub-Area","W","PF","Total","Job Desc",""].map(h=><th key={h} style={{ padding:"6px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
                    <tbody>{staged.map((e,i)=>(
                      <tr key={e.id} style={{ borderBottom:`1px solid ${C.border}33`,background:i%2?C.altRow:"transparent" }}>
                        <td style={{ padding:"7px 10px",color:C.accent }}>{e.date}</td>
                        <td style={{ padding:"7px 10px",fontWeight:700 }}>{e.supervisor}</td>
                        <td style={{ padding:"7px 10px" }}><span style={{ background:C.headBg,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 6px",fontSize:11 }}>{e.area}</span></td>
                        <td style={{ padding:"7px 10px",color:C.muted }}>{e.subArea}</td>
                        <td style={{ padding:"7px 10px",textAlign:"center" }}>{e.welder}</td>
                        <td style={{ padding:"7px 10px",textAlign:"center" }}>{e.pipeFitter}</td>
                        <td style={{ padding:"7px 10px",textAlign:"center",fontWeight:700,color:C.accent }}>{e.totalManpower}</td>
                        <td style={{ padding:"7px 10px",textAlign:"center",color:"#58a6ff" }}>{e.weldTarget}</td>
                        <td style={{ padding:"7px 10px",textAlign:"center",color:"#58a6ff" }}>{e.fitUpTarget}</td>
                        <td style={{ padding:"7px 10px",textAlign:"center",color:"#58a6ff" }}>{e.tpCompletion}</td>
                        <td style={{ padding:"7px 10px",color:C.muted,maxWidth:130 }}><div style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{e.jobDescription}</div></td>
                        <td style={{ padding:"7px 10px" }}><button onClick={()=>setStaged(p=>p.filter(x=>x.id!==e.id))} style={{ background:C.dangerBg,border:`1px solid ${C.danger}`,color:C.danger,borderRadius:4,padding:"2px 8px",cursor:"pointer",fontSize:11,fontFamily:"'Courier New',monospace" }}>✕</button></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <div style={{ marginTop:10,display:"flex",gap:20,padding:"8px 10px",background:"#0a0e13",borderRadius:6 }}>
                  <span style={{ fontSize:12,color:C.muted }}>Welder: <strong style={{ color:C.text }}>{staged.reduce((s,e)=>s+e.welder,0)}</strong></span>
                  <span style={{ fontSize:12,color:C.muted }}>Pipe Fitter: <strong style={{ color:C.text }}>{staged.reduce((s,e)=>s+e.pipeFitter,0)}</strong></span>
                  <span style={{ fontSize:12,color:C.muted }}>Total MP: <strong style={{ color:C.accent }}>{staged.reduce((s,e)=>s+e.totalManpower,0)}</strong></span>
                </div>
              </div>
            )}

            <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:26 }}>
              <div style={{ fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:C.muted,textTransform:"uppercase",marginBottom:18 }}>+ Add Area Entry</div>
              {addErr&&<div style={{ background:C.dangerBg,border:`1px solid ${C.danger}`,borderRadius:6,padding:"9px 14px",marginBottom:14,color:C.danger,fontSize:13 }}>{addErr}</div>}
              {supErr&&<div style={{ background:C.dangerBg,border:`1px solid ${C.danger}`,borderRadius:6,padding:"9px 14px",marginBottom:14,color:C.danger,fontSize:13 }}>🔒 {supErr}</div>}

              <div style={{ marginBottom:16 }}><label style={LBL}>Date <span style={{ color:C.accent }}>*</span></label><input type="date" value={form.date} onChange={e=>sf("date",e.target.value)} style={inp()} /></div>

              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16 }}>
                <div>
                  <label style={LBL}>Supervisor <span style={{ color:C.accent }}>*</span></label>
                  {session.isAdmin
                    ? <select value={form.supervisor} onChange={e=>sf("supervisor",e.target.value)} style={{ ...inp(),cursor:"pointer" }}><option value="">— Select —</option>{SUPERVISORS.map(s=><option key={s}>{s}</option>)}</select>
                    : <div style={{ ...inp(),display:"flex",alignItems:"center",gap:10,borderColor:C.accent+"55" }}>
                        <Avatar name={session.name} size={22} />
                        <span style={{ fontWeight:700 }}>{session.name}</span>
                        <span style={{ marginLeft:"auto",fontSize:10,color:C.muted }}>🔒 locked</span>
                      </div>
                  }
                </div>
                <div><label style={LBL}>Area <span style={{ color:C.accent }}>*</span></label><select value={form.area} onChange={e=>sf("area",e.target.value)} style={{ ...inp(),cursor:"pointer" }}><option value="">— Select —</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select></div>
              </div>

              <div style={{ marginBottom:16 }}><label style={LBL}>Sub-Area</label><input type="text" value={form.subArea} onChange={e=>sf("subArea",e.target.value)} placeholder="e.g. PR-01, PR-02, Deluge-01" style={inp()} /></div>

              <div style={{ background:"#0a0e13",border:`1px solid ${C.border}`,borderRadius:8,padding:16,marginBottom:16 }}>
                <div style={{ fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:C.accent,textTransform:"uppercase",marginBottom:14 }}>⚙ Manpower</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14 }}>
                  <div><label style={LBL}>Welder <span style={{ color:C.accent }}>*</span></label><input type="number" min="0" value={form.welder} onChange={e=>sf("welder",e.target.value)} placeholder="0" style={inp()} /></div>
                  <div><label style={LBL}>Pipe Fitter <span style={{ color:C.accent }}>*</span></label><input type="number" min="0" value={form.pipeFitter} onChange={e=>sf("pipeFitter",e.target.value)} placeholder="0" style={inp()} /></div>
                  <div><label style={LBL}>Total</label><div style={{ ...inp(),display:"flex",alignItems:"center",color:C.accent,fontWeight:700,fontSize:24,borderColor:C.accent+"55" }}>{(parseInt(form.welder)||0)+(parseInt(form.pipeFitter)||0)}</div></div>
                </div>
              </div>

              <div style={{ marginBottom:20 }}><label style={LBL}>Job Description <span style={{ color:C.accent }}>*</span></label><textarea value={form.jobDescription} onChange={e=>sf("jobDescription",e.target.value)} rows={5} placeholder="Describe work performed in this area / sub-area..." style={{ ...inp(),resize:"vertical" }} /></div>

              <button onClick={addEntry} style={{ width:"100%",padding:13,background:"transparent",color:C.accent,border:`2px solid ${C.accent}`,borderRadius:6,fontSize:13,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Courier New',monospace",marginBottom:staged.length?10:0 }}>+ Add This Area Entry</button>
              {staged.length>0&&<button onClick={submitAll} style={{ width:"100%",padding:13,background:C.success,color:"#fff",border:"none",borderRadius:6,fontSize:13,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Courier New',monospace" }}>✔ Submit All {staged.length} {staged.length===1?"Entry":"Entries"} to Records</button>}
            </div>
          </div>
        )}

        {/* ══ TARGET ══ */}
        {tab==="target"&&(
          <div>
            {stagedTargets.length>0&&(
              <div style={{ background:C.surface,border:`1px solid #58a6ff55`,borderRadius:10,padding:18,marginBottom:22 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                  <span style={{ fontSize:11,fontWeight:700,color:"#58a6ff",textTransform:"uppercase",letterSpacing:"0.1em" }}>⏳ Pending Targets <span style={{ background:"#58a6ff",color:"#000",borderRadius:10,padding:"1px 8px",marginLeft:6 }}>{stagedTargets.length}</span></span>
                  <button onClick={submitAllTargets} style={{ padding:"8px 18px",background:C.success,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Courier New',monospace" }}>✔ Submit All Targets</button>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
                    <thead><tr style={{ borderBottom:`1px solid ${C.border}` }}>{["Date","Supervisor","Area","Weld (Dia/In)","Fit-Up (Dia/In)","TP No.",""].map(h=><th key={h} style={{ padding:"6px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
                    <tbody>{stagedTargets.map((e,i)=>(
                      <tr key={e.id} style={{ borderBottom:`1px solid ${C.border}33`,background:i%2?C.altRow:"transparent" }}>
                        <td style={{ padding:"7px 10px",color:C.accent }}>{e.date}</td>
                        <td style={{ padding:"7px 10px",fontWeight:700 }}>{e.supervisor}</td>
                        <td style={{ padding:"7px 10px" }}><span style={{ background:C.headBg,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 6px",fontSize:11 }}>{e.area}</span></td>
                        <td style={{ padding:"7px 10px",textAlign:"center",color:"#58a6ff" }}>{e.weldTarget}"</td>
                        <td style={{ padding:"7px 10px",textAlign:"center",color:"#58a6ff" }}>{e.fitUpTarget}"</td>
                        <td style={{ padding:"7px 10px",textAlign:"center",color:"#58a6ff" }}>{e.tpCompletion}</td>
                        <td style={{ padding:"7px 10px" }}><button onClick={()=>setStagedTargets(p=>p.filter(x=>x.id!==e.id))} style={{ background:C.dangerBg,border:`1px solid ${C.danger}`,color:C.danger,borderRadius:4,padding:"2px 8px",cursor:"pointer",fontSize:11,fontFamily:"'Courier New',monospace" }}>✕</button></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            <div style={{ background:C.surface,border:`1px solid #58a6ff44`,borderRadius:10,padding:26 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
                <div style={{ width:3,height:22,background:"#58a6ff",borderRadius:2 }} />
                <span style={{ fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:"#58a6ff",textTransform:"uppercase" }}>Set Area Target</span>
              </div>
              {targetErr&&<div style={{ background:C.dangerBg,border:`1px solid ${C.danger}`,borderRadius:6,padding:"9px 14px",marginBottom:14,color:C.danger,fontSize:13 }}>{targetErr}</div>}

              <div style={{ marginBottom:16 }}><label style={LBL}>Date <span style={{ color:"#58a6ff" }}>*</span></label><input type="date" value={targetForm.date} onChange={e=>st("date",e.target.value)} style={inp()} /></div>

              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16 }}>
                <div>
                  <label style={LBL}>Supervisor <span style={{ color:"#58a6ff" }}>*</span></label>
                  {session.isAdmin
                    ? <select value={targetForm.supervisor} onChange={e=>st("supervisor",e.target.value)} style={{ ...inp(),cursor:"pointer" }}><option value="">— Select —</option>{SUPERVISORS.map(s=><option key={s}>{s}</option>)}</select>
                    : <div style={{ ...inp(),display:"flex",alignItems:"center",gap:10,borderColor:"#58a6ff55" }}><Avatar name={session.name} size={22} /><span style={{ fontWeight:700 }}>{session.name}</span><span style={{ marginLeft:"auto",fontSize:10,color:C.muted }}>🔒 locked</span></div>
                  }
                </div>
                <div>
                  <label style={LBL}>Area <span style={{ color:"#58a6ff" }}>*</span></label>
                  <select value={targetForm.area} onChange={e=>st("area",e.target.value)} style={{ ...inp(),cursor:"pointer" }}>
                    <option value="">— Select —</option>
                    {AREAS.map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              {/* Auto-show manpower already assigned to this area today */}
              {targetForm.area && (()=>{
                const areaReports = reports.filter(r=>r.date===targetForm.date&&r.area===targetForm.area);
                const totalW = areaReports.reduce((s,r)=>s+r.welder,0);
                const totalPF = areaReports.reduce((s,r)=>s+r.pipeFitter,0);
                const sups = [...new Set(areaReports.map(r=>r.supervisor))].join(", ")||"—";
                return (
                  <div style={{ background:"#0a1628",border:`1px solid #2a3d52`,borderRadius:8,padding:14,marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4 }}>Welder Assigned</div>
                      <div style={{ fontSize:22,fontWeight:700,color:C.accent }}>{totalW||"—"}</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4 }}>Pipe Fitter Assigned</div>
                      <div style={{ fontSize:22,fontWeight:700,color:C.accent }}>{totalPF||"—"}</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4 }}>Supervisor(s)</div>
                      <div style={{ fontSize:13,fontWeight:700,color:C.text }}>{sups}</div>
                    </div>
                    {areaReports.length===0&&<div style={{ gridColumn:"1/-1",textAlign:"center",color:C.muted,fontSize:12 }}>No manpower submitted for {targetForm.area} on {targetForm.date} yet.</div>}
                  </div>
                );
              })()}

              <div style={{ background:"#0a0e13",border:`1px solid #2a3d52`,borderRadius:8,padding:16,marginBottom:20 }}>
                <div style={{ fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:"#58a6ff",textTransform:"uppercase",marginBottom:14 }}>🎯 Targets for this Area</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14 }}>
                  <div>
                    <label style={{ ...LBL,color:"#58a6ff" }}>Welding (Dia/Inch)</label>
                    <input type="number" min="0" step="0.1" value={targetForm.weldTarget} onChange={e=>st("weldTarget",e.target.value)} placeholder='e.g. 24' style={inp()} />
                  </div>
                  <div>
                    <label style={{ ...LBL,color:"#58a6ff" }}>Fit-Up (Dia/Inch)</label>
                    <input type="number" min="0" step="0.1" value={targetForm.fitUpTarget} onChange={e=>st("fitUpTarget",e.target.value)} placeholder='e.g. 36' style={inp()} />
                  </div>
                  <div>
                    <label style={{ ...LBL,color:"#58a6ff" }}>Cons. TP Completion (No.)</label>
                    <input type="number" min="0" step="1" value={targetForm.tpCompletion} onChange={e=>st("tpCompletion",e.target.value)} placeholder="e.g. 5" style={inp()} />
                  </div>
                </div>
              </div>

              <button onClick={addTarget} style={{ width:"100%",padding:13,background:"transparent",color:"#58a6ff",border:`2px solid #58a6ff`,borderRadius:6,fontSize:13,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Courier New',monospace",marginBottom:stagedTargets.length?10:0 }}>+ Add Area Target</button>
              {stagedTargets.length>0&&<button onClick={submitAllTargets} style={{ width:"100%",padding:13,background:C.success,color:"#fff",border:"none",borderRadius:6,fontSize:13,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Courier New',monospace" }}>✔ Submit All {stagedTargets.length} {stagedTargets.length===1?"Target":"Targets"}</button>}
            </div>
          </div>
        )}

        {/* ══ ENGINEERING ══ */}
        {tab==="engineering"&&(
          <div>
            {openCount>0&&<div style={{ background:C.dangerBg,border:`1px solid ${C.danger}55`,borderRadius:8,padding:"10px 16px",marginBottom:18,display:"flex",gap:12,alignItems:"center" }}><span style={{ color:C.danger,fontWeight:700 }}>⚠</span><span style={{ fontSize:13 }}>{openCount} open engineering {openCount===1?"issue":"issues"} pending resolution</span></div>}
            {stagedEng.length>0&&(
              <div style={{ background:C.surface,border:`1px solid ${C.eng}55`,borderRadius:10,padding:18,marginBottom:22 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                  <span style={{ fontSize:11,fontWeight:700,color:C.eng,textTransform:"uppercase",letterSpacing:"0.1em" }}>⏳ Pending <span style={{ background:C.eng,color:"#000",borderRadius:10,padding:"1px 8px",marginLeft:6 }}>{stagedEng.length}</span></span>
                  <button onClick={submitAllEng} style={{ padding:"8px 18px",background:C.eng,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Courier New',monospace" }}>✔ Submit All</button>
                </div>
                {stagedEng.map(e=><EngCard key={e.id} issue={e} />)}
              </div>
            )}
            <div style={{ background:C.surface,border:`1px solid ${C.eng}55`,borderRadius:10,padding:26 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}><div style={{ width:3,height:22,background:C.eng,borderRadius:2 }} /><span style={{ fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:C.eng,textTransform:"uppercase" }}>Log Engineering Problem</span></div>
              {addEngErr&&<div style={{ background:C.dangerBg,border:`1px solid ${C.danger}`,borderRadius:6,padding:"9px 14px",marginBottom:14,color:C.danger,fontSize:13 }}>{addEngErr}</div>}
              <div style={{ marginBottom:16 }}><label style={LBL}>Date <span style={{ color:C.eng }}>*</span></label><input type="date" value={engForm.date} onChange={e=>se("date",e.target.value)} style={inp()} /></div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16 }}>
                <div><label style={LBL}>Area <span style={{ color:C.eng }}>*</span></label><select value={engForm.area} onChange={e=>se("area",e.target.value)} style={{ ...inp(),cursor:"pointer" }}><option value="">— Select —</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select></div>
                <div><label style={LBL}>Sub-Area</label><input type="text" value={engForm.subArea} onChange={e=>se("subArea",e.target.value)} placeholder="e.g. PR-01, PR-02, Deluge-01" style={inp()} /></div>
              </div>
              <div style={{ marginBottom:16 }}><label style={LBL}>Problem Description <span style={{ color:C.eng }}>*</span></label><textarea value={engForm.description} onChange={e=>se("description",e.target.value)} rows={5} placeholder="Describe the engineering issue, NCR, design query, hold point..." style={{ ...inp(),resize:"vertical" }} /></div>
              <div style={{ marginBottom:20 }}>
                <label style={LBL}>Photos</label>
                <input ref={photoRef} type="file" accept="image/*" multiple capture="environment" onChange={handlePhotoAdd} style={{ display:"none" }} />
                <button onClick={()=>photoRef.current.click()} style={{ padding:"9px 18px",background:C.headBg,border:`1px solid ${C.border}`,color:C.text,borderRadius:6,cursor:"pointer",fontSize:12,fontFamily:"'Courier New',monospace" }}>📷 Add Photo(s)</button>
                {engForm.photos?.length>0&&<div style={{ display:"flex",gap:8,flexWrap:"wrap",marginTop:12 }}>{engForm.photos.map((ph,idx)=><div key={idx} style={{ position:"relative" }}><img src={ph} style={{ width:72,height:72,objectFit:"cover",borderRadius:6,border:`1px solid ${C.border}` }} /><button onClick={()=>setEngForm(p=>({...p,photos:p.photos.filter((_,i)=>i!==idx)}))} style={{ position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:C.danger,border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button></div>)}</div>}
              </div>
              <button onClick={addEng} style={{ width:"100%",padding:13,background:"transparent",color:C.eng,border:`2px solid ${C.eng}`,borderRadius:6,fontSize:13,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Courier New',monospace",marginBottom:stagedEng.length?10:0 }}>+ Add This Issue</button>
              {stagedEng.length>0&&<button onClick={submitAllEng} style={{ width:"100%",padding:13,background:C.eng,color:"#fff",border:"none",borderRadius:6,fontSize:13,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Courier New',monospace" }}>✔ Submit All {stagedEng.length} {stagedEng.length===1?"Issue":"Issues"}</button>}
            </div>
            {engIssues.length>0&&<div style={{ marginTop:28 }}>
              <div style={{ display:"flex",gap:8,marginBottom:14,alignItems:"center" }}>
                <span style={{ fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginRight:8 }}>All Issues:</span>
                {["all","open","resolved"].map(f=><button key={f} onClick={()=>setEngFilter(f)} style={{ padding:"4px 14px",borderRadius:4,cursor:"pointer",fontSize:11,fontWeight:700,background:engFilter===f?(f==="resolved"?C.resolvedBg:f==="open"?C.dangerBg:C.headBg):"transparent",color:engFilter===f?(f==="resolved"?C.resolved:f==="open"?C.danger:C.text):C.muted,border:`1px solid ${engFilter===f?(f==="resolved"?C.resolved:f==="open"?C.danger:C.border):C.border}`,fontFamily:"'Courier New',monospace",textTransform:"uppercase" }}>{f}</button>)}
              </div>
              {engIssues.filter(e=>engFilter==="all"||(e.status||"open")===engFilter).sort((a,b)=>b.date.localeCompare(a.date)).map(e=><EngCard key={e.id} issue={e} onToggle={session.isAdmin?toggleResolve:null} />)}
            </div>}
          </div>
        )}

        {/* ══ CHAT ══ */}
        {tab==="chat"&&<ChatPanel session={session} />}

        {/* ══ SUMMARY ══ */}
        {tab==="summary"&&(
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:22,flexWrap:"wrap" }}>
              <div style={{ fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase" }}>Summary for:</div>
              <input type="date" value={sumDate} onChange={e=>setSumDate(e.target.value)} style={{ ...inp({width:"auto",padding:"8px 14px"}) }} />
              <button onClick={()=>setSumDate(todayStr())} style={{ padding:"8px 14px",background:sumDate===todayStr()?C.accent:"transparent",color:sumDate===todayStr()?"#000":C.muted,border:`1px solid ${sumDate===todayStr()?C.accent:C.border}`,borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"'Courier New',monospace",fontWeight:700 }}>Today</button>
            </div>
            <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:22,marginBottom:20 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}><div style={{ width:3,height:20,background:C.accent,borderRadius:2 }} /><span style={{ fontSize:12,fontWeight:700,letterSpacing:"0.1em",color:C.accent,textTransform:"uppercase" }}>👷 Manpower Dashboard</span></div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18 }}>
                <Stat label="Reports" value={sumReports.length} />
                <Stat label="Welders" value={sumReports.reduce((s,r)=>s+r.welder,0)} />
                <Stat label="Pipe Fitters" value={sumReports.reduce((s,r)=>s+r.pipeFitter,0)} />
                <Stat label="Total Manpower" value={sumReports.reduce((s,r)=>s+r.totalManpower,0)} color={C.accent} />
              </div>
              {Object.keys(areaMap).length===0
                ?<div style={{ textAlign:"center",padding:24,color:C.muted,fontSize:13 }}>No manpower data for this date.</div>
                :<table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                  <thead><tr style={{ background:C.headBg,borderBottom:`2px solid ${C.accent}` }}>{["Area","Sub-Areas","Supervisor(s)","Welder","Pipe Fitter","Total MP"].map(h=><th key={h} style={{ padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {Object.entries(areaMap).map(([area,data],i)=>{
                      const subs=[...new Set(data.entries.map(e=>e.subArea).filter(s=>s!=="-"))].join(", ")||"—";
                      const sups=[...new Set(data.entries.map(e=>e.supervisor))].join(", ");
                      return(<tr key={area} style={{ borderBottom:`1px solid ${C.border}`,background:i%2?C.altRow:"transparent" }}>
                        <td style={{ padding:"10px 12px" }}><span style={{ background:C.headBg,border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 9px",fontWeight:700 }}>{area}</span></td>
                        <td style={{ padding:"10px 12px",color:C.muted,fontSize:12 }}>{subs}</td>
                        <td style={{ padding:"10px 12px" }}>{sups}</td>
                        <td style={{ padding:"10px 12px",textAlign:"center" }}>{data.welder}</td>
                        <td style={{ padding:"10px 12px",textAlign:"center" }}>{data.pipeFitter}</td>
                        <td style={{ padding:"10px 12px",textAlign:"center",fontWeight:700,fontSize:16,color:C.accent }}>{data.total}</td>
                      </tr>);
                    })}
                    <tr style={{ borderTop:`2px solid ${C.accent}`,background:C.headBg }}>
                      <td colSpan={3} style={{ padding:"10px 12px",fontWeight:700,fontSize:11,color:C.muted,textTransform:"uppercase" }}>TOTAL</td>
                      <td style={{ padding:"10px 12px",textAlign:"center",fontWeight:700 }}>{sumReports.reduce((s,r)=>s+r.welder,0)}</td>
                      <td style={{ padding:"10px 12px",textAlign:"center",fontWeight:700 }}>{sumReports.reduce((s,r)=>s+r.pipeFitter,0)}</td>
                      <td style={{ padding:"10px 12px",textAlign:"center",fontWeight:700,fontSize:18,color:C.accent }}>{sumReports.reduce((s,r)=>s+r.totalManpower,0)}</td>
                    </tr>
                  </tbody>
                </table>}
            </div>

            {/* 🎯 Area Targets Dashboard */}
            {(()=>{
              const dayTargets = targets.filter(t=>t.date===sumDate);
              if (!dayTargets.length) return null;
              return (
                <div style={{ background:C.surface,border:`1px solid #2a3d52`,borderRadius:10,padding:22,marginBottom:20 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
                    <div style={{ width:3,height:20,background:"#58a6ff",borderRadius:2 }} />
                    <span style={{ fontSize:12,fontWeight:700,letterSpacing:"0.1em",color:"#58a6ff",textTransform:"uppercase" }}>🎯 Area Targets</span>
                  </div>
                  <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                    <thead>
                      <tr style={{ background:C.headBg,borderBottom:`2px solid #58a6ff` }}>
                        {["Area","Supervisor","Welding (Dia/In)","Fit-Up (Dia/In)","TP Completion (No.)"].map(h=>(
                          <th key={h} style={{ padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dayTargets.map((t,i)=>(
                        <tr key={t.id} style={{ borderBottom:`1px solid ${C.border}`,background:i%2?C.altRow:"transparent" }}>
                          <td style={{ padding:"10px 12px" }}><span style={{ background:C.headBg,border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 9px",fontWeight:700 }}>{t.area}</span></td>
                          <td style={{ padding:"10px 12px",fontWeight:700 }}>{t.supervisor}</td>
                          <td style={{ padding:"10px 12px",textAlign:"center" }}>{t.weldTarget&&t.weldTarget!=="-"?<span style={{ color:"#58a6ff",fontWeight:700 }}>{t.weldTarget}"</span>:<span style={{ color:C.muted }}>—</span>}</td>
                          <td style={{ padding:"10px 12px",textAlign:"center" }}>{t.fitUpTarget&&t.fitUpTarget!=="-"?<span style={{ color:"#58a6ff",fontWeight:700 }}>{t.fitUpTarget}"</span>:<span style={{ color:C.muted }}>—</span>}</td>
                          <td style={{ padding:"10px 12px",textAlign:"center" }}>{t.tpCompletion&&t.tpCompletion!=="-"?<span style={{ color:"#58a6ff",fontWeight:700 }}>{t.tpCompletion} TPs</span>:<span style={{ color:C.muted }}>—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
            <div style={{ background:C.surface,border:`1px solid ${C.eng}44`,borderRadius:10,padding:22 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
                <div style={{ width:3,height:20,background:C.eng,borderRadius:2 }} />
                <span style={{ fontSize:12,fontWeight:700,letterSpacing:"0.1em",color:C.eng,textTransform:"uppercase" }}>⚠️ Engineering Dashboard</span>
                <div style={{ marginLeft:"auto",display:"flex",gap:16 }}>
                  <span style={{ fontSize:12,color:C.danger }}>🔴 Open: <strong>{openOnDate.length}</strong></span>
                  <span style={{ fontSize:12,color:C.accent }}>Logged: <strong>{sumEng.length}</strong></span>
                </div>
              </div>
              {sumEng.length===0?<div style={{ textAlign:"center",padding:24,color:C.muted,fontSize:13 }}>No engineering issues logged on this date.</div>:sumEng.map(e=><EngCard key={e.id} issue={e} onToggle={session.isAdmin?toggleResolve:null} />)}
            </div>
          </div>
        )}

        {/* ══ RECORDS (Admin) ══ */}
        {tab==="records"&&session.isAdmin&&(
          <div>
            <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:18,marginBottom:18 }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto auto auto",gap:10,alignItems:"end" }}>
                <div><label style={LBL}>Supervisor</label><select value={fSup} onChange={e=>setFSup(e.target.value)} style={{ ...inp(),cursor:"pointer" }}><option value="All">All</option>{SUPERVISORS.map(s=><option key={s}>{s}</option>)}</select></div>
                <div><label style={LBL}>Area</label><select value={fArea} onChange={e=>setFArea(e.target.value)} style={{ ...inp(),cursor:"pointer" }}><option value="All">All</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select></div>
                <div><label style={LBL}>Date</label><input type="date" value={fDate} onChange={e=>setFDate(e.target.value)} style={inp()} /></div>
                <div><label style={LBL}>Eng</label><select value={engFilter} onChange={e=>setEngFilter(e.target.value)} style={{ ...inp({fontSize:12}),cursor:"pointer" }}><option value="all">All</option><option value="open">Open</option><option value="resolved">Resolved</option></select></div>
                <button onClick={()=>exportCSV(fReports)} style={{ padding:"10px 12px",background:"#1a4731",color:"#3fb950",border:`1px solid ${C.success}`,borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"'Courier New',monospace",whiteSpace:"nowrap" }}>⬇ MP CSV</button>
                <button onClick={()=>exportCSV(fEng,true)} style={{ padding:"10px 12px",background:C.engBg,color:C.eng,border:`1px solid ${C.eng}`,borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"'Courier New',monospace",whiteSpace:"nowrap" }}>⬇ Eng CSV</button>
                <button onClick={()=>exportTargetCSV(targets.filter(t=>(!fDate||t.date===fDate)&&(fSup==="All"||t.supervisor===fSup)))} style={{ padding:"10px 12px",background:"#0d1f38",color:"#58a6ff",border:`1px solid #58a6ff`,borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"'Courier New',monospace",whiteSpace:"nowrap" }}>⬇ Target CSV</button>
              </div>
              {(fSup!=="All"||fArea!=="All"||fDate)&&<button onClick={()=>{setFSup("All");setFArea("All");setFDate("");}} style={{ marginTop:10,background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:12,fontFamily:"'Courier New',monospace" }}>✕ Clear</button>}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:20 }}>
              <Stat label="MP Reports" value={fReports.length} />
              <Stat label="Welders" value={fReports.reduce((s,r)=>s+r.welder,0)} />
              <Stat label="Pipe Fitters" value={fReports.reduce((s,r)=>s+r.pipeFitter,0)} />
              <Stat label="Total MP" value={fReports.reduce((s,r)=>s+r.totalManpower,0)} />
              <Stat label="Eng Issues" value={fEng.length} color={C.eng} />
            </div>
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:11,fontWeight:700,color:C.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10 }}>👷 Manpower Records ({fReports.length})</div>
              {loading?<div style={{ color:C.muted,padding:24,textAlign:"center" }}>Loading...</div>:fReports.length===0?<div style={{ color:C.muted,padding:24,textAlign:"center",background:C.surface,borderRadius:10,border:`1px solid ${C.border}` }}>No records found.</div>:(
                <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden" }}>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
                      <thead><tr style={{ background:C.headBg,borderBottom:`2px solid ${C.accent}` }}>{["Date","Supervisor","Area","Sub-Area","Welder","P.Fitter","Total","Job Description"].map(h=><th key={h} style={{ padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
                      <tbody>{fReports.map((r,i)=>(
                        <React.Fragment key={r.id}>
                          <tr onClick={()=>setExpanded(expanded===r.id?null:r.id)} style={{ borderBottom:expanded===r.id?"none":`1px solid ${C.border}`,background:i%2?C.altRow:"transparent",cursor:"pointer" }}>
                            <td style={{ padding:"9px 12px",color:C.accent,whiteSpace:"nowrap",fontWeight:600 }}>{r.date}</td>
                            <td style={{ padding:"9px 12px",fontWeight:700 }}>{r.supervisor}</td>
                            <td style={{ padding:"9px 12px" }}><span style={{ background:C.headBg,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 7px",fontSize:11 }}>{r.area}</span></td>
                            <td style={{ padding:"9px 12px",color:C.muted }}>{r.subArea}</td>
                            <td style={{ padding:"9px 12px",textAlign:"center" }}>{r.welder}</td>
                            <td style={{ padding:"9px 12px",textAlign:"center" }}>{r.pipeFitter}</td>
                            <td style={{ padding:"9px 12px",textAlign:"center",fontWeight:700,color:C.accent }}>{r.totalManpower}</td>
                            <td style={{ padding:"9px 12px",color:C.muted,maxWidth:180 }}>{expanded===r.id?<span style={{ color:C.accent }}>▲</span>:<div style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.jobDescription}</div>}</td>
                          </tr>
                          {expanded===r.id&&<tr style={{ borderBottom:`1px solid ${C.border}`,background:i%2?C.altRow:"transparent" }}><td colSpan={8} style={{ padding:"8px 16px 16px" }}><div style={{ background:"#0a0e13",border:`1px solid ${C.border}`,borderRadius:6,padding:"12px 16px" }}><div style={{ fontSize:10,color:C.accent,fontWeight:700,textTransform:"uppercase",marginBottom:6 }}>Job Description</div><div style={{ color:C.text,fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap" }}>{r.jobDescription}</div></div></td></tr>}
                        </React.Fragment>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:11,fontWeight:700,color:C.eng,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10 }}>⚠️ Engineering Issues ({fEng.length})</div>
              {fEng.length===0?<div style={{ color:C.muted,padding:24,textAlign:"center",background:C.surface,borderRadius:10,border:`1px solid ${C.border}` }}>No issues found.</div>:fEng.map(e=><EngCard key={e.id} issue={e} onToggle={toggleResolve} />)}
            </div>

            {/* Targets Records */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:11,fontWeight:700,color:"#58a6ff",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10 }}>🎯 Targets</div>
              {(()=>{
                const fTargets = targets.filter(t=>(fSup==="All"||t.supervisor===fSup)&&(!fDate||t.date===fDate)).sort((a,b)=>b.date.localeCompare(a.date));
                if (!fTargets.length) return <div style={{ color:C.muted,padding:24,textAlign:"center",background:C.surface,borderRadius:10,border:`1px solid ${C.border}` }}>No targets found.</div>;
                return (
                  <div style={{ background:C.surface,border:`1px solid #2a3d52`,borderRadius:10,overflow:"hidden" }}>
                    <div style={{ overflowX:"auto" }}>
                      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
                        <thead><tr style={{ background:C.headBg,borderBottom:`2px solid #58a6ff` }}>{["Date","Supervisor","Area","Welding (Dia/In)","Fit-Up (Dia/In)","TP Completion (No.)"].map(h=><th key={h} style={{ padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
                        <tbody>{fTargets.map((t,i)=>(
                          <tr key={t.id} style={{ borderBottom:`1px solid ${C.border}`,background:i%2?C.altRow:"transparent" }}>
                            <td style={{ padding:"9px 12px",color:C.accent,fontWeight:600 }}>{t.date}</td>
                            <td style={{ padding:"9px 12px",fontWeight:700 }}>{t.supervisor}</td>
                            <td style={{ padding:"9px 12px" }}><span style={{ background:C.headBg,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 7px",fontSize:11 }}>{t.area}</span></td>
                            <td style={{ padding:"9px 12px",textAlign:"center",color:"#58a6ff",fontWeight:700 }}>{t.weldTarget&&t.weldTarget!=="-"?`${t.weldTarget}"`:"—"}</td>
                            <td style={{ padding:"9px 12px",textAlign:"center",color:"#58a6ff",fontWeight:700 }}>{t.fitUpTarget&&t.fitUpTarget!=="-"?`${t.fitUpTarget}"`:"—"}</td>
                            <td style={{ padding:"9px 12px",textAlign:"center",color:"#58a6ff",fontWeight:700 }}>{t.tpCompletion&&t.tpCompletion!=="-"?`${t.tpCompletion} TPs`:"—"}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:22 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}><div style={{ width:3,height:20,background:C.accent,borderRadius:2 }} /><span style={{ fontSize:12,fontWeight:700,letterSpacing:"0.1em",color:C.accent,textTransform:"uppercase" }}>🔑 User Password Management</span></div>
              {pwSaved&&<div style={{ background:C.successBg,border:`1px solid ${C.success}`,borderRadius:6,padding:"9px 14px",marginBottom:14,color:"#3fb950",fontSize:13 }}>{pwSaved}</div>}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14 }}>
                {SUPERVISORS.map(name=>(
                  <div key={name} style={{ background:"#0a0e13",border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 16px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}><Avatar name={name} size={24} /><label style={{ ...LBL,marginBottom:0,color:name===ADMIN_USER?C.accent:C.muted }}>{name} {name===ADMIN_USER?"(Admin)":""}</label></div>
                    <input type="text" value={pwEdit[name]||""} onChange={e=>setPwEdit(p=>({...p,[name]:e.target.value}))} placeholder={`New password for ${name}`} style={{ ...inp(),fontSize:13 }} />
                    <div style={{ fontSize:10,color:C.muted,marginTop:6 }}>Current: <code style={{ color:C.text }}>{users?.[name]||"—"}</code></div>
                  </div>
                ))}
              </div>
              <button onClick={savePasswords} style={{ marginTop:16,width:"100%",padding:12,background:C.accent,color:"#000",border:"none",borderRadius:6,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:"0.1em",textTransform:"uppercase" }}>🔑 Save Password Changes</button>
              <div style={{ marginTop:10,fontSize:11,color:C.muted,textAlign:"center" }}>Password changes take effect immediately. Users must re-login with new password.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
