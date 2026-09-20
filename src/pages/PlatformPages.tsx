import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Award, BarChart3, BriefcaseBusiness, CheckCircle2, Download, Filter, GraduationCap, Handshake, Search, ShieldCheck, Users, Video, XCircle, WandSparkles, ChevronRight, Rocket } from 'lucide-react';
import { allUsers, getMyData, getOpportunities, getMentorshipRequests, requestMentorship, updateProfile, saveOpportunity, applyToOpportunity, sendMessage, updateApplicationForCandidate } from '../services/store';
import { buildIntelligence } from '../services/intelligence';
import { subjectForSkill } from '../services/learningCatalog';

const listValue=(value:any): string[] => { if(Array.isArray(value)) return value.map(String); if(value==null || value==='') return []; return String(value).split(',').map(x=>x.trim()).filter(Boolean); };
const Title=({title,subtitle}:{title:string;subtitle:string})=><div><h1 className="text-2xl font-black tracking-tight">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>;
const Card=({children,className=''}:{children:React.ReactNode;className?:string})=><div className={`card ${className}`}>{children}</div>;
const Button=({children,onClick,secondary=false,disabled=false}:{children:React.ReactNode;onClick?:()=>void;secondary?:boolean;disabled?:boolean})=><button disabled={disabled} onClick={onClick} className={`${secondary?'btn-secondary':'btn-primary'} disabled:opacity-50`}>{children}</button>;

