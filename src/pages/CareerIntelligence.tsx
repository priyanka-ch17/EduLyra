import { useMemo, useState } from "react";
import {
  ArrowRight, BadgeCheck, BarChart3, BrainCircuit, Building2, CheckCircle2, ChevronRight,
  CircleHelp, Clock3, Code2, Database, FlaskConical, GitBranch, GraduationCap, Lightbulb,
  Map, PlayCircle, Radar as RadarIcon, Rocket, ShieldCheck, Sparkles, Target, TrendingUp,
  Users, WandSparkles, BriefcaseBusiness, FileText, Download, MessageCircle, X, Check
} from "lucide-react";
import {
  PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip
} from "recharts";
import { Link } from "react-router-dom";
import { getMyData, updateProfile } from "../services/store";
import { buildIntelligence } from "../services/intelligence";
import { subjectForSkill } from "../services/learningCatalog";

const careers: Record<string, { readiness:number; skills:string[]; gaps:string[]; roadmap:string[] }> = {
  "Data Analyst": { readiness: 52, skills:["SQL","Excel","Python","Statistics","Power BI"], gaps:["Python","Pandas","Statistics","Power BI"], roadmap:["Python foundations","Statistics & Pandas","Power BI","Data cleaning project","Analytics portfolio"] },
  "AI Product Engineer": { readiness: 62, skills:["Python","AI / ML","React","Cloud"], gaps:["AI / ML","Cloud","System Design"], roadmap:["Python + APIs","AI/ML foundations","Build AI product","Cloud deployment","Industry project"] },
  "Full Stack Java Engineer": { readiness: 68, skills:["Java","Spring Boot","SQL","React"], gaps:["Spring Boot","System Design","Docker"], roadmap:["Spring Boot","REST APIs","System Design","Docker","Full-stack project"] },
};

const projects = [
  { company:"TechNova", title:"AI-powered Customer Support Dashboard", skills:["Python","FastAPI","React","PostgreSQL"], slots:4, fit:94, duration:"6 weeks", mentor:"Industry + Faculty" },
  { company:"NovaTech Labs", title:"AI Resume Intelligence", skills:["Python","NLP","React"], slots:4, fit:91, duration:"5 weeks", mentor:"Industry mentor" },
  { company:"Aster Systems", title:"Smart Campus Analytics", skills:["SQL","Power BI","Python"], slots:6, fit:88, duration:"4 weeks", mentor:"Faculty mentor" },
];

function ScoreRing({ value }: { value:number }) {
  const radius=52, circumference=2*Math.PI*radius, offset=circumference-(value/100)*circumference;
  return <div className="relative grid h-40 w-40 place-items-center">
    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 144 144">
      <circle cx="72" cy="72" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10"/>
      <circle cx="72" cy="72" r={radius} fill="none" stroke="url(#scoreGradient)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}/>
      <defs><linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#06b6d4"/><stop offset="55%" stopColor="#6366f1"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
    </svg>
    <div className="text-center"><div className="text-4xl font-black text-slate-950">{value}</div><div className="text-[10px] font-black uppercase tracking-widest text-slate-400">/ 100</div></div>
  </div>;
}

function Metric({label,value,icon:Icon}:{label:string;value:number;icon:any}) {
  return <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span><Icon size={15} className="text-cyan-600"/></div>
    <div className="mt-2 text-2xl font-black">{value}%</div>
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{width:`${value}%`}}/></div>
  </div>;
}

