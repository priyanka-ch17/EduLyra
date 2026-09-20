import { useEffect, useMemo, useState } from 'react';
import { BarChart3, BriefcaseBusiness, CheckCircle2, Plus, Search, Users, CalendarDays, MessageSquare, Trash2, Pencil, Send, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyData, getOpportunities, addOpportunity, allUsers, aiShortlistApplication, inviteForInterview, updateApplicationForCandidate, updateProfile, getInterviews, updateInterview, removeInterview, recruitmentAnalytics, getMessagesForUser, sendMessage, deleteApplication, applyToOpportunity, issueCertificateToRecipient } from '../services/store';
import { OpportunityCard } from '../components/OpportunityCard';
import { ProgressBar } from '../components/ProgressBar';
function Button({children,onClick,secondary=false,disabled=false}:{children:React.ReactNode;onClick?:()=>void;secondary?:boolean;disabled?:boolean}){return <button disabled={disabled} onClick={onClick} className={`${secondary?'btn-secondary':'btn-primary'} disabled:opacity-50`}>{children}</button>}
function Title({title,subtitle}:{title:string;subtitle:string}){return <div><h1 className="text-2xl font-black">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>}
function Stat({label,value}:{label:string;value:string|number}){return <div className="card p-5"><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>}
function listValue(value:any): string[]{if(Array.isArray(value)) return value.map(String); if(value==null||value==='') return []; return String(value).split(',').map(x=>x.trim()).filter(Boolean);}
function opportunityText(o:any){return `${o?.title||''} ${o?.company||''} ${o?.description||''} ${listValue(o?.skills).join(' ')}`.toLowerCase();}
function facultyRelevant(u:any,o:any){const profile=String(`${u?.profile?.department||''} ${u?.profile?.expertise||''} ${u?.profile?.careerGoal||''} ${listValue(u?.profile?.preferredIndustrySectors).join(' ')}`).toLowerCase();const hits=listValue(o?.skills).filter((x:string)=>profile.includes(x.toLowerCase())).length;return Math.min(99,50+hits*12);}
export function FacultyDashboard(){const u:any=getMyData();const ops=getOpportunities().filter(o=>['Faculty','Training','Project','Workshop','Internship'].includes(o.type)).map(o=>({...o,match:facultyRelevant(u,o)})).sort((a,b)=>b.match-a.match);return <div className="space-y-6"><Title title={`Welcome, ${u?.name}`} subtitle="Academician workspace for projects, internships, workshops, opportunities, research and consultancy."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Profile Strength" value="91%"/><Stat label="Relevant Opportunities" value={ops.length}/><Stat label="Applications" value={(u?.applications||[]).length}/><Stat label="Consultancy Matches" value={getOpportunities().filter(o=>o.type==='Project').length}/></div><div className="grid gap-5 lg:grid-cols-2"><Card title="Professional profile" items={[`Department: ${u?.profile?.department||'Not set'}`,`Expertise: ${u?.profile?.expertise||'Not set'}`,`Career goal: ${u?.profile?.careerGoal||'Not set'}`,`Sectors: ${listValue(u?.profile?.preferredIndustrySectors).join(', ')||'Not set'}`]}/><Card title="Recommended pathways" items={['Industry Projects','Faculty Internships','Workshops','Research Projects','Consultancy Opportunities']}/></div><FacultyOpportunities/></div>}
export function FacultyOpportunities(){const u:any=getMyData();const [q,setQ]=useState('');const ops=getOpportunities().filter(o=>['Faculty','Training','Project','Workshop','Internship'].includes(o.type)).map(o=>({...o,match:facultyRelevant(u,o)})).filter(o=>opportunityText(o).includes(q.toLowerCase())).sort((a,b)=>b.match-a.match);return <div className="space-y-4"><Title title="Faculty Opportunities" subtitle="Search relevant opportunities using expertise, department, goals and industry requirements."/><div className="card p-4 relative"><Search size={17} className="absolute left-7 top-7 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search opportunities, projects, internships, consultancy…"/></div><div className="grid gap-4 lg:grid-cols-2">{ops.map(o=><OpportunityCard key={o.id} opportunity={o}/>)}</div>{!ops.length&&<Empty text="No matching opportunities found."/>}</div>}
export function Collaborations(){return <div className="space-y-5"><Title title="Collaboration Hub" subtitle="Useful collaboration pathways for faculty and industry partners."/><div className="grid gap-4 md:grid-cols-2">{['Industry Mentorship Program','Live Project: Customer Analytics','Guest Lecture','Innovation Challenge','Applied Research Collaboration','Hackathon Partnership'].map(x=><div className="card p-5" key={x}><CheckCircle2 className="text-emerald-500"/><h2 className="mt-3 font-bold">{x}</h2><p className="mt-1 text-sm text-slate-500">Explore this collaboration pathway through the opportunities marketplace.</p><Link className="mt-4 inline-flex text-sm font-bold text-cyan-700" to="/faculty/opportunities">View opportunities →</Link></div>)}</div></div>}
export function GenericFacultyPage({title}:{title:string}){
 const u:any=getMyData(); const [q,setQ]=useState(''); const [editing,setEditing]=useState<any>(null);
 const map: any = {
  Research: ['Research'],

  'FDPs & Workshops': [
    'FDP',
    'Workshop',
    'Training',
  ],

  Mentorship: ['Mentorship'],

  Opportunities: ['Faculty'],

  Consultancy: ['Consultancy'],

  Projects: ['Project'],

  'Faculty Internships': ['Internship'],
};
 const allowed = map[title] || [];
 const ops=getOpportunities().filter(o=>allowed.includes(o.type)).map(o=>({...o,match:facultyRelevant(u,o)})).filter(o=>opportunityText(o).includes(q.toLowerCase())).sort((a,b)=>b.match-a.match);
 const projects=[
  {id:'fp1',title:'Applied Generative AI Research Project',company:'OpenResearch Collective',description:'Collaborative project exploring practical generative-AI applications for education, including evaluation, responsible use and prototype development.',skills:['Python','Machine Learning'],location:'Remote',workMode:'Remote',compensation:'Research collaboration',type:'Project',deadline:'2026-10-12'},
  {id:'fp2',title:'Student Learning Analytics Project',company:'InsightWorks',description:'Industry-academic project to design learning analytics dashboards and identify student skill-development trends for curriculum improvement.',skills:['Python','SQL','Power BI'],location:'Hybrid',workMode:'Hybrid',compensation:'Academic collaboration',type:'Project',deadline:'2026-10-20'}
 ];
 const consultancy=[
  {id:'fc1',title:'AI Curriculum & Industry Readiness Consultancy',company:'NovaTech Labs',description:'Consultancy engagement for faculty experts to review AI curriculum, industry skill requirements and practical project outcomes.',skills:['Machine Learning','Communication'],location:'Remote',workMode:'Remote',compensation:'Consultancy engagement',type:'Project',deadline:'2026-10-30'},
  {id:'fc2',title:'Data Analytics Faculty Consultancy',company:'InsightWorks',description:'Faculty consultancy opportunity covering analytics curriculum alignment, dashboard design and industry-oriented training plans.',skills:['Python','SQL','Power BI'],location:'Hybrid',workMode:'Hybrid',compensation:'Consultancy engagement',type:'Project',deadline:'2026-11-05'}
 ];
 const visible=title==='Projects' ? [...projects,...ops].filter(o=>opportunityText(o).includes(q.toLowerCase())) : title==='Consultancy' ? [...consultancy,...ops].filter(o=>opportunityText(o).includes(q.toLowerCase())) : ops;
 const plans=Array.isArray(u?.profile?.internshipPlans)?u.profile.internshipPlans:[];
 const savePlan=(plan:any)=>{const next=editing?.id?plans.map((x:any)=>x.id===editing.id?{...x,...plan}:x):[...plans,{id:'fp_'+Date.now(),...plan}];updateProfile({internshipPlans:next});setEditing(null);};
 return <div className="space-y-5"><Title title={title} subtitle={`Relevant ${title.toLowerCase()} based on your expertise, department, sectors and professional goals.`}/>
 {title==='Faculty Internships'&&<div className="card p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="font-bold">Manage internship subjects/details</h2><p className="text-sm text-slate-500">Create or update internship topics you supervise.</p></div><button className="btn-primary" onClick={()=>setEditing({subject:'',details:''})}><Plus size={15}/> Add internship subject</button></div>{plans.map((p:any)=><div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4" key={p.id}><div><b>{p.subject}</b><p className="text-sm text-slate-500">{p.details}</p></div><div className="flex gap-2"><button className="btn-secondary" onClick={()=>setEditing(p)}><Pencil size={14}/> Edit</button><button className="btn-secondary" onClick={()=>updateProfile({internshipPlans:plans.filter((x:any)=>x.id!==p.id)})}><Trash2 size={14}/> Remove</button></div></div>)}{editing&&<PlanForm initial={editing} onCancel={()=>setEditing(null)} onSave={savePlan}/>}</div>}
 <div className="card p-4 relative"><Search size={17} className="absolute left-7 top-7 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`}/></div>
 <div className="grid gap-4 lg:grid-cols-2">{visible.map((o:any)=>o.id.startsWith('fp')||o.id.startsWith('fc')?<FacultyInfoCard key={o.id} item={o}/>:<OpportunityCard key={o.id} opportunity={{...o,match:o.match||facultyRelevant(u,o)}}/>)}</div>{!visible.length&&<Empty text="No matching items are available yet."/>}</div>
}