export function CareerReadiness(){const u:any=getMyData();const i=buildIntelligence(u);const items=Object.entries(i.dimensions);return <div className="space-y-6"><Title title="Career Readiness Score" subtitle="A profile-derived employability signal that changes as your skills, evidence, projects and learning change."/><Card className="overflow-hidden p-0"><div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-7 text-white"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Current readiness</p><p className="mt-2 text-6xl font-black">{i.readiness}<span className="text-2xl text-slate-400">/100</span></p><p className="mt-2 max-w-xl text-sm text-slate-300">Derived from technical capability, evidence, experience, learning and industry alignment — not random demo numbers.</p></div><Link className="btn-primary bg-white text-slate-950 hover:bg-slate-100" to="/student/intelligence">Open Career Intelligence</Link></div></div><div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">{items.map(([name,score])=><div key={name} className="rounded-2xl border border-slate-100 p-4"><div className="flex justify-between gap-3"><b className="text-sm">{name}</b><b className="text-violet-700">{score}%</b></div><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500" style={{width:`${score}%`}}/></div><p className="mt-3 text-xs text-slate-500">{Number(score)>=75?'Strong signal — maintain it.':'Improvement opportunity — follow the next recommended action.'}</p></div>)}</div></Card></div>}

export function SkillRadar(){const u:any=getMyData();const i=buildIntelligence(u);const [domain,setDomain]=useState('All');const domains=['All','Software','Data','AI/ML','Cloud','Cybersecurity','Web','Business Analytics'];const filtered=i.skills.filter((s:any)=>domain==='All'||(domain==='Data'&&['Python','SQL','Pandas','Power BI','Statistics','Excel'].includes(s.name))||(domain==='Web'&&['React','JavaScript','HTML','CSS'].includes(s.name))||(domain==='Software'&&['Java','Data Structures','Spring Boot','System Design','Git'].includes(s.name))||(domain==='AI/ML'&&['AI / ML','Python','Pandas','Statistics'].includes(s.name))||(domain==='Cloud'&&['Cloud','Docker'].includes(s.name)));return <div className="space-y-6"><Title title="Skill Demand Radar" subtitle="See the difference between industry demand and your current profile level."/><div className="flex flex-wrap gap-2">{domains.map(x=><button key={x} onClick={()=>setDomain(x)} className={`rounded-full px-4 py-2 text-xs font-black ${domain===x?'bg-slate-950 text-white':'bg-white text-slate-600 ring-1 ring-slate-200'}`}>{x}</button>)}</div><Card className="p-6"><div className="grid gap-4 md:grid-cols-2">{filtered.map((s:any)=><div key={s.name} className="rounded-2xl border p-4"><div className="flex justify-between"><b>{s.name}</b><span className={`badge ${s.gap>20?'bg-red-50 text-red-700':s.gap>10?'bg-amber-50 text-amber-700':'bg-emerald-50 text-emerald-700'}`}>{s.gap>20?'Critical':s.gap>10?'Watch':'Aligned'}</span></div><div className="mt-4 space-y-2 text-xs"><div className="flex justify-between"><span>Industry demand</span><b>{s.demand}%</b></div><div className="h-2 rounded bg-slate-100"><div className="h-full rounded bg-indigo-500" style={{width:`${s.demand}%`}}/></div><div className="flex justify-between"><span>My level</span><b>{s.level}%</b></div><div className="h-2 rounded bg-slate-100"><div className="h-full rounded bg-cyan-500" style={{width:`${s.level}%`}}/></div></div></div>)}</div></Card></div>}

export function SkillGaps(){const u:any=getMyData();const i=buildIntelligence(u);const [priority,setPriority]=useState('All');const rows=i.gaps.filter(g=>priority==='All'||g.priority===priority);return <div className="space-y-6"><Title title="Skill Gap Intelligence" subtitle="Prioritized gaps combine demand, current proficiency and potential readiness impact."/><div className="flex gap-2 flex-wrap">{['All','Critical','High','Medium','Low'].map(x=><button key={x} onClick={()=>setPriority(x)} className={`rounded-full px-4 py-2 text-xs font-black ${priority===x?'bg-violet-700 text-white':'bg-white ring-1 ring-slate-200'}`}>{x}</button>)}</div><div className="grid gap-4">{rows.map(g=><Card key={g.name} className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><span className={`badge ${g.priority==='Critical'?'bg-red-50 text-red-700':g.priority==='High'?'bg-amber-50 text-amber-700':'bg-violet-50 text-violet-700'}`}>{g.priority}</span><h2 className="mt-2 text-lg font-black">{g.name}</h2><p className="mt-1 text-xs text-slate-500">Demand {g.demand}% · Your level {g.level}% · Potential impact +{g.impact} readiness points</p></div><Link className="btn-primary" to={`/student/learning?subject=${encodeURIComponent(subjectForSkill(g.name))}`}>Learn this skill</Link></div><div className="mt-5 grid gap-2 md:grid-cols-5">{['Course','Video','Practice','Assessment','Project'].map((x,n)=><div className="rounded-xl bg-slate-50 p-3 text-center text-xs font-bold" key={x}>{n+1}. {x}</div>)}</div></Card>)}</div>{!rows.length&&<Card className="p-8 text-center text-sm text-slate-500">No gaps in this priority group. Your profile is currently aligned.</Card>}</div>}

export function WhatIfSimulator(){const u:any=getMyData();const i=buildIntelligence(u);const navigate=useNavigate();const [selected,setSelected]=useState<string[]>([]);const actions=[...i.gaps.slice(0,4).map(g=>g.name),'Build industry project','Complete internship'];const projected=Math.min(99,i.readiness+selected.reduce((sum,x)=>sum+(x==='Build industry project'?7:x==='Complete internship'?9:6),0));return <div className="space-y-6"><Title title="What-If Career Simulator" subtitle="Experiment with concrete actions and see how your connected career profile could improve."/><Card className="p-6"><div className="grid gap-5 lg:grid-cols-3"><div><p className="text-xs font-bold text-slate-400">CURRENT READINESS</p><p className="mt-2 text-5xl font-black">{i.readiness}%</p></div><div><p className="text-xs font-bold text-slate-400">PROJECTED</p><p className="mt-2 text-5xl font-black text-violet-700">{projected}%</p></div><div><p className="text-xs font-bold text-slate-400">OPPORTUNITY IMPACT</p><p className="mt-3 text-sm font-semibold">{projected-i.readiness>=18?'Strong improvement — more opportunities should align.':projected-i.readiness>=8?'Meaningful improvement — close the highest gaps next.':'Start with one critical gap for measurable progress.'}</p></div></div><div className="mt-8 grid gap-3 md:grid-cols-2">{actions.map(a=>{const on=selected.includes(a);return <button key={a} onClick={()=>setSelected(v=>on?v.filter(x=>x!==a):[...v,a])} className={`rounded-2xl border p-4 text-left ${on?'border-violet-500 bg-violet-50':'hover:border-violet-300'}`}><div className="flex items-center justify-between"><b>{a}</b>{on?<CheckCircle2 className="text-emerald-600"/>:<span className="h-5 w-5 rounded-full border"/>}</div><p className="mt-2 text-xs text-slate-500">{a.includes('project')?'Verified experience signal':a.includes('internship')?'Industry experience signal':'Targeted skill improvement'}</p></button>})}</div><button type="button" onClick={()=>navigate("/student/roadmap",{state:{simulatorScenario:{selectedChanges:selected,currentReadiness:i.readiness,projectedReadiness:projected}}})} className="btn-primary mt-6 inline-flex">Build My Roadmap</button></Card></div>}

export function Roadmap(){
 const location=useLocation();
 const u:any=getMyData();
 const i=buildIntelligence(u);
 const simulatorScenario=(location.state as any)?.simulatorScenario;
 const storageKey=`edulyra_roadmap_${u?.id||'student'}`;
 const [done,setDone]=useState<number[]>(()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'[]')}catch{return []}});
 const stages=[
  ['Days 1–15','Foundations','Learn the highest-priority skill gap','Course + topic video + quick check','Start Learning'],
  ['Days 16–30','Core Skill','Strengthen the next critical capability','Course + practice + assessment','Continue'],
  ['Days 31–45','Applied Practice','Turn knowledge into demonstrable ability','Practice + assessment','Practice'],
  ['Days 46–60','Industry Tool','Build confidence with an industry-used tool','Course + video + project','Build'],
  ['Days 61–75','Industry Project','Create verified evidence through a practical project','Project + faculty/industry review','Build Project'],
  ['Days 76–90','Career Launch','Package evidence for portfolio, resume and interviews','Portfolio + resume + mock interview','Prepare']
 ];
 const progress=Math.round(done.length/stages.length*100);
 const target=u?.profile?.desiredJobRole||u?.profile?.careerGoal||'your target career';
 const toggle=(n:number)=>setDone(prev=>{const next=prev.includes(n)?prev.filter(x=>x!==n):[...prev,n];localStorage.setItem(storageKey,JSON.stringify(next));updateProfile({roadmapProgress:next.length,roadmapCompletedStages:next});return next;});
 const firstGap=i.gaps[0]?.name;
 const learningSubject=subjectForSkill(firstGap);
 return <div className="space-y-6">
  <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-6 text-white shadow-xl lg:p-8">
   <div className="flex flex-wrap items-end justify-between gap-5"><div><span className="badge-ai"><WandSparkles size={13}/> AI CAREER ROADMAP</span><h1 className="mt-3 text-3xl font-black">Your 90-Day Career Roadmap</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">A connected plan for <b className="text-white">{target}</b>, generated from your current skills, evidence and highest-priority Skill Gaps.</p></div><div className="text-right"><p className="text-5xl font-black text-cyan-300">{progress}%</p><p className="text-xs font-bold uppercase tracking-widest text-slate-400">complete</p></div></div>
   <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all" style={{width:`${progress}%`}}/></div>
   <div className="mt-5 flex flex-wrap gap-3"><span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">Top gap: {firstGap||'Profile evidence'}</span><Link className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-950" to={`/student/learning?subject=${encodeURIComponent(learningSubject)}`}>Start Next Lesson <ChevronRight size={14} className="inline"/></Link></div>
  </div>
  {simulatorScenario?.selectedChanges?.length>0&&<Card className="border-violet-200 bg-violet-50/50 p-5"><div><p className="text-[10px] font-black uppercase tracking-widest text-violet-700">What-If Scenario Applied</p><p className="mt-1 text-sm font-semibold text-slate-700">Projected readiness: {simulatorScenario.projectedReadiness}%</p><div className="mt-3 flex flex-wrap gap-2">{simulatorScenario.selectedChanges.map((x:string)=><span className="badge bg-white text-violet-700" key={x}>{x}</span>)}</div></div></Card>}
  <Card className="p-5">
   <div className="grid gap-4 lg:grid-cols-3"><div className="rounded-2xl bg-violet-50 p-4"><p className="text-[10px] font-black uppercase tracking-widest text-violet-700">Current readiness</p><p className="mt-2 text-3xl font-black">{i.readiness}/100</p></div><div className="rounded-2xl bg-cyan-50 p-4"><p className="text-[10px] font-black uppercase tracking-widest text-cyan-700">Top skill gap</p><p className="mt-2 text-xl font-black">{firstGap||'None detected'}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Next best action</p><p className="mt-2 text-sm font-black">{done.length<stages.length?'Complete the next roadmap stage':'Maintain your profile with new evidence'}</p></div></div>
  </Card>
  <div className="space-y-4">{stages.map((s,n)=>{const is=done.includes(n);const locked=n>0&&!done.includes(n-1);return <Card key={s[0]} className={`overflow-hidden p-0 ${locked?'opacity-80':''}`}><div className="grid gap-5 p-5 lg:grid-cols-[110px_1fr_auto] lg:items-center"><div><span className={`inline-flex rounded-xl px-3 py-2 text-xs font-black ${is?'bg-emerald-100 text-emerald-700':locked?'bg-slate-100 text-slate-400':'bg-violet-100 text-violet-700'}`}>{s[0]}</span><p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Stage {n+1}</p></div><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-black">{s[1]}</h2>{is&&<span className="badge bg-emerald-50 text-emerald-700">Completed</span>}{locked&&<span className="badge bg-slate-100 text-slate-500">Locked</span>}</div><p className="mt-1 text-sm text-slate-500">{s[2]}</p><div className="mt-3 flex flex-wrap gap-2"><span className="badge bg-slate-100 text-slate-600">Course</span><span className="badge bg-slate-100 text-slate-600">Video</span><span className="badge bg-slate-100 text-slate-600">Quick Check</span><span className="badge bg-slate-100 text-slate-600">Practice</span><span className="badge bg-slate-100 text-slate-600">Assessment</span><span className="badge bg-slate-100 text-slate-600">Evidence</span></div><p className="mt-3 text-xs font-semibold text-slate-400">{s[3]}</p></div><div className="flex flex-col gap-2"><Link to={`/student/learning?subject=${encodeURIComponent(n===0?learningSubject:subjectForSkill(i.gaps[n%Math.max(1,i.gaps.length)]?.name))}`} className={`btn-secondary justify-center ${locked?'pointer-events-none opacity-50':''}`}>{s[4]}</Link><Button secondary={is} disabled={locked} onClick={()=>toggle(n)}>{is?'Completed ✓':'Complete Stage'}</Button></div></div></Card>})}</div>
  <Card className="border-cyan-100 bg-cyan-50/50 p-5"><div className="flex items-start gap-3"><Rocket className="mt-0.5 text-cyan-600"/><div><h2 className="font-black">Why this roadmap changes</h2><p className="mt-1 text-xs leading-5 text-slate-600">Completing a lesson updates your learning evidence and skill profile. The connected Career Intelligence services then recalculate readiness, Skill Gaps and opportunity alignment from the same source-of-truth profile.</p></div></div></Card>
 </div>
}
export function SkillPassport(){const u:any=getMyData();const i=buildIntelligence(u);const [verified,setVerified]=useState<string[]>([]);const skills=i.skills.filter((s:any)=>s.level>0).slice(0,10);const share=()=>{navigator.clipboard?.writeText(`EduLyra Verified Skill Passport — ${u?.name}`);alert('Passport verification reference copied.');};const download=()=>{const text=`EDULYRA VERIFIED SKILL PASSPORT\n${u?.name}\n\n${skills.map((s:any)=>`${s.name}: ${s.level}% | Evidence: Assessment / Learning${verified.includes(s.name)?' / Faculty Verified':''}`).join('\n')}`;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download='EduLyra-Verified-Skill-Passport.txt';a.click();};return <div className="space-y-6"><Title title="Verified Skill Passport" subtitle="A portable evidence layer for your professional identity."/><Card className="overflow-hidden p-0"><div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-7 text-white"><div className="flex items-center gap-3"><ShieldCheck className="text-cyan-300"/><div><p className="text-xs uppercase tracking-widest text-cyan-300">EduLyra Verified</p><h2 className="text-2xl font-black">{u?.name}</h2></div></div><p className="mt-4 max-w-2xl text-sm text-slate-300">Skills are backed by assessment, learning, projects and optional faculty/industry verification rather than self-declaration alone.</p></div><div className="grid gap-4 p-6 md:grid-cols-2">{skills.map((s:any)=><div className="rounded-2xl border p-5" key={s.name}><div className="flex justify-between"><div><b>{s.name}</b><p className="text-xs text-slate-500">Level {s.level}%</p></div><Award className="text-violet-600"/></div><div className="mt-4 space-y-2 text-xs"><p>✓ Assessment / profile evidence</p><p>✓ Learning evidence</p><p>{verified.includes(s.name)?'✓ Faculty verification requested':'○ Faculty verification available'}</p></div><Button secondary={verified.includes(s.name)} onClick={()=>setVerified(v=>v.includes(s.name)?v.filter(x=>x!==s.name):[...v,s.name])}>{verified.includes(s.name)?'Verified':'Request Verification'}</Button></div>)}</div><div className="flex flex-wrap gap-2 border-t p-6"><Button onClick={share}>Share Passport</Button><Button secondary onClick={download}>Download Passport</Button><Link className="rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-violet-700" to={`/verify/passport/${u?.id||'demo'}`}>Open QR Verification</Link></div></Card></div>}

export function ChallengeHub(){
 const u:any=getMyData();
 const [refresh,setRefresh]=useState(0);
 useEffect(()=>{const f=()=>setRefresh(x=>x+1);window.addEventListener('edulyra:data',f);return()=>window.removeEventListener('edulyra:data',f)},[]);
 const dynamic=getOpportunities().filter(o=>o.type==='Challenge');
 const fallback=[
  {id:'c1',title:'AI Customer Support Analytics Platform',company:'NovaTech Labs',skills:['Python','React','PostgreSQL','Machine Learning'],duration:'6 weeks',description:'Analyze support conversations and build dashboards that identify recurring customer issues.'},
  {id:'c2',title:'Campus Energy Optimization',company:'AeroStack',skills:['Python','SQL','Cloud','Data Analytics'],duration:'8 weeks',description:'Design a data-driven approach to reduce energy waste across a connected campus.'},
  {id:'c3',title:'Accessible Learning Assistant',company:'EduInnovate Network',skills:['React','Node.js','AI / ML'],duration:'5 weeks',description:'Prototype an inclusive assistant that improves access to digital learning resources.'}
 ];
 const challenges:any[]=dynamic.length?dynamic:fallback;
 const apps=u?.applications||[];
 return <div className="space-y-6"><Title title="Industry Challenge Hub" subtitle="Real-world problems become team projects, faculty mentorship and verified industry experience."/><div className="grid gap-4">{challenges.map((c:any)=><Card className="p-6" key={c.id}><div className="flex flex-wrap justify-between gap-4"><div><span className="badge bg-violet-50 text-violet-700">Industry Challenge</span><h2 className="mt-2 text-xl font-black">{c.title}</h2><p className="mt-1 text-sm text-slate-500">{c.company} · {c.duration||'Duration not specified'}</p></div><Button disabled={apps.some((a:any)=>a.opportunityId===c.id)} onClick={()=>applyToOpportunity(c)}>{apps.some((a:any)=>a.opportunityId===c.id)?'Application submitted':'Apply / Form Team'}</Button></div><p className="mt-4 text-sm text-slate-600">{c.description}</p><div className="mt-5 flex flex-wrap gap-2">{listValue(c.skills).map((s:string)=><span className="skill-chip" key={s}>{s}</span>)}</div><div className="mt-5 grid gap-2 md:grid-cols-4 text-xs"><div className="rounded-xl bg-slate-50 p-3">1. Student team</div><div className="rounded-xl bg-slate-50 p-3">2. Faculty mentor</div><div className="rounded-xl bg-slate-50 p-3">3. Industry review</div><div className="rounded-xl bg-slate-50 p-3">4. Verified experience</div></div></Card>)}</div></div>;
}
export function Mentorship(){
 const u:any=getMyData();
 const [requests,setRequests]=useState<any[]>(getMentorshipRequests().filter((r:any)=>r.studentId===u?.id));
 const [busy,setBusy]=useState<string|null>(null);
 const mentors=[
  {id:'m1',name:'Dr. Ananya Rao',role:'Faculty Mentor',expertise:'Data Systems · SQL · Research'},
  {id:'m2',name:'Arjun Mehta',role:'Industry Mentor',expertise:'Product Engineering · React · Cloud'},
  {id:'m3',name:'Meera Iyer',role:'Career Mentor',expertise:'Interviews · Resume · Career Strategy'}
 ];
 const send=async(m:any)=>{
   try{
    setBusy(m.id);
    const r=requestMentorship(m);
    setRequests(getMentorshipRequests().filter((x:any)=>x.studentId===u?.id));
   }catch(e:any){alert(e?.message||'Unable to send mentorship request.');}
   finally{setBusy(null);}
 };
 return <div className="space-y-6">
  <Title title="Mentorship Hub" subtitle="Connect learning, industry context and career decisions with the right mentor."/>
  <Card className="overflow-hidden p-0"><div className="ai-gradient p-6 text-white"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-100">1:1 Guidance</p><h2 className="mt-2 text-2xl font-black">Find a mentor who fits your journey</h2><p className="mt-2 max-w-2xl text-sm text-white/80">Send a request once. It is saved to your account and can be confirmed by the mentor.</p></div><div className="rounded-2xl bg-white/15 px-4 py-3 text-center backdrop-blur"><b className="text-2xl">{requests.filter((r:any)=>r.status==='Pending').length}</b><p className="text-xs text-white/75">Pending</p></div></div></div></Card>
  <div className="grid gap-4 md:grid-cols-3">{mentors.map(m=><Card className="p-5" key={m.id}><div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 text-violet-700"><Users/></div><h2 className="mt-4 font-black">{m.name}</h2><span className="badge mt-2 bg-cyan-50 text-cyan-700">{m.role}</span><p className="mt-3 text-xs leading-5 text-slate-500">{m.expertise}</p><div className="mt-5"><Button disabled={busy===m.id||requests.some((r:any)=>r.mentorId===m.id&&r.status==='Pending')} secondary={requests.some((r:any)=>r.mentorId===m.id&&r.status==='Pending')} onClick={()=>send(m)}>{requests.some((r:any)=>r.mentorId===m.id&&r.status==='Pending')?'Request Pending':busy===m.id?'Sending…':'Request Mentorship'}</Button></div></Card>)}</div>
  <Card className="p-6"><div className="flex items-center justify-between gap-3"><h2 className="font-black">My Mentorship Requests</h2><span className="badge bg-violet-50 text-violet-700">{requests.length} total</span></div><div className="mt-4 space-y-3">{requests.length?requests.map((r:any)=><div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"><div><p className="text-sm font-bold">{r.mentorName}</p><p className="mt-1 text-xs text-slate-500">{r.mentorRole} · {r.topic}</p></div><span className={`badge ${r.status==='Accepted'?'bg-emerald-50 text-emerald-700':r.status==='Declined'?'bg-rose-50 text-rose-700':'bg-amber-50 text-amber-700'}`}>{r.status}</span></div>):<div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No requests yet. Choose a mentor above to start.</div>}</div></Card>
 </div>
}

export function GlobalSearch(){const [q,setQ]=useState('');const users=allUsers();const ops=getOpportunities();const results=useMemo(()=>{const x=q.toLowerCase();if(!x)return [];return [...users.filter((u:any)=>`${u.name} ${u.email} ${u.role}`.toLowerCase().includes(x)).map((u:any)=>({type:u.role,title:u.name,meta:u.email})),...ops.filter(o=>`${o.title} ${o.company} ${o.skills.join(' ')}`.toLowerCase().includes(x)).map(o=>({type:'opportunity',title:o.title,meta:`${o.company} · ${o.type}`}))];},[q]);return <div className="space-y-6"><Title title="Global Search" subtitle="Role-aware search across people, opportunities, skills, courses and industry activity."/><Card className="p-4"><div className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={18}/><input autoFocus className="input pl-10" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search students, faculty, jobs, internships, companies, skills…"/></div></Card><div className="space-y-3">{results.map((r,n)=><Card className="p-4" key={`${r.type}-${n}`}><div className="flex items-center gap-3"><span className="badge bg-violet-50 text-violet-700">{r.type}</span><div><b>{r.title}</b><p className="text-xs text-slate-500">{r.meta}</p></div></div></Card>)}{q&&results.length===0&&<Card className="p-8 text-center text-sm text-slate-500">No results. Try a skill, person, company or opportunity title.</Card>}</div></div>}

export function RecruiterTalent() {
  const [q, setQ] = useState("");
  const [min, setMin] = useState(0);
  const [selected, setSelected] = useState<any>(null);

  const students = allUsers()
    .filter((u: any) => u.role === "student")
    .map((u: any) => ({
      u,
      i: buildIntelligence(u),
    }))
    .filter(
      (x: any) =>
        x.i.readiness >= min &&
        (!q ||
          `${x.u.name} ${
            x.u.profile?.currentSkills?.join(" ") || ""
          } ${x.u.profile?.desiredJobRole || ""}`
            .toLowerCase()
            .includes(q.toLowerCase()))
    );

  return (
    <div className="space-y-6">
      <Title
        title="AI Talent Search"
        subtitle="Search candidates using skills, readiness and career goals. Matching remains explainable."
      />

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search skill, name or career goal"
          />

          <select
            className="input"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
          >
            <option value="0">Any readiness</option>
            <option value="60">60+ readiness</option>
            <option value="75">75+ readiness</option>
            <option value="85">85+ readiness</option>
          </select>
        </div>
      </Card>

      {/* Candidate Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {students.map((x: any) => (
          <Card className="p-5" key={x.u.id}>
            <div className="flex justify-between gap-3">
              <div>
                <h2 className="font-black">{x.u.name}</h2>

                <p className="text-xs text-slate-500">
                  {x.u.profile?.desiredJobRole ||
                    x.u.profile?.careerGoal ||
                    "Career goal not set"}
                </p>
              </div>

              <span className="badge bg-emerald-50 text-emerald-700">
                {x.i.readiness}% ready
              </span>
            </div>

            {/* Skills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(x.u.profile?.currentSkills || [])
                .slice(0, 6)
                .map((s: string) => (
                  <span className="skill-chip" key={s}>
                    {s}
                  </span>
                ))}
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Match explanation: readiness + current skills + career
              alignment.
            </p>

            {/* View Candidate Button */}
            <Button onClick={() => setSelected(x.u)}>
              View Candidate
            </Button>
          </Card>
        ))}
      </div>

      {/* Digital Passport Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {selected.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Digital Candidate Passport
                </p>
              </div>

              <button
                className="rounded-lg px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>

            {/* Basic Details */}
            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <h3 className="font-bold text-slate-900">
                Personal Details
              </h3>

              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p>
                  <strong>Name:</strong>{" "}
                  {selected.name || "Not available"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {selected.email || "Not available"}
                </p>

                <p>
                  <strong>Career Goal:</strong>{" "}
                  {selected.profile?.careerGoal ||
                    selected.profile?.desiredJobRole ||
                    "Not specified"}
                </p>

                <p>
                  <strong>Desired Job Role:</strong>{" "}
                  {selected.profile?.desiredJobRole ||
                    "Not specified"}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-5">
              <h3 className="font-bold text-slate-900">
                Current Skills
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {(selected.profile?.currentSkills || []).length > 0 ? (
                  selected.profile.currentSkills.map(
                    (skill: string) => (
                      <span className="skill-chip" key={skill}>
                        {skill}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No skills added.
                  </p>
                )}
              </div>
            </div>

            {/* Assessment Details */}
            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-slate-900">
                Assessment Details
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Overall Score:{" "}
                <strong>
                  {selected.assessment?.overall ?? "Not available"}
                </strong>
              </p>
            </div>

            {/* Projects */}
            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-slate-900">
                Projects and Portfolio
              </h3>

              {selected.portfolio?.projects?.length > 0 ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {selected.portfolio.projects.map(
                    (project: any, index: number) => (
                      <li key={index}>
                        {typeof project === "string"
                          ? project
                          : project.title ||
                            project.name ||
                            "Project"}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  No projects added.
                </p>
              )}
            </div>

            {/* Certifications */}
            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-slate-900">
                Certifications
              </h3>

              {selected.portfolio?.certifications?.length > 0 ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {selected.portfolio.certifications.map(
                    (certificate: any, index: number) => (
                      <li key={index}>
                        {typeof certificate === "string"
                          ? certificate
                          : certificate.title ||
                            certificate.name ||
                            "Certification"}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  No certifications added.
                </p>
              )}
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelected(null)}>
                Close Passport
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export function RecruiterPipeline(){const me:any=getMyData();const own=getOpportunities().filter(o=>o.company===me?.profile?.companyName);const apps=allUsers().flatMap((u:any)=>(u.applications||[]).filter((a:any)=>own.some(o=>o.id===a.opportunityId)).map((a:any)=>({...a,candidate:u.name,candidateId:u.id})));const stages=['Applied','AI Shortlisted','Interview','Selected','Rejected'];return <div className="space-y-6"><Title title="Recruitment Pipeline" subtitle="Move candidates through a transparent hiring workflow with status updates and interview actions."/><div className="grid gap-4 xl:grid-cols-5">{stages.map(stage=><Card className="p-4" key={stage}><div className="flex justify-between"><b className="text-sm">{stage}</b><span className="badge bg-slate-100 text-slate-600">{apps.filter((a:any)=>a.stage===stage).length}</span></div>{apps.filter((a:any)=>a.stage===stage).map((a:any)=><div className="mt-3 rounded-xl border p-3" key={a.id}><b className="text-xs">{a.candidate}</b><p className="mt-1 text-[11px] text-slate-500">{a.role}</p><select className="input mt-2 text-xs" value={a.stage} onChange={e=>{updateApplicationForCandidate(a.id,e.target.value as any);location.reload()}}>{stages.map(s=><option key={s}>{s}</option>)}</select></div>)}</Card>)}</div></div>}

export function FacultyStudentProgress(){const students=allUsers().filter((u:any)=>u.role==='student');return <div className="space-y-6"><Title title="Faculty Progress & Skill Gaps" subtitle="Faculty can monitor learning progress, readiness and evidence for  Self-verification."/><div className="grid gap-4">{students.map((u:any)=>{const i=buildIntelligence(u);return <Card className="p-5" key={u.id}><div className="flex flex-wrap justify-between gap-3"><div><b>{u.name}</b><p className="text-xs text-slate-500">{u.profile?.branch||'CSE'} · {u.profile?.department||'Computer Science'}</p></div><span className="badge bg-violet-50 text-violet-700">{i.readiness}% readiness</span></div><div className="mt-4 grid gap-2 md:grid-cols-3"><div className="rounded-xl bg-slate-50 p-3 text-xs">Skills: {(u.profile?.currentSkills||[]).slice(0,5).join(', ')||'None'}</div><div className="rounded-xl bg-slate-50 p-3 text-xs">Courses: {(u.learning||[]).length}</div><div className="rounded-xl bg-slate-50 p-3 text-xs">Gaps: {i.gaps.slice(0,2).map(g=>g.name).join(', ')||'None'}</div></div></Card>})}</div></div>}

export function FacultyVerification(){const students=allUsers().filter((u:any)=>u.role==='student');const [done,setDone]=useState<string[]>([]);return <div className="space-y-6"><Title title="Faculty Verification" subtitle="Review evidence and record faculty verification signals."/><div className="grid gap-4">{students.flatMap((u:any)=>(u.profile?.currentSkills||[]).slice(0,4).map((s:string)=><Card className="p-5" key={`${u.id}-${s}`}><div className="flex justify-between gap-4"><div><b>{s}</b><p className="text-xs text-slate-500">{u.name} · assessment and learning evidence available</p></div><Button secondary={done.includes(`${u.id}-${s}`)} onClick={()=>setDone(v=>v.includes(`${u.id}-${s}`)?v:v.concat(`${u.id}-${s}`))}>{done.includes(`${u.id}-${s}`)?'Verified ✓':'Verify Skill'}</Button></div></Card>))}</div></div>}

export function InstitutionCareerIntelligence(){const students=allUsers().filter((u:any)=>u.role==='student');const rows=students.map((u:any)=>({u,i:buildIntelligence(u)}));const avg=rows.length?Math.round(rows.reduce((a,x)=>a+x.i.readiness,0)/rows.length):0;const critical=rows.filter(x=>x.i.readiness<50).length;return <div className="space-y-6"><Title title="Institution Career Intelligence" subtitle="A leadership view of readiness, skills, early intervention and industry alignment."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Students',rows.length],['Avg readiness',`${avg}%`],['Critical intervention',critical],['Industry opportunities',getOpportunities().length]].map(x=><Card className="p-5" key={x[0] as string}><p className="text-xs text-slate-500">{x[0]}</p><p className="mt-2 text-3xl font-black">{x[1]}</p></Card>)}</div><Card className="p-6"><h2 className="font-black">Early Intervention</h2><div className="mt-4 grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-red-50 p-5"><b>CRITICAL</b><p className="mt-1 text-3xl font-black">{critical}</p><p className="text-xs">Low readiness / major gaps</p></div><div className="rounded-2xl bg-amber-50 p-5"><b>HIGH</b><p className="mt-1 text-3xl font-black">{rows.filter(x=>x.i.readiness>=50&&x.i.readiness<70).length}</p><p className="text-xs">Needs targeted mentoring</p></div><div className="rounded-2xl bg-emerald-50 p-5"><b>ON TRACK</b><p className="mt-1 text-3xl font-black">{rows.filter(x=>x.i.readiness>=70).length}</p><p className="text-xs">Ready / progressing</p></div></div></Card></div>}

export function BranchAnalytics(){const students=allUsers().filter((u:any)=>u.role==='student');const branches=['CSE','ECE','EEE','MECH','CIVIL','IT'];const data=branches.map(b=>{const s=students.filter((u:any)=>(u.profile?.branch||'CSE')===b);const avg=s.length?Math.round(s.reduce((a,u)=>a+buildIntelligence(u).readiness,0)/s.length):0;return {b,count:s.length,avg};});return <div className="space-y-6"><Title title="Branch Analytics" subtitle="Compare readiness, participation and placement signals across branches."/><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.map(x=><Card className="p-5" key={x.b}><div className="flex justify-between"><h2 className="text-xl font-black">{x.b}</h2><span className="badge bg-cyan-50 text-cyan-700">{x.count} students</span></div><p className="mt-4 text-3xl font-black">{x.avg}%</p><p className="text-xs text-slate-500">Average career readiness</p><div className="mt-4 h-2 rounded bg-slate-100"><div className="h-full rounded bg-gradient-to-r from-indigo-600 to-cyan-500" style={{width:`${x.avg}%`}}/></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><span className="rounded-lg bg-slate-50 p-2">Skill gaps</span><span className="rounded-lg bg-slate-50 p-2">Placement progress</span><span className="rounded-lg bg-slate-50 p-2">Internships</span><span className="rounded-lg bg-slate-50 p-2">Industry alignment</span></div></Card>)}</div></div>}

export function FacultyDirectory(){const faculty=allUsers().filter((u:any)=>u.role==='faculty');return <Directory title="Faculty Directory" subtitle="Faculty expertise, research, industry connections and mentorship capacity." rows={faculty.map((u:any)=>({id:u.id,name:u.name,meta:`${u.profile?.department||'Computer Science'} · ${u.profile?.branch||'CSE'}`,details:[u.profile?.subjects||'Java, DBMS, AI/ML',u.profile?.researchAreas||'Applied computing',u.profile?.experience||'Faculty mentor']}))}/>}
export function StudentDirectory(){const [q,setQ]=useState('');const [branch,setBranch]=useState('All');const rows=allUsers().filter((u:any)=>u.role==='student').filter((u:any)=>(branch==='All'||(u.profile?.branch||'CSE')===branch)).filter((u:any)=>!q||`${u.name} ${u.profile?.studentId||''}`.toLowerCase().includes(q.toLowerCase()));return <Directory title="Student Directory" subtitle="Search by student name or ID and filter by branch for readiness and placement monitoring." search={q} setSearch={setQ} filter={branch} setFilter={setBranch} rows={rows.map((u:any)=>{const i=buildIntelligence(u);return {id:u.id,name:u.name,meta:`${u.profile?.studentId||'Student ID'} · ${u.profile?.branch||'CSE'} · ${u.profile?.year||'Final Year'}`,details:[`Readiness ${i.readiness}%`,`Skills ${(u.profile?.currentSkills||[]).slice(0,4).join(', ')||'—'}`,`Placement ${(u.applications||[]).some((a:any)=>a.stage==='Selected')?'Placed':'In progress'}`]}})} filters={['All','CSE','ECE','EEE','MECH','CIVIL','IT']}/>}
function Directory({title,subtitle,rows,search,setSearch,filter,setFilter,filters}:{title:string;subtitle:string;rows:any[];search?:string;setSearch?:(x:string)=>void;filter?:string;setFilter?:(x:string)=>void;filters?:string[]}){return <div className="space-y-6"><Title title={title} subtitle={subtitle}/>{setSearch&&<Card className="p-4"><div className="grid gap-3 md:grid-cols-2"><input className="input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or ID"/><select className="input" value={filter} onChange={e=>setFilter?.(e.target.value)}>{filters?.map(x=><option key={x}>{x}</option>)}</select></div></Card>}<div className="grid gap-4 md:grid-cols-2">{rows.map(r=><Card className="p-5" key={r.id}><div className="flex gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-700"><Users size={18}/></div><div><h2 className="font-black">{r.name}</h2><p className="text-xs text-slate-500">{r.meta}</p></div></div><div className="mt-4 space-y-2">{r.details.map((d:string)=><p className="rounded-xl bg-slate-50 p-3 text-xs" key={d}>{d}</p>)}</div></Card>)}</div>{!rows.length&&<Card className="p-8 text-center text-sm text-slate-500">No matching records.</Card>}</div>}

export function InstitutionAnalytics(){return <div className="space-y-6"><Title title="Institution Analytics" subtitle="Department, skill gap, readiness and recruitment signals."/><InstitutionCareerIntelligence/><BranchAnalytics/></div>}

export function InstitutionEarlyIntervention(){const students=allUsers().filter((u:any)=>u.role==='student');const rows=students.map((u:any)=>({u,i:buildIntelligence(u)})).sort((a,b)=>a.i.readiness-b.i.readiness);return <div className="space-y-6"><Title title="Early Intervention" subtitle="Identify students who need action before placement season."/><div className="grid gap-3">{rows.map(x=><Card className="p-4" key={x.u.id}><div className="flex flex-wrap items-center justify-between gap-3"><div><b>{x.u.name}</b><p className="text-xs text-slate-500">{x.i.gaps.slice(0,2).map(g=>g.name).join(', ')||'No major gaps'}</p></div><span className={`badge ${x.i.readiness<50?'bg-red-50 text-red-700':x.i.readiness<70?'bg-amber-50 text-amber-700':'bg-emerald-50 text-emerald-700'}`}>{x.i.readiness}%</span></div></Card>)}</div></div>}

export function IndustryConnections(){const ops=getOpportunities();const companies=Array.from(new Set(ops.map(o=>o.company)));return <div className="space-y-6"><Title title="Industry Connections" subtitle="Partner companies, projects, internships, training and recruitment relationships."/><div className="grid gap-4 md:grid-cols-2">{companies.map(c=><Card className="p-5" key={c}><div className="flex justify-between"><div><h2 className="font-black">{c}</h2><p className="text-xs text-slate-500">{ops.filter(o=>o.company===c).length} active opportunities</p></div><Handshake className="text-cyan-600"/></div><div className="mt-4 flex flex-wrap gap-2"><span className="badge bg-violet-50 text-violet-700">Recruitment</span><span className="badge bg-cyan-50 text-cyan-700">Projects</span><span className="badge bg-emerald-50 text-emerald-700">Internships</span></div></Card>)}</div></div>}

export function ReportsHub(){const u:any=getMyData();const exportReport=(name:string)=>{const rows=[['EduLyra Report',name],['Generated',new Date().toLocaleString()],['Users',allUsers().length],['Opportunities',getOpportunities().length]];const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows.map(r=>r.join(',')).join('\n')],{type:'text/csv'}));a.download=`EduLyra-${name.replace(/\s+/g,'-')}.csv`;a.click();};return <div className="space-y-6"><Title title="Reports & Analytics" subtitle="Export decision-ready institution and recruitment intelligence."/><div className="grid gap-4 md:grid-cols-2">{['Student Skill Report','Faculty Collaboration Report','Internship Participation','Placement Outcomes','Industry Demand Trends','Overall Institution Performance'].map(x=><Card className="flex items-center justify-between p-5" key={x}><div><BarChart3 className="text-violet-600"/><h2 className="mt-2 font-black">{x}</h2><p className="text-xs text-slate-500">Current data from the shared EduLyra state.</p></div><Button onClick={()=>exportReport(x)}><Download size={15}/> Export</Button></Card>)}</div></div>}

export function PassportVerification({id}:{id:string}){
 const users=allUsers() as any[];
 const certOwner=users.find((x:any)=>(x.certificates||[]).some((c:any)=>c.id===id));
 const certificate=certOwner?.certificates?.find((c:any)=>c.id===id);
 const u=certOwner||users.find((x:any)=>x.id===id)||users.find((x:any)=>x.role==='student');
 const i=u?buildIntelligence(u):null;
 const payload=encodeURIComponent(`${window.location.origin}/verify/passport/${id||u?.id||'demo'}`);
 if(certificate)return <div className="mx-auto max-w-2xl space-y-6"><Title title="Certificate Verification" subtitle="Public verification record for an EduLyra-issued certificate."/><Card className="p-7"><div className="flex flex-wrap items-center justify-between gap-6"><div><span className="badge bg-emerald-50 text-emerald-700">✓ {certificate.verified?'Verified':'Pending'}</span><h2 className="mt-3 text-2xl font-black">{certificate.name}</h2><p className="mt-1 text-sm text-slate-500">Issued to {certOwner?.name||'EduLyra learner'}</p><p className="mt-4 text-sm">Certificate ID: <b>{certificate.id}</b></p><p className="mt-1 text-sm">Issuer: <b>{certificate.issuer}</b> · Issued: <b>{certificate.issuedOn}</b></p></div><img className="h-40 w-40 rounded-xl border p-2" alt="Certificate verification QR" src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${payload}`}/></div><div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">This certificate is automatically linked to the learner's EduLyra portfolio and can be checked using its unique certificate ID.</div></Card></div>;
 return <div className="mx-auto max-w-2xl space-y-6"><Title title="EduLyra Passport Verification" subtitle="Public verification view for a student's evidence-backed skill profile."/><Card className="p-7"><div className="flex flex-wrap items-center justify-between gap-6"><div><span className="badge bg-emerald-50 text-emerald-700">Verified identity layer</span><h2 className="mt-3 text-2xl font-black">{u?.name||'EduLyra Student'}</h2><p className="mt-1 text-sm text-slate-500">{u?.profile?.desiredJobRole||u?.profile?.careerGoal||'Engineering professional'}</p><p className="mt-4 text-sm">Career readiness: <b>{i?.readiness||0}/100</b></p></div><img className="h-40 w-40 rounded-xl border p-2" alt="EduLyra passport QR" src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${payload}`}/></div><div className="mt-7 grid gap-3">{i?.skills.slice(0,8).map((s:any)=><div className="flex items-center justify-between rounded-xl bg-slate-50 p-4" key={s.name}><div><b>{s.name}</b><p className="text-xs text-slate-500">Evidence-backed profile signal</p></div><span className="badge bg-violet-50 text-violet-700">{s.level}%</span></div>)}</div></Card></div>;
}