export function CareerIntelligence() {
  const user:any=getMyData();
  const intelligence=buildIntelligence(user);
  const requestedTarget=String(user?.profile?.desiredJobRole||user?.profile?.careerGoal||"Data Analyst");
  const [target,setTarget]=useState(careers[requestedTarget] ? requestedTarget : "Data Analyst");
  const [selected,setSelected]=useState<string[]>([]);
  const [activeTab,setActiveTab]=useState("overview");
  const [chatOpen,setChatOpen]=useState(false);
  const [chat,setChat]=useState("");
  const [simMessage,setSimMessage]=useState("");
  const career=careers[target] || careers["Data Analyst"];
  const baseReadiness=intelligence.readiness;
  const projected=Math.min(99,baseReadiness+selected.length*8);
  const skillData=intelligence.skills.slice(0,7).map(x=>({skill:x.name,demand:x.demand,student:selected.includes(x.name)?Math.min(99,x.level+14):x.level}));

  const profileSkills: string[]=(user?.profile?.currentSkills||["Java","SQL","HTML","Basic Python"]).map(String).slice(0,8);
  const evidence=useMemo(()=>[
    ["Java","Assessment — 87%","Project — E-Commerce Management System","Faculty verification","Industry verification"],
    ["SQL","Assessment — 82%","Project evidence","Faculty verification",""],
    ["Communication","Assessment — 76%","Workshop evidence","",""],
    ["Python","Course evidence — In progress","","",""],
  ],[]);

  const toggle=(skill:string)=>{
    setSelected(s=>s.includes(skill)?s.filter(x=>x!==skill):[...s,skill]);
    setSimMessage("");
  };

  const applyLearning=()=>{
    const current:string[]=user?.profile?.currentSkills||[];
    const next=[...new Set([...current,...selected])];
    updateProfile({currentSkills:next});
    setSimMessage("Your profile has been updated. Career Intelligence will use these verified learning milestones for future recommendations.");
  };

  const ask=(q:string)=>{
    setChat(q);
  };

  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-[32px] bg-slate-950 p-6 text-white shadow-2xl lg:p-9">
      <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"/>
      <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"/>
      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-cyan-200"><Sparkles size={13}/> EduLyra Career Intelligence</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">One profile. <span className="text-cyan-300">One skill journey.</span> One intelligent career path.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">EduLyra understands where you are, identifies what is missing, predicts where you can go and creates the path to get there.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={()=>document.getElementById("career-twin")?.scrollIntoView({behavior:"smooth"})}>Explore Career Twin <ArrowRight size={16}/></button>
            <Link to="/student/portfolio" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/15"><ShieldCheck size={16}/> Open Skill Passport</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300 text-slate-950"><BrainCircuit size={21}/></div><div><p className="font-black">Career Intelligence Preview</p><p className="text-xs text-slate-400">Live profile intelligence</p></div></div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/5 p-4"><p className="text-2xl font-black">{baseReadiness}%</p><p className="mt-1 text-[10px] text-slate-400">Career Readiness</p></div>
            <div className="rounded-2xl bg-white/5 p-4"><p className="text-2xl font-black">92%</p><p className="mt-1 text-[10px] text-slate-400">Opportunity Match</p></div>
            <div className="rounded-2xl bg-white/5 p-4"><p className="text-2xl font-black">24</p><p className="mt-1 text-[10px] text-slate-400">Skills Mapped</p></div>
            <div className="rounded-2xl bg-white/5 p-4"><p className="text-2xl font-black">8</p><p className="mt-1 text-[10px] text-slate-400">Evidence Items</p></div>
          </div>
        </div>
      </div>
    </section>

    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      {[["overview","Intelligence Overview",BrainCircuit],["simulator","What-If Simulator",WandSparkles],["passport","Verified Passport",ShieldCheck],["marketplace","Industry Challenges",Building2]].map(([id,label,Icon]:any)=>
        <button key={id} onClick={()=>setActiveTab(id)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition ${activeTab===id?"bg-slate-950 text-white shadow-md":"text-slate-500 hover:bg-slate-50"}`}><Icon size={15}/>{label}</button>
      )}
    </div>

    {(activeTab==="overview" || activeTab==="simulator") && <section id="career-twin" className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
      <div className="card p-6">
        <div className="flex items-start justify-between"><div><span className="badge-ai"><BrainCircuit size={13}/> AI Career Twin</span><h2 className="mt-3 text-xl font-black">Your professional trajectory</h2><p className="mt-1 text-xs text-slate-400">A living model built from your skills, evidence, goals and learning.</p></div><GitBranch className="text-violet-500"/></div>
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-50 to-cyan-50 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target career</p>
          <select value={target} onChange={e=>setTarget(e.target.value)} className="mt-2 w-full rounded-xl border border-white bg-white px-3 py-3 text-sm font-black outline-none"><option>Data Analyst</option><option>AI Product Engineer</option><option>Full Stack Java Engineer</option></select>
          <p className="mt-5 text-sm font-black">Career Readiness <span className="float-right text-cyan-700">{projected}%</span></p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 transition-all" style={{width:`${projected}%`}}/></div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">{profileSkills.map((s:string)=><span key={s} className="skill-chip">{s} ✓</span>)}</div>
        <div className="mt-5 space-y-2">{career.gaps.map((s:string,i:number)=><div key={s} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-xs font-black text-amber-700">{i+1}</span><span className="text-sm font-bold">{s}</span><span className="ml-auto text-[10px] font-black text-amber-700">Skill gap</span></div>)}</div>
        <button onClick={()=>setChatOpen(true)} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-xs font-black text-violet-700"><MessageCircle size={15}/> Ask Career Twin</button>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><span className="badge-ai"><WandSparkles size={13}/> What-If Career Simulator</span><h2 className="mt-3 text-xl font-black">What happens if you invest in the right skills?</h2><p className="mt-1 text-xs text-slate-400">Select learning milestones and see your projected career readiness.</p></div><CircleHelp size={19} className="text-slate-300"/></div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_.7fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current profile</p>
            <div className="mt-3 flex flex-wrap gap-2">{profileSkills.map((s:string)=><span key={s} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold">{s}</span>)}</div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Add milestones</p>
            <div className="mt-3 space-y-2">{intelligence.gaps.map(g=>g.name).map(s=><button key={s} onClick={()=>toggle(s)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selected.includes(s)?"border-cyan-300 bg-cyan-50":"border-slate-100 hover:border-cyan-200"}`}><span className={`grid h-7 w-7 place-items-center rounded-lg ${selected.includes(s)?"bg-cyan-600 text-white":"bg-slate-100 text-slate-500"}`}>{selected.includes(s)?<Check size={14}/>:<span className="text-xs">+</span>}</span><span className="text-xs font-black">{s}</span><span className="ml-auto text-[10px] text-slate-400">+8%</span></button>)}</div>
          </div>
          <div className="rounded-3xl bg-slate-950 p-5 text-white">
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-300">Projected readiness</p>
            <div className="mt-3 flex justify-center"><ScoreRing value={projected}/></div>
            <div className="mt-2 text-center text-xs text-slate-400">{baseReadiness}% → {selected.length?selected.map((_,i)=>Math.min(99,baseReadiness+(i+1)*8)).join("% → ")+"%":"select milestones"}</div>
            <button onClick={applyLearning} disabled={!selected.length} className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-xs font-black text-slate-950 disabled:opacity-40">Build My Roadmap <ArrowRight size={14} className="inline"/></button>
            {simMessage&&<p className="mt-3 rounded-xl bg-white/10 p-3 text-[10px] leading-5 text-cyan-100">{simMessage}</p>}
          </div>
        </div>
      </div>
    </section>}

    {activeTab==="overview" && <>
      <section className="grid gap-5 lg:grid-cols-[.75fr_1.25fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between"><div><span className="badge"><Target size={13}/> Career Readiness Score</span><h2 className="mt-2 font-black">Industry-ready score</h2></div><TrendingUp className="text-emerald-500"/></div>
          <div className="flex flex-col items-center py-4"><ScoreRing value={baseReadiness}/><span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">Career Ready</span></div>
          <div className="grid gap-3 sm:grid-cols-2">{Object.entries(intelligence.dimensions).slice(0,6).map(([label,value])=><Metric key={label} label={label} value={value as number} icon={label.includes("Project")?GitBranch:label.includes("Certification")?BadgeCheck:label.includes("Communication")?MessageCircle:label.includes("Internship")?BriefcaseBusiness:label.includes("Interview")?Target:Code2}/>)}</div>
          <div className="mt-4 rounded-2xl bg-cyan-50 p-4 text-xs font-bold text-slate-700"><p>Complete one industry project → <b>+6 points</b></p><p className="mt-2">Improve Power BI → <b>+5 points</b></p><p className="mt-2">Complete mock interview → <b>+3 points</b></p></div>
        </div>
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><span className="badge"><RadarIcon size={13}/> Skill Demand Radar</span><h2 className="mt-2 font-black">Industry demand vs. your profile</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">Updated this month</span></div>
          <div className="mt-3 h-[360px]"><ResponsiveContainer width="100%" height="100%"><RadarChart data={skillData}><PolarGrid/><PolarAngleAxis dataKey="skill" tick={{fontSize:10}}/><PolarRadiusAxis angle={30} domain={[0,100]} tick={{fontSize:8}}/><Radar name="Industry demand" dataKey="demand" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.18}/><Radar name="Your skill level" dataKey="student" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.12}/><Tooltip/></RadarChart></ResponsiveContainer></div>
          <div className="grid gap-2 sm:grid-cols-3">{["Technology","Data","Cloud","Cybersecurity","Software Development"].map(x=><button key={x} className="rounded-xl border border-slate-100 px-3 py-2 text-[10px] font-black text-slate-500 hover:border-violet-200 hover:text-violet-700">{x}</button>)}</div>
          <div className="mt-4 rounded-2xl bg-violet-50 p-4"><p className="text-[10px] font-black uppercase tracking-widest text-violet-700">Fastest-growing skills</p><p className="mt-2 text-sm font-black">AI/ML · Cloud · Data Analytics · Cybersecurity</p></div>
        </div>
      </section>

      <section className="card overflow-hidden p-6">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><span className="badge-ai"><Map size={13}/> AI Personalized Skill Roadmap</span><h2 className="mt-2 font-black">Your next 90 days</h2><p className="mt-1 text-xs text-slate-400">A connected journey from skill gap to industry opportunity.</p></div><Link to={`/student/learning?subject=${encodeURIComponent(subjectForSkill(intelligence.gaps[0]?.name))}`} className="btn-secondary"><PlayCircle size={15}/> Start Learning</Link></div>
        <div className="mt-7 grid gap-3 lg:grid-cols-5">{career.roadmap.map((title,i)=>{ const gap=intelligence.gaps[i]; const r={title,tag:i<2?"Foundation":i<3?"Practice":i<4?"Portfolio":"Industry",time:i<2?"2 weeks":i<4?"3 weeks":"Ongoing",skill:gap?.name||"Career Evidence",progress:i<selected.length?100:Math.max(0,Math.min(100,baseReadiness-50-i*8))}; return <div key={r.title} className="relative rounded-2xl border border-slate-100 bg-white p-4"><div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">{i+1}</span><span className="text-[9px] font-black uppercase tracking-wider text-cyan-700">{r.tag}</span></div><h3 className="mt-4 text-sm font-black leading-5">{r.title}</h3><p className="mt-1 text-[10px] font-semibold text-slate-400">{r.time}</p><p className="mt-3 text-[10px] font-bold text-slate-500">Skill gained: {r.skill}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{width:`${r.progress}%`}}/></div></div>})}</div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[["📺","Recommended Learning","DBMS • SQL Joins • 18 min","Watch subject video →",`/student/learning?subject=${encodeURIComponent(subjectForSkill(intelligence.gaps[0]?.name))}`],["🧩","Recommended Project","Smart Campus Analytics • 88% fit","Explore challenge →","#marketplace"],["💼","Opportunity Match","Data Analyst Intern • 91% fit","View why you match →","/student/opportunities"]].map(([emoji,title,desc,cta,href])=><div className="card p-5" key={title}><div className="text-2xl">{emoji}</div><h3 className="mt-3 font-black">{title}</h3><p className="mt-1 text-xs text-slate-500">{desc}</p>{href.startsWith("/")?<Link className="mt-4 inline-flex text-xs font-black text-cyan-700" to={href}>{cta}<ChevronRight size={13}/></Link>:<button onClick={()=>setActiveTab("marketplace")} className="mt-4 text-xs font-black text-cyan-700">{cta}<ChevronRight size={13}/></button>}</div>)}
      </section>

      <section className="card p-6">
        <div className="flex items-center gap-3"><BriefcaseBusiness className="text-cyan-600"/><div><h2 className="font-black">Why this opportunity matches you</h2><p className="text-xs text-slate-400">Explainable matching turns skills into an actionable next step.</p></div><span className="ml-auto text-2xl font-black text-violet-700">92%</span></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-5">{[["Java","95%","match"],["SQL","88%","match"],["Spring Boot","76%","match"],["AWS","Missing","gap"],["Docker","Beginner","gap"]].map(([s,v,t])=><div key={s} className={`rounded-2xl p-4 ${t==="match"?"bg-emerald-50":"bg-amber-50"}`}><p className="text-xs font-black">{s}</p><p className={`mt-2 text-sm font-black ${t==="match"?"text-emerald-700":"text-amber-700"}`}>{v}</p></div>)}</div>
        <p className="mt-4 rounded-xl bg-cyan-50 p-3 text-xs font-bold text-slate-700">Improve Docker → projected opportunity match <b>96%</b></p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[["🎯","Your readiness increased","Complete SQL Joins to close one of your top skill gaps."],["📈","Skill demand changed","Python demand is now 91% in the Data category."],["🏭","New industry challenge","TechNova posted a project matching your profile."]].map(([a,b,c])=><div className="card p-5" key={b}><div className="text-xl">{a}</div><h3 className="mt-2 text-sm font-black">{b}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{c}</p></div>)}
      </section>
    </>}

    {activeTab==="passport" && <section className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
      <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><span className="badge-verified"><ShieldCheck size={13}/> Verified Skill Passport</span><h2 className="mt-4 text-3xl font-black">Evidence, not just claims.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Every important skill is backed by assessments, projects, certifications, faculty verification or industry evidence.</p></div><BadgeCheck size={45} className="text-cyan-300"/></div>
        <div className="mt-7 space-y-3">{evidence.map(([skill,...items])=><div key={skill} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><BadgeCheck size={16} className="text-emerald-300"/><span className="font-black">{skill}</span></div><span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black text-emerald-300">{skill==="Python"?"In progress":"Verified"}</span></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{items.filter(Boolean).map(x=><div key={x} className="rounded-xl bg-white/5 p-2.5 text-[10px] text-slate-300">✓ {x}</div>)}</div></div>)}</div>
        <div className="mt-6 flex flex-wrap gap-3"><button onClick={()=>alert("Verification QR generated for this demo profile.")} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-950"><ShieldCheck size={15}/> Verify Skill</button><button className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-black"><Download size={15}/> Download Passport</button></div>
      </div>
      <div className="space-y-5">
        <div className="card p-6"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><FlaskConical size={20}/></div><div><h2 className="font-black">Evidence timeline</h2><p className="text-xs text-slate-400">How your profile became verified</p></div></div><div className="mt-6 space-y-5">{["Java project evaluated","SQL assessment completed","Communication verified","Cloud course started"].map((x,i)=><div key={x} className="flex gap-3"><div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500"/><div><p className="text-xs font-bold">{x}</p><p className="mt-1 text-[10px] text-slate-400">{i<3?"Evidence attached • Verified":"Evidence attached • In progress"}</p></div></div>)}</div></div>
        <div className="card p-6"><h2 className="font-black">Shareable professional identity</h2><p className="mt-2 text-xs leading-5 text-slate-500">Employers can verify the evidence behind your skills before shortlisting.</p><div className="mt-4 flex items-center gap-4"><div className="grid h-24 w-24 place-items-center rounded-2xl border-8 border-slate-100 bg-white p-1"><img className="h-full w-full rounded-lg" alt="Skill Passport QR" src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent("https://edulyra.example/verify/student-demo")}`}/></div><div><p className="text-xs font-black">Passport ID: EDL-2026-00421</p><p className="mt-1 text-[10px] text-slate-400">Scan to verify evidence</p></div></div></div>
      </div>
    </section>}

    {activeTab==="marketplace" && <section className="space-y-5">
      <div className="rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-cyan-50 p-6 lg:p-8"><div className="flex flex-wrap items-center justify-between gap-5"><div><span className="badge-ai"><Building2 size={13}/> Industry–Academia Project Marketplace</span><h2 className="mt-3 text-3xl font-black">Solve real problems. Build verified experience.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Industry publishes a challenge, faculty mentors the team, students deliver the solution, industry evaluates it and EduLyra records the outcome as evidence.</p></div><div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-950 text-cyan-300"><Lightbulb size={26}/></div></div></div>
      <div className="grid gap-4 lg:grid-cols-3">{projects.map(p=><div className="card p-5" key={p.title}><div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.company}</span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">{p.fit}% fit</span></div><h3 className="mt-4 text-base font-black">{p.title}</h3><div className="mt-3 flex flex-wrap gap-1.5">{p.skills.map(s=><span key={s} className="skill-chip">{s}</span>)}</div><div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-slate-500"><span>⏱ {p.duration}</span><span>👥 {p.slots} slots</span></div><div className="mt-5 border-t border-slate-100 pt-4"><p className="text-[10px] font-bold text-slate-400">Collaboration model</p><p className="mt-1 text-xs font-black">{p.mentor}</p><div className="mt-3 flex gap-2"><button onClick={()=>alert(`Application started for ${p.title}`)} className="btn-primary flex-1 justify-center">Apply</button><button className="btn-secondary">View</button></div></div></div>)}</div>
      <div className="card p-6"><h3 className="font-black">Industry → Student Team → Faculty Mentor → Project → Industry Evaluation → Verified Experience</h3><div className="mt-5 grid gap-2 sm:grid-cols-6">{["Industry Problem","Student Team","Faculty Mentor","Development","Evaluation","Verified Experience"].map((x,i)=><div key={x} className="rounded-xl bg-slate-50 p-3 text-center text-[10px] font-black"><span className="text-violet-600">{i+1}</span><p className="mt-1">{x}</p></div>)}</div></div>
    </section>}

    <section className="grid gap-4 sm:grid-cols-3">
      {[["Evidence-based","Skills are supported by measurable proof.",BarChart3],["Explainable AI","Every recommendation shows its reason.",Target],["Outcome focused","Learning is connected to real opportunities.",Rocket]].map(([t,d,I]:any)=><div className="card p-5" key={t}><I size={20} className="text-cyan-600"/><h3 className="mt-3 text-sm font-black">{t}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{d}</p></div>)}
    </section>

    {chatOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" onClick={()=>setChatOpen(false)}>
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between"><div><span className="badge-ai"><BrainCircuit size={13}/> Ask Career Twin</span><h2 className="mt-3 text-xl font-black">Your AI career guide</h2></div><button onClick={()=>setChatOpen(false)}><X/></button></div>
        <div className="mt-5 grid gap-2">{["What should I learn next?","Am I ready for a Data Analyst internship?","Which skill will improve my opportunities fastest?","What projects should I build?","Which careers match my current skills?"].map(q=><button key={q} onClick={()=>ask(q)} className="rounded-xl border border-slate-100 p-3 text-left text-xs font-bold hover:bg-slate-50">{q}</button>)}</div>
        {chat&&<div className="mt-4 rounded-2xl bg-cyan-50 p-4 text-xs leading-5 text-slate-700"><b>{chat}</b><p className="mt-2">Based on your current evidence, prioritize <b>{career.gaps.slice(0,2).join(" and ")}</b>. Completing these skills and one industry project should improve your readiness and opportunity fit.</p></div>}
      </div>
    </div>}
  </div>;
}