function FacultyInfoCard({item}:{item:any}){const [open,setOpen]=useState(false);return <div className="card p-5"><span className="badge bg-cyan-50 text-cyan-700">{item.id.startsWith('fc')?'Consultancy':'Project'}</span><h3 className="mt-3 font-bold">{item.title}</h3><p className="mt-1 text-sm text-slate-500">{item.company}</p><p className="mt-4 text-sm leading-6 text-slate-600">{item.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{listValue(item.skills).map((s:string)=><span className="badge bg-slate-100 text-slate-600" key={s}>{s}</span>)}</div><button className="btn-secondary mt-5" onClick={()=>setOpen(!open)}>{open?'Hide details':'View Details'}</button>{open&&<div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm"><p><b>Location:</b> {item.location}</p><p className="mt-1"><b>Work mode:</b> {item.workMode}</p><p className="mt-1"><b>Engagement:</b> {item.compensation}</p><p className="mt-1"><b>Deadline:</b> {item.deadline}</p></div>}</div>}

function PlanForm({initial,onCancel,onSave}:{initial:any;onCancel:()=>void;onSave:(x:any)=>void}){const [subject,setSubject]=useState(initial.subject||'');const [details,setDetails]=useState(initial.details||'');return <div className="mt-4 rounded-xl border p-4 grid gap-3"><input className="input" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Internship subject"/><textarea className="input min-h-24" value={details} onChange={e=>setDetails(e.target.value)} placeholder="Details, outcomes, skills and duration"/><div className="flex gap-2"><button className="btn-primary" onClick={()=>onSave({subject,details})} disabled={!subject.trim()}>Save</button><button className="btn-secondary" onClick={onCancel}>Cancel</button></div></div>}

export function FacultyApplications(){
 const u:any=getMyData(); const [q,setQ]=useState('');
 const apps=(u?.applications||[]).filter((a:any)=>`${a.role} ${a.company} ${a.stage} ${a.nextAction}`.toLowerCase().includes(q.toLowerCase()));
 return <div className="space-y-6"><Title title="Faculty Applications" subtitle="View and manage applications submitted for faculty opportunities, projects and internships."/><div className="card p-4 relative"><Search size={17} className="absolute left-7 top-7 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search applications, companies or status…"/></div>{apps.map((a:any)=><div className="card p-5 flex flex-wrap items-center justify-between gap-3" key={a.id}><div><b>{a.role}</b><p className="text-sm text-slate-500">{a.company} · {a.appliedDate}</p><p className="mt-2 text-xs text-slate-500">{a.nextAction}</p></div><div className="flex items-center gap-2"><span className="badge bg-cyan-50 text-cyan-700">{a.stage}</span><button className="btn-secondary" onClick={()=>deleteApplication(a.id)}><Trash2 size={14}/> Remove</button></div></div>)}{!apps.length&&<Empty text="No matching faculty applications found."/>}</div>
}

export function FacultyProfile(){
 const u:any=getMyData();
 const [saved,setSaved]=useState(false);
 const [name,setName]=useState(u?.name||'');
 const [department,setDepartment]=useState(u?.profile?.department||'');
 const [designation,setDesignation]=useState(u?.profile?.designation||'');
 const [expertise,setExpertise]=useState(u?.profile?.expertise||'');
 const [goal,setGoal]=useState(u?.profile?.careerGoal||'');
 const [sectors,setSectors]=useState(listValue(u?.profile?.preferredIndustrySectors).join(', '));
 const certificates=u?.certificates||[];
 return <div className="mx-auto max-w-3xl space-y-6">
  <Title title="Professional Faculty Profile" subtitle="Keep your academic and industry-collaboration information accurate for opportunity matching."/>
  <div className="card grid gap-4 p-6 sm:grid-cols-2">
   <div><label className="label">Full name</label><input className="input" value={name} onChange={e=>setName(e.target.value)}/></div>
   <div><label className="label">Department</label><input className="input" value={department} onChange={e=>setDepartment(e.target.value)}/></div>
   <div><label className="label">Designation</label><input className="input" value={designation} onChange={e=>setDesignation(e.target.value)}/></div>
   <div><label className="label">Areas of Expertise</label><input className="input" value={expertise} onChange={e=>setExpertise(e.target.value)}/></div>
   <div><label className="label">Career / Professional Goals</label><input className="input" value={goal} onChange={e=>setGoal(e.target.value)}/></div>
   <div><label className="label">Preferred Industry Sectors</label><input className="input" value={sectors} onChange={e=>setSectors(e.target.value)}/></div>
   <div className="sm:col-span-2"><button className="btn-primary" onClick={()=>{updateProfile({displayName:name,department,designation,expertise,careerGoal:goal,preferredIndustrySectors:sectors.split(',').map(x=>x.trim()).filter(Boolean)});setSaved(true)}}>Save profile</button>{saved&&<span className="ml-3 text-sm text-emerald-700">Saved.</span>}</div>
  </div>
  <div className="card p-6">
   <div className="flex items-center gap-2"><CheckCircle2 className="text-violet-600"/><h2 className="font-black">Industry Certifications</h2></div>
   <p className="mt-1 text-sm text-slate-500">Verified certifications issued to you by Industry partners.</p>
   <div className="mt-4 space-y-3">
    {certificates.map((c:any)=><div className="rounded-xl border border-violet-100 bg-violet-50 p-4" key={c.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><b>{c.name}</b><p className="mt-1 text-sm text-slate-600">Issued by {c.issuer} · {c.issuedOn}</p></div><span className="badge bg-emerald-50 text-emerald-700">Verified</span></div>{c.verificationUrl&&<Link className="mt-3 inline-flex text-sm font-bold text-cyan-700" to={c.verificationUrl}>Verify certificate</Link>}</div>)}
    {!certificates.length&&<p className="text-sm text-slate-500">No industry certifications have been issued to you yet.</p>}
   </div>
  </div>
 </div>;
}
export function IndustryDashboard(){const a=recruitmentAnalytics();return <div className="space-y-6"><Title title={`Welcome, ${getMyData()?.name}`} subtitle="Recruitment workspace with transparent candidate matching and live recruitment analytics."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Stat label="Vacancies" value={a.opportunities}/><Stat label="Applicants" value={a.applicants}/><Stat label="Shortlisted" value={a.shortlisted}/><Stat label="Interviews" value={a.interview}/><Stat label="Hired" value={a.hired}/></div><div className="flex flex-wrap gap-3"><Link className="btn-primary" to="/industry/opportunities/new"><Plus size={16}/> Post Opportunity</Link><Link className="btn-secondary" to="/industry/candidates"><Search size={16}/> Find Candidates</Link><Link className="btn-secondary" to="/industry/applications">Manage Applications</Link></div><div className="card p-6"><h2 className="font-bold">Hiring progress</h2><div className="mt-5"><ProgressBar label="Applicants → Shortlisted" value={a.applicants?Math.round(a.shortlisted/a.applicants*100):0}/><div className="mt-4"><ProgressBar label="Shortlisted → Hired" value={a.shortlisted?Math.round(a.hired/a.shortlisted*100):0}/></div></div></div></div>}
export function PostOpportunity(){const [saved,setSaved]=useState(false);const [f,setF]=useState<any>({title:'',type:'Job',workMode:'Hybrid',description:'',skills:'',location:'',compensation:'',duration:'',eligibility:'',deadline:''});const set=(k:string,v:string)=>setF((x:any)=>({...x,[k]:v}));const submit=()=>{if(!f.title.trim()||!f.description.trim()||!f.skills.trim())return;addOpportunity({...f,skills:f.skills.split(',').map((x:string)=>x.trim()).filter(Boolean)});setSaved(true);setF({...f,title:'',description:'',skills:''});};return <div className="mx-auto max-w-3xl space-y-6"><Title title="Post Opportunity" subtitle="Publish jobs, internships and other relevant opportunities. Published opportunities immediately enter the student marketplace."/><div className="card grid gap-4 p-6 sm:grid-cols-2">{[['title','Title'],['location','Location'],['compensation','Salary / stipend'],['duration','Duration'],['eligibility','Eligibility'],['deadline','Application deadline']].map(x=><div key={x[0]}><label className="label">{x[1]}</label><input className="input" value={f[x[0]]} onChange={e=>set(x[0],e.target.value)}/></div>)}<div><label className="label">Type</label><select className="input" value={f.type} onChange={e=>set('type',e.target.value)}>{['Job','Internship','Project','Apprenticeship','Training','Certification','Workshop'].map(x=><option key={x}>{x}</option>)}</select></div><div><label className="label">Work mode</label><select className="input" value={f.workMode} onChange={e=>set('workMode',e.target.value)}><option>Remote</option><option>Hybrid</option><option>On-site</option></select></div><div className="sm:col-span-2"><label className="label">Required skills (comma separated)</label><input className="input" value={f.skills} onChange={e=>set('skills',e.target.value)}/></div><div className="sm:col-span-2"><label className="label">Description / responsibilities / outcomes</label><textarea className="input min-h-32" value={f.description} onChange={e=>set('description',e.target.value)}/></div><button className="btn-primary sm:col-span-2" onClick={submit} disabled={!f.title.trim()||!f.description.trim()||!f.skills.trim()}><Plus size={16}/> Publish opportunity</button>{saved&&<div className="sm:col-span-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">Published successfully. Students can now view details and apply.</div>}</div></div>}
export function IndustryOpportunities(){
  const me:any=getMyData();
  const [refresh,setRefresh]=useState(0);
  useEffect(()=>{const f=()=>setRefresh(x=>x+1);window.addEventListener('edulyra:data',f);return()=>window.removeEventListener('edulyra:data',f)},[]);
  const posts=getOpportunities().filter(o=>o.company===me?.profile?.companyName);
  return <div className="space-y-6">
    <PostOpportunity/>
    <div className="space-y-3">
      <h2 className="text-lg font-black">My Published Opportunities</h2>
      {posts.map(o=><OpportunityCard key={o.id} opportunity={o}/>)}
      {!posts.length&&<Empty text="No opportunities published yet."/>}
    </div>
  </div>;
}
export function Candidates(){const me:any=getMyData();const ownIds=new Set(getOpportunities().filter(o=>o.company===me?.profile?.companyName).map(o=>o.id));const users=allUsers().filter((u:any)=>u.role==='student');const applicants=users.filter((u:any)=>(u.applications||[]).some((a:any)=>ownIds.has(a.opportunityId)));const [q,setQ]=useState('');const [selected,setSelected]=useState<any>(null);const matches=applicants.filter((u:any)=>`${u.name} ${u.email} ${u.profile?.currentSkills||''} ${u.profile?.careerGoal||''} ${u.profile?.desiredJobRole||''}`.toLowerCase().includes(q.toLowerCase()));return <div className="space-y-6"><Title title="AI-Assisted Candidate Shortlisting" subtitle="Ranking is explainable and advisory: skills, assessment results, career alignment and profile evidence are shown for recruiter review."/><div className="card p-4 relative"><Search size={17} className="absolute left-7 top-7 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search applicants, skills or career goals…"/></div><div className="space-y-3">{matches.map((u:any)=>{const apps=(u.applications||[]).filter((a:any)=>ownIds.has(a.opportunityId));const best=apps.sort((a:any,b:any)=>(score(u,b)-score(u,a)))[0];const o=getOpportunities().find(x=>x.id===best?.opportunityId);const sc=score(u,best);return <div className="card flex flex-wrap items-center justify-between gap-4 p-5" key={u.id}><div><b>{u.name}</b><p className="text-sm text-slate-500">{u.email} · {u.profile?.careerGoal||u.profile?.desiredJobRole||'Career goal not set'}</p><div className="mt-2 flex flex-wrap gap-1">{(u.profile?.currentSkills||[]).slice(0,7).map((s:string)=><span className="badge bg-slate-100 text-slate-600" key={s}>{s}</span>)}</div><p className="mt-2 text-xs text-slate-400">Applied for: {o?.title||'Opportunity'}</p></div><div className="flex items-center gap-2"><span className="badge bg-emerald-50 text-emerald-700">{sc}% compatibility</span><button className="btn-secondary" onClick={()=>setSelected({u,best,sc})}>Review</button><button className="btn-primary" disabled={sc<70} title={sc<70?"AI threshold not met; review the candidate manually":"AI-assisted shortlist"} onClick={()=>aiShortlistApplication(best.id,sc)}>AI Shortlist</button></div></div>})}</div>{selected&&<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-5" onClick={()=>setSelected(null)}><div className="w-full max-w-2xl rounded-2xl bg-white p-6" onClick={e=>e.stopPropagation()}><div className="flex justify-between"><div><h2 className="text-xl font-black">{selected.u.name}</h2><p className="text-sm text-slate-500">AI-assisted review · {selected.sc}%</p></div><button onClick={()=>setSelected(null)}><XCircle/></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><b>Skills</b><p className="mt-2 text-sm">{(selected.u.profile?.currentSkills||[]).join(', ')||'None listed'}</p></div><div className="rounded-xl bg-slate-50 p-4"><b>Assessment</b><p className="mt-2 text-sm">{selected.u.assessment?.overall||0}% overall</p></div><div className="rounded-xl bg-slate-50 p-4"><b>Career alignment</b><p className="mt-2 text-sm">{selected.u.profile?.careerGoal||selected.u.profile?.desiredJobRole||'Not set'}</p></div><div className="rounded-xl bg-slate-50 p-4"><b>Resume evidence</b><p className="mt-2 text-sm">{(selected.u.portfolio?.projects||[]).length} projects · {(selected.u.portfolio?.certifications||[]).length} certifications</p></div></div><p className="mt-5 text-xs text-slate-500">This score supports recruiter review; it does not make a perfect or automatic hiring decision.</p></div></div>}</div>}
function score(u:any,a:any){if(!a)return 0;const o=getOpportunities().find(x=>x.id===a.opportunityId);const req=o?.skills||[];const skills=u.profile?.currentSkills||[];const hits=req.filter((r:string)=>skills.some((s:string)=>s.toLowerCase()===r.toLowerCase())).length;const skill=Math.round((hits/Math.max(1,req.length))*60);const assessment=Math.round((u.assessment?.overall||0)*0.2);const career=String(u.profile?.careerGoal||u.profile?.desiredJobRole||'').toLowerCase();const align=o&&career&&(`${o.title} ${o.description}`).toLowerCase().split(/\s+/).some((w:string)=>w.length>3&&career.includes(w));return Math.min(99,skill+assessment+(align?20:5));}
export function IndustryApplications(){const [refresh,setRefresh]=useState(0);useEffect(()=>{const f=()=>setRefresh(x=>x+1);window.addEventListener('edulyra:data',f);return()=>window.removeEventListener('edulyra:data',f)},[]);const a=recruitmentAnalytics();return <div className="space-y-6"><Title title="Recruitment Pipeline" subtitle="Applicants → AI-assisted shortlist → interview → selected/hired. Recruiter actions update the student's application status."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Stat label="Applicants" value={a.applicants}/><Stat label="Shortlisted" value={a.shortlisted}/><Stat label="Interviews" value={a.interview}/><Stat label="Hired" value={a.hired}/><Stat label="Rejected" value={a.rejected}/></div><div className="overflow-x-auto rounded-2xl border bg-white"><table className="min-w-[1100px] w-full text-sm"><thead className="bg-slate-50 text-left"><tr>{['Candidate','Role','AI evidence score','Status','Actions'].map(x=><th className="p-4" key={x}>{x}</th>)}</tr></thead><tbody>{a.apps.map((x:any)=><tr className="border-t" key={x.id}><td className="p-4 font-bold">{x.candidate}</td><td className="p-4">{x.role}</td><td className="p-4 font-black">{score(allUsers().find((u:any)=>u.id===x.candidateId),x)}%</td><td className="p-4"><span className="badge bg-cyan-50 text-cyan-700">{x.stage}</span></td><td className="p-4"><div className="flex flex-wrap gap-2">{x.stage==='Applied'&&<button className="btn-secondary" disabled={score(allUsers().find((u:any)=>u.id===x.candidateId),x)<70} onClick={()=>{aiShortlistApplication(x.id,score(allUsers().find((u:any)=>u.id===x.candidateId),x));}}><CheckCircle2 size={14}/> AI Shortlist</button>}{x.stage==='AI Shortlisted'&&<button className="btn-secondary" onClick={()=>{inviteForInterview(x.id);}}><CalendarDays size={14}/> Schedule Interview</button>}{!['Selected','Rejected'].includes(x.stage)&&<><button className="btn-primary" onClick={()=>updateApplicationForCandidate(x.id,'Selected')}><CheckCircle2 size={14}/> Select / Hire</button><button className="btn-secondary" onClick={()=>updateApplicationForCandidate(x.id,'Rejected')}>Reject</button></>}{x.stage==='Selected'&&<span className="badge bg-emerald-50 text-emerald-700">Hired</span>}</div></td></tr>)}</tbody></table>{!a.apps.length&&<div className="p-10 text-center text-slate-500">No applications yet. Students will appear here after applying to your published opportunities.</div>}</div></div>}
export function IndustryInterviews(){const [refresh,setRefresh]=useState(0);useEffect(()=>{const f=()=>setRefresh(x=>x+1);window.addEventListener('edulyra:data',f);return()=>window.removeEventListener('edulyra:data',f)},[]);const interviews=getInterviews().filter(i=>i.company===getMyData()?.profile?.companyName);const [editing,setEditing]=useState<any>(null);return <div className="space-y-6"><Title title="Interviews" subtitle="Scheduled interviews are linked to real applications and candidates."/><div className="space-y-3">{interviews.map(i=><div className="card p-5" key={i.id}><div className="flex flex-wrap justify-between gap-4"><div><span className="badge bg-cyan-50 text-cyan-700">{i.status}</span><h2 className="mt-2 font-bold">{i.candidateName} · {i.position}</h2><p className="text-sm text-slate-500">{i.date} at {i.time} · {i.mode}</p></div><div className="flex gap-2"><button className="btn-secondary" onClick={()=>setEditing(i)}><Pencil size={14}/> Manage</button><button className="btn-secondary" onClick={()=>removeInterview(i.id)}><Trash2 size={14}/> Cancel</button></div></div>{i.link&&<a className="mt-3 inline-flex text-sm font-bold text-cyan-700" href={i.link} target="_blank" rel="noreferrer">Meeting link</a>}{i.notes&&<p className="mt-3 text-sm text-slate-600">{i.notes}</p>}</div>)}{!interviews.length&&<Empty text="No interviews scheduled yet. Shortlist a candidate and schedule an interview from Applications."/>}</div>{editing&&<InterviewForm interview={editing} onClose={()=>setEditing(null)}/>}</div>}
function InterviewForm({interview,onClose}:{interview:any;onClose:()=>void}){const [date,setDate]=useState(interview.date);const [time,setTime]=useState(interview.time);const [mode,setMode]=useState(interview.mode);const [link,setLink]=useState(interview.link);const [notes,setNotes]=useState(interview.notes);return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-5"><div className="w-full max-w-lg rounded-2xl bg-white p-6 space-y-4"><h2 className="text-xl font-black">Manage interview · {interview.candidateName}</h2><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/><input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)}/><select className="input" value={mode} onChange={e=>setMode(e.target.value)}><option>Online</option><option>On-site</option><option>Hybrid</option></select><input className="input" value={link} onChange={e=>setLink(e.target.value)} placeholder="Meeting link"/><textarea className="input min-h-24" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Interview notes"/><div className="flex gap-2"><button className="btn-primary" onClick={()=>{updateInterview(interview.id,{date,time,mode,link,notes,status:'Updated'});onClose()}}><CheckCircle2 size={14}/> Update</button><button className="btn-secondary" onClick={onClose}>Cancel</button></div></div></div>}
export function IndustryAnalytics(){const a=recruitmentAnalytics();const rates=[['Applicant → Shortlist',a.applicants?Math.round(a.shortlisted/a.applicants*100):0],['Shortlist → Interview',a.shortlisted?Math.round(a.interview/a.shortlisted*100):0],['Interview → Hire',a.interview?Math.round(a.hired/a.interview*100):0]];return <div className="space-y-6"><Title title="Recruitment Analysis" subtitle="Live metrics calculated from your organization's published opportunities and applications."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Stat label="Vacancies" value={a.opportunities}/><Stat label="Applicants" value={a.applicants}/><Stat label="Shortlisted" value={a.shortlisted}/><Stat label="Hired" value={a.hired}/><Stat label="Rejected" value={a.rejected}/></div><div className="card p-6"><h2 className="font-bold">Selection progress</h2>{rates.map(([x,v]:any)=><div className="mt-5" key={x}><ProgressBar label={x} value={v}/></div>)}</div><div className="grid gap-4 md:grid-cols-3">{[['Interview',a.interview],['Open vacancies',a.opportunities],['Unselected applicants',Math.max(0,a.applicants-a.hired-a.rejected)]].map(([x,v])=><div className="card p-5" key={x}><BarChart3 className="text-cyan-600"/><p className="mt-3 text-sm text-slate-500">{x}</p><b className="text-2xl">{v}</b></div>)}</div></div>}
export function IndustryMessages(){const u:any=getMyData();const [q,setQ]=useState('');const [body,setBody]=useState('');const [receiver,setReceiver]=useState('');const msgs=getMessagesForUser();const people=allUsers().filter((x:any)=>x.role==='student'&&msgs.some((m:any)=>m.senderId===x.id||m.receiverId===x.id)).filter((x:any)=>`${x.name} ${x.email} ${x.profile?.careerGoal||''}`.toLowerCase().includes(q.toLowerCase()));return <div className="space-y-6"><Title title="Messages" subtitle="Recruitment communication is linked to real shortlist, interview and selection actions."/><div className="card p-5"><div className="relative"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search candidates in conversations…"/></div></div>{people.map(p=>{const thread=msgs.filter((m:any)=>m.senderId===p.id||m.receiverId===p.id);return <div className="card p-5" key={p.id}><div className="flex justify-between"><div><h2 className="font-bold">{p.name}</h2><p className="text-xs text-slate-500">{p.email} · {p.profile?.careerGoal||p.profile?.desiredJobRole||'Candidate'}</p></div><button className="btn-secondary" onClick={()=>setReceiver(p.id)}>Reply</button></div>{thread.map((m:any)=><div className={`mt-3 rounded-xl p-3 text-sm ${m.senderId===u.id?'bg-cyan-50':'bg-slate-50'}`} key={m.id}>{m.body}<p className="mt-1 text-[11px] text-slate-400">{new Date(m.createdAt).toLocaleString()}</p></div>)}</div>})}{!people.length&&<div className="card p-8 text-center text-sm text-slate-500">No connected candidate conversations yet. Messages appear after recruitment actions.</div>}{receiver&&<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-5"><div className="w-full max-w-lg rounded-2xl bg-white p-6"><h2 className="font-black">Reply to {allUsers().find((x:any)=>x.id===receiver)?.name}</h2><textarea className="input mt-4 min-h-28" value={body} onChange={e=>setBody(e.target.value)} placeholder="Write a clear recruiter message…"/><div className="mt-4 flex gap-2"><button className="btn-primary" disabled={!body.trim()} onClick={()=>{sendMessage(receiver,body);setBody('');setReceiver('')}}><Send size={14}/> Send</button><button className="btn-secondary" onClick={()=>setReceiver('')}>Cancel</button></div></div></div>}</div>}


function IndustryPostManager({
  title,
  subtitle,
  type,
  buttonLabel
}:{
  title:string;
  subtitle:string;
  type:'Challenge'|'Training'|'Workshop';
  buttonLabel:string;
}){
  const me:any=getMyData();
  const [refresh,setRefresh]=useState(0);
  const [notice,setNotice]=useState('');
  const [error,setError]=useState('');
  const [form,setForm]=useState<any>({
    title:'',
    duration:'',
    level:'Intermediate',
    location:'Remote',
    workMode:'Remote',
    skills:'',
    eligibility:'',
    deadline:'',
    compensation:'Not specified',
    description:''
  });
  useEffect(()=>{
    const f=()=>setRefresh(x=>x+1);
    window.addEventListener('edulyra:data',f);
    return()=>window.removeEventListener('edulyra:data',f);
  },[]);
  const set=(key:string,value:string)=>setForm((x:any)=>({...x,[key]:value}));
  const posts=getOpportunities().filter(o=>o.company===me?.profile?.companyName&&o.type===type);
  const submit=()=>{
    setNotice('');setError('');
    if(!form.title.trim()||!form.description.trim()||!form.skills.trim()){
      setError('Please fill in the title, description and required skills.');
      return;
    }
    try{
      addOpportunity({
        title:form.title.trim(),
        type,
        workMode:form.workMode,
        location:form.location.trim()||'Remote',
        compensation:form.compensation.trim()||'Not specified',
        duration:form.duration.trim(),
        eligibility:form.eligibility.trim()||'Open to eligible participants',
        deadline:form.deadline,
        skills:listValue(form.skills),
        description:form.description.trim()
      });
      setNotice(`${type} posted successfully. It is now available to eligible users.`);
      setForm({title:'',duration:'',level:'Intermediate',location:'Remote',workMode:'Remote',skills:'',eligibility:'',deadline:'',compensation:'Not specified',description:''});
    }catch(e:any){setError(e?.message||`Unable to post ${type.toLowerCase()}.`);}
  };
  return <div className="space-y-6">
    <Title title={title} subtitle={subtitle}/>
    <div className="card p-6">
      <h2 className="text-lg font-black">Post {type}</h2>
      <p className="mt-1 text-sm text-slate-500">Create a real {type.toLowerCase()} using your existing Industry account.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e=>set('title',e.target.value)} placeholder={`Enter ${type.toLowerCase()} title`}/></div>
        <div><label className="label">Duration</label><input className="input" value={form.duration} onChange={e=>set('duration',e.target.value)} placeholder="e.g. 4 weeks / 2 days"/></div>
        <div><label className="label">Location</label><input className="input" value={form.location} onChange={e=>set('location',e.target.value)} placeholder="Location or Remote"/></div>
        <div><label className="label">Work mode</label><select className="input" value={form.workMode} onChange={e=>set('workMode',e.target.value)}><option>Remote</option><option>Hybrid</option><option>On-site</option></select></div>
        <div><label className="label">Level</label><select className="input" value={form.level} onChange={e=>set('level',e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
        <div><label className="label">Eligibility</label><input className="input" value={form.eligibility} onChange={e=>set('eligibility',e.target.value)} placeholder="Who can participate?"/></div>
        <div><label className="label">Deadline</label><input className="input" type="date" value={form.deadline} onChange={e=>set('deadline',e.target.value)}/></div>
        <div><label className="label">Compensation / Fee</label><input className="input" value={form.compensation} onChange={e=>set('compensation',e.target.value)}/></div>
        <div className="sm:col-span-2"><label className="label">Required skills *</label><input className="input" value={form.skills} onChange={e=>set('skills',e.target.value)} placeholder="React, Python, SQL"/></div>
        <div className="sm:col-span-2"><label className="label">Description / requirements / outcomes *</label><textarea className="input min-h-32" value={form.description} onChange={e=>set('description',e.target.value)} placeholder={`Describe the ${type.toLowerCase()}, requirements and expected outcomes`}/></div>
        <button className="btn-primary sm:col-span-2" onClick={submit}><Plus size={16}/> {buttonLabel}</button>
        {notice&&<div className="sm:col-span-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</div>}
        {error&&<div className="sm:col-span-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
      </div>
    </div>
    <div className="space-y-3">
      <h2 className="text-lg font-black">My Posted {type}s</h2>
      {posts.map(o=><div className="card p-5" key={o.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="badge bg-cyan-50 text-cyan-700">{o.type}</span><h3 className="mt-2 font-black">{o.title}</h3><p className="mt-1 text-sm text-slate-500">{o.duration||'Duration not specified'} · {o.location}</p></div><span className="badge bg-emerald-50 text-emerald-700">Published</span></div><p className="mt-3 text-sm text-slate-600">{o.description}</p><div className="mt-3 flex flex-wrap gap-2">{listValue(o.skills).map((skill:string)=><span className="skill-chip" key={skill}>{skill}</span>)}</div></div>)}
      {!posts.length&&<Empty text={`No ${type.toLowerCase()}s posted yet.`}/>}
    </div>
  </div>;
}

export function IndustryChallenges(){
  return <IndustryPostManager title="Industry Challenges" subtitle="Post real-world problems, innovation briefs and project challenges for eligible students and teams." type="Challenge" buttonLabel="Post Challenge"/>;
}

export function IndustryTraining(){
  const [refresh,setRefresh]=useState(0);
  const me:any=getMyData();
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [skills,setSkills]=useState('');
  const [duration,setDuration]=useState('');
  const [notice,setNotice]=useState('');
  const [error,setError]=useState('');
  const [recipient,setRecipient]=useState('');
  const [certTitle,setCertTitle]=useState('');
  const [certDescription,setCertDescription]=useState('');
  useEffect(()=>{const f=()=>setRefresh(x=>x+1);window.addEventListener('edulyra:data',f);return()=>window.removeEventListener('edulyra:data',f)},[]);
  const training=getOpportunities().filter(o=>o.company===me?.profile?.companyName&&o.type==='Training');
  const recipients=allUsers().filter((u:any)=>u.role==='student'||u.role==='faculty');
  const postTraining=()=>{
    setNotice('');setError('');
    if(!title.trim()||!description.trim()||!skills.trim()){setError('Please fill in the training title, description and skills.');return;}
    try{addOpportunity({title:title.trim(),type:'Training',workMode:'Remote',location:'Remote',compensation:'Not specified',duration,eligibility:'Eligible students and faculty',deadline:'',skills:listValue(skills),description:description.trim()});setNotice('Training posted successfully.');setTitle('');setDescription('');setSkills('');setDuration('');}
    catch(e:any){setError(e?.message||'Unable to post training.');}
  };
  const issue=()=>{
    setNotice('');setError('');
    if(!recipient||!certTitle.trim()){setError('Select a Student or Faculty member and enter a certification name.');return;}
    try{issueCertificateToRecipient(recipient,certTitle.trim(),String(me?.profile?.companyName||me?.name||'Industry Partner'),certDescription.trim());setNotice('Certification issued successfully. The recipient can now see it in their existing portfolio/certification area.');setRecipient('');setCertTitle('');setCertDescription('');}
    catch(e:any){setError(e?.message||'Unable to issue certification.');}
  };
  return <div className="space-y-6">
    <Title title="Training & Certification" subtitle="Post professional training and provide verified certifications directly to eligible students and faculty."/>
    <div className="card p-6">
      <h2 className="text-lg font-black">Post Training Program</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div><label className="label">Training title *</label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Training program title"/></div>
        <div><label className="label">Duration</label><input className="input" value={duration} onChange={e=>setDuration(e.target.value)} placeholder="e.g. 6 weeks"/></div>
        <div className="sm:col-span-2"><label className="label">Required skills *</label><input className="input" value={skills} onChange={e=>setSkills(e.target.value)} placeholder="AWS, SQL, Python"/></div>
        <div className="sm:col-span-2"><label className="label">Description / outcomes *</label><textarea className="input min-h-28" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe the training and expected outcomes"/></div>
        <button className="btn-primary sm:col-span-2" onClick={postTraining}><Plus size={16}/> Post Training</button>
      </div>
    </div>
    <div className="card p-6">
      <h2 className="text-lg font-black">Provide Certification</h2>
      <p className="mt-1 text-sm text-slate-500">Issue a verified certification to an eligible Student or Faculty member.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div><label className="label">Recipient *</label><select className="input" value={recipient} onChange={e=>setRecipient(e.target.value)}><option value="">Select Student or Faculty</option>{recipients.map((u:any)=><option key={u.id} value={u.id}>{u.name} · {u.role} · {u.email}</option>)}</select></div>
        <div><label className="label">Certification name *</label><input className="input" value={certTitle} onChange={e=>setCertTitle(e.target.value)} placeholder="e.g. Advanced React Certification"/></div>
        <div className="sm:col-span-2"><label className="label">Certification details</label><textarea className="input min-h-24" value={certDescription} onChange={e=>setCertDescription(e.target.value)} placeholder="Optional description or achievement details"/></div>
        <button className="btn-primary sm:col-span-2" onClick={issue}><CheckCircle2 size={16}/> Issue Certification</button>
      </div>
    </div>
    {(notice||error)&&<div className={`rounded-xl p-4 text-sm ${error?'bg-rose-50 text-rose-700':'bg-emerald-50 text-emerald-700'}`}>{error||notice}</div>}
    <div className="space-y-3"><h2 className="text-lg font-black">My Posted Training</h2>{training.map(o=><div className="card p-5" key={o.id}><span className="badge bg-cyan-50 text-cyan-700">Training</span><h3 className="mt-2 font-black">{o.title}</h3><p className="mt-1 text-sm text-slate-500">{o.duration||'Duration not specified'}</p><p className="mt-3 text-sm text-slate-600">{o.description}</p><div className="mt-3 flex flex-wrap gap-2">{listValue(o.skills).map((s:string)=><span className="skill-chip" key={s}>{s}</span>)}</div></div>)}{!training.length&&<Empty text="No training programs posted yet."/>}</div>
  </div>;
}

export function IndustryWorkshops(){
  return <IndustryPostManager title="Industry Workshops" subtitle="Post hands-on workshops, bootcamps, seminars and expert-led technical sessions." type="Workshop" buttonLabel="Post Workshop"/>;
}

export function IndustryMentorship(){
 const [requested,setRequested]=useState<string[]>([]);
 const mentors: [string,string,string,string,string][]=[
   ['m1','Arjun Mehta','Senior Product Engineer','React · Cloud · System Design','8+ years'],
  ['m2','Ananya Rao','Data Analytics Lead','SQL · Python · Data Analytics','10+ years'],
  ['m3','Meera Iyer','Career & Hiring Mentor','Interviews · Resume · Career Strategy','9+ years']
 ];
 return <div className="space-y-6"><Title title="Industry Mentorship" subtitle="Connect with industry experts for technical guidance, career advice and mentoring sessions."/>
 <div className="grid gap-4 md:grid-cols-3">{mentors.map(x=><div className="card p-5" key={x[0] as string}><div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><Users size={20}/></div><h2 className="mt-4 font-black">{x[1]}</h2><p className="mt-1 text-xs font-semibold text-slate-500">{x[2]}</p><span className="badge mt-3 bg-violet-50 text-violet-700">{x[4]}</span><p className="mt-4 text-xs leading-5 text-slate-500">Expertise: {x[3]}</p><Button onClick={()=>setRequested(v=>v.includes(x[0] as string)?v:v.concat(x[0] as string))}>{requested.includes(x[0] as string)?'Request Sent':'Request Mentorship'}</Button></div>)}</div>
 <div className="card p-5"><h2 className="font-black">Upcoming Mentoring Sessions</h2><p className="mt-2 text-sm text-slate-500">{requested.length?`${requested.length} mentorship request${requested.length>1?'s':''} submitted. Confirmed sessions will appear here.`:'No sessions booked yet. Request a mentor to start.'}</p></div></div>
}

export function IndustryGeneric({title}:{title:string}){if(title==='Opportunities')return <IndustryOpportunities/>;if(title==='Interviews')return <IndustryInterviews/>;if(title==='Recruitment Analytics')return <IndustryAnalytics/>;if(title==='Messages')return <IndustryMessages/>;return <Card title={title} items={['Active hiring campaign','Candidate pipeline','Interview schedule','Analytics report']}/>}
export function InstitutionDashboard(){const students=allUsers().filter((u:any)=>u.role==='student');const [q,setQ]=useState('');const results=students.filter((u:any)=>`${u.name} ${u.email} ${u.profile?.careerGoal||''} ${(u.profile?.currentSkills||[]).join(' ')}`.toLowerCase().includes(q.toLowerCase())).slice(0,5);return <div className="space-y-6"><Title title="Institution Dashboard" subtitle="Student readiness, skill gaps, internships, placements and industry collaboration."/><div className="card p-4 relative"><Search size={17} className="absolute left-7 top-7 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search students, skills or career goals…"/>{q&&<div className="mt-3 space-y-2">{results.map((u:any)=><Link to="/institution/students" className="block rounded-xl bg-slate-50 p-3 text-sm" key={u.id}><b>{u.name}</b> · {u.profile?.careerGoal||'Goal not set'}<span className="ml-2 text-slate-400">{(u.profile?.currentSkills||[]).slice(0,4).join(', ')}</span></Link>)}{!results.length&&<p className="text-sm text-slate-500">No matching students.</p>}</div>}</div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Total Students" value={students.length}/><Stat label="Assessed" value={students.filter((u:any)=>u.assessment).length}/><Stat label="Applications" value={students.reduce((n,u)=>n+(u.applications||[]).length,0)}/><Stat label="Placed" value={students.reduce((n,u)=>n+(u.applications||[]).filter((a:any)=>a.stage==='Selected').length,0)}/></div><Link className="btn-primary" to="/institution/students"><Users size={15}/> Open student search</Link></div>}
export function InstitutionGeneric({title}:{title:string}){return <Card title={title} items={['Student cohort overview','Most common skills','Most common Skill Gaps','Industry demand','Placement report','Internship participation']}/>}
function Empty({text}:{text:string}){return <div className="card p-8 text-center text-sm text-slate-500">{text}</div>}
function Card({title,items}:{title:string;items:string[]}){return <div className="card p-6"><h2 className="font-bold">{title}</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{items.map(x=><div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm" key={x}><CheckCircle2 size={15} className="text-emerald-500"/>{x}</div>)}</div></div>}
