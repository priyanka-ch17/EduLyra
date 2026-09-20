import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowRight, BriefcaseBusiness, Building2, GraduationCap, Network,
  Sparkles, Users, CheckCircle2, BrainCircuit, Target, Route,
  ShieldCheck, Zap, ChevronRight, Star
} from 'lucide-react';
import { getStoredUser } from '../services/auth';

const journey = [
  { title: 'Discover', label: 'Career Discovery', icon: Target, text: 'Understand your strengths, interests and career direction.', metric: 'Profile + Goals' },
  { title: 'Assess', label: 'Skill Intelligence', icon: BrainCircuit, text: 'Measure your current skills against real industry demand.', metric: 'Skill Gap Analysis' },
  { title: 'Grow', label: 'Personal Roadmap', icon: Route, text: 'Turn your gaps into a focused learning and certification plan.', metric: '90-Day Roadmap' },
  { title: 'Connect', label: 'Mentor Match', icon: Users, text: 'Find guidance from mentors aligned with your career path.', metric: 'Smart Matching' },
  { title: 'Launch', label: 'Opportunities', icon: BriefcaseBusiness, text: 'Move from preparation to internships, jobs and interviews.', metric: 'AI Matching' },
];

const dna = [
  ['Career Fit', 94],
  ['Technical Skills', 86],
  ['Problem Solving', 91],
  ['Communication', 78],
];

export function Landing() {
  const u = getStoredUser();
  const [activeJourney, setActiveJourney] = useState(0);
  const current = journey[activeJourney];
  const CurrentIcon = current.icon;

  return (
    <div className="landing-shell overflow-hidden">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link to="/" className="group">
          <div className="flex items-center gap-2 font-black tracking-tight text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#22D3EE] text-sm shadow-lg shadow-violet-900/30">E</span>
            <span className="text-xl">Edu<span className="brand-gradient-light">Lyra</span></span>
          </div>
          <div className="ml-11 text-[9px] font-semibold tracking-wide text-slate-500">Guiding talent toward tomorrow</div>
        </Link>
        <nav className="hidden gap-7 text-sm text-slate-300 md:flex">
          <a href="#intelligence" className="transition hover:text-white">Intelligence</a>
          <a href="#journey" className="transition hover:text-white">Journey</a>
          <a href="#roles" className="transition hover:text-white">For Everyone</a>
        </nav>
        <div className="flex gap-2">
          {u ? <Link className="btn-secondary !border-white/15 !bg-white/10 !text-white hover:!bg-white/15" to={'/' + u.role}>Dashboard</Link> :
            <><Link className="btn-secondary !border-white/15 !bg-white/5 !text-white hover:!bg-white/10" to="/login">Login</Link><Link className="btn-primary" to="/register">Get started <ArrowRight size={15}/></Link></>}
        </div>
      </header>

      <main>
        <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:pt-20">
          <div>
            <span className="landing-eyebrow"><Sparkles size={13}/> AI-powered career intelligence</span>
            <h1 className="mt-6 text-5xl font-black leading-[.98] tracking-tight sm:text-6xl lg:text-7xl">
              Your career has a path.
              <span className="brand-gradient-light block">Let EduLyra reveal it.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Assess your skills, discover your gaps, learn with purpose, connect with mentors and move toward opportunities — from one intelligent career profile.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={u ? '/' + u.role : '/register'} className="btn-primary">Build my career path <ArrowRight size={17}/></Link>
              <Link to="/explore" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">Explore platform <Network size={16}/></Link>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <span><b className="text-white">360°</b> skill visibility</span>
              <span><b className="text-white">AI</b> career matching</span>
              <span><b className="text-white">4</b> connected roles</span>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-10 rounded-full bg-violet-600/20 blur-3xl"/>
            <div className="relative rounded-[32px] border border-white/10 bg-white/[.055] p-4 shadow-2xl shadow-violet-950/50 backdrop-blur-xl">
              <div className="rounded-[25px] border border-white/10 bg-[#0b0824]/90 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] text-white"><BrainCircuit size={19}/></div>
                    <div><p className="text-xs font-bold text-white">Lyra Intelligence</p><p className="text-[10px] text-slate-500">Your career signal, in one view</p></div>
                  </div>
                  <span className="badge bg-emerald-400/10 text-emerald-300">LIVE</span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-[.85fr_1.15fr]">
                  <div className="rounded-2xl border border-white/10 bg-white/[.035] p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-300">Career Intelligence Score</p>
                    <div className="mt-3 flex items-end gap-1"><span className="text-6xl font-black text-white">87</span><span className="pb-2 text-sm text-slate-500">/100</span></div>
                    <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full w-[87%] rounded-full bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#22D3EE]"/></div>
                    <p className="mt-3 text-[10px] text-slate-500">Based on skills, evidence, learning and alignment.</p>
                  </div>
                  <div className="rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/10 to-cyan-400/5 p-5">
                    <div className="flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-300">Career DNA</p><span className="text-[10px] text-slate-500">Personalized</span></div>
                    <div className="mt-4 space-y-3">{dna.map(([name, value]) => <div key={name as string}><div className="flex justify-between text-xs"><span className="text-slate-300">{name}</span><b className="text-white">{value}%</b></div><div className="mt-1.5 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#EC4899] to-[#8B5CF6]" style={{width: `${value}%`}}/></div></div>)}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {['Skill Gap', 'Mentor Match', 'Next Action'].map((x, i) => <div key={x} className="rounded-xl border border-white/10 bg-white/[.03] p-3"><p className="text-[9px] text-slate-500">{x}</p><p className="mt-1 text-xs font-bold text-white">{['3 priority skills','92% match','Start React'][i]}</p></div>)}
                </div>
              </div>
            </div>
            <div className="skill-float absolute -right-5 -top-5 hidden rounded-2xl border border-cyan-300/20 bg-[#11102d]/90 px-4 py-3 shadow-xl backdrop-blur md:block">
              <div className="flex items-center gap-2 text-xs font-bold text-white"><Zap size={14} className="text-cyan-300"/> Next best action</div>
              <p className="mt-1 text-[10px] text-slate-500">Close your highest skill gap</p>
            </div>
          </div>
        </section>

        <section id="intelligence" className="relative z-10 mx-auto max-w-7xl px-5 pb-16">
          <div className="rounded-[30px] border border-white/10 bg-white/[.035] p-6 shadow-2xl shadow-black/10 backdrop-blur">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div><p className="landing-kicker">One intelligent profile</p><h2 className="mt-2 text-3xl font-black text-white">Everything connects to your next move.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Your existing EduLyra capabilities become a single continuous journey instead of disconnected screens.</p></div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} className="text-cyan-300"/> Evidence-aware intelligence</div>
            </div>
            <div id="journey" className="mt-7 grid gap-2 md:grid-cols-5">
              {journey.map((item, i) => { const Icon = item.icon; return <button type="button" onClick={() => setActiveJourney(i)} key={item.title} className={`journey-node text-left ${activeJourney === i ? 'journey-node-active' : ''}`}><span className="journey-number">0{i+1}</span><Icon size={18}/><p className="mt-3 font-bold">{item.title}</p><p className="mt-1 text-[10px] text-slate-500">{item.label}</p></button> })}
            </div>
            <div className="mt-3 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-500/10 via-blue-500/5 to-cyan-400/10 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] text-white"><CurrentIcon size={18}/></div><div><p className="text-xs font-black uppercase tracking-widest text-cyan-300">{current.label}</p><p className="mt-1 text-sm text-slate-300">{current.text}</p></div></div>
                <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white">{current.metric}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0B0822]/80 py-16">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-fuchsia-400/10 bg-gradient-to-br from-fuchsia-500/10 to-violet-500/5 p-6 lg:col-span-1">
                <div className="flex items-center gap-2"><Sparkles size={17} className="text-fuchsia-300"/><p className="text-xs font-black uppercase tracking-widest text-fuchsia-300">Meet Lyra AI</p></div>
                <h2 className="mt-4 text-2xl font-black text-white">A career companion, not just a chatbot.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">Lyra turns your profile, assessment, goals and evidence into clear next actions — while your existing Career Advisor remains available.</p>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4"><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Lyra says</p><p className="mt-2 text-sm leading-6 text-white">“You are strongest in problem solving. Close your Cloud gap next — it gives you the biggest career lift.”</p></div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[.035] p-6 lg:col-span-2">
                <div className="flex items-center justify-between"><div><p className="landing-kicker">Smart mentor match</p><h2 className="mt-2 text-2xl font-black text-white">Find guidance that actually fits.</h2></div><Users className="text-cyan-300" size={24}/></div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Career path', 'Software Engineering', '96%'],
                    ['Skill overlap', 'React • Java • SQL', '91%'],
                    ['Experience fit', 'Industry Mentor', '89%'],
                  ].map(([a,b,c]) => <div key={a} className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><p className="text-[10px] text-slate-500">{a}</p><p className="mt-2 text-sm font-bold text-white">{b}</p><p className="mt-3 text-xl font-black text-cyan-300">{c}</p></div>)}
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-500/10 to-cyan-400/5 p-4"><div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white"><Star size={15}/></div><p className="text-xs leading-5 text-slate-300">Matching can use the same profile and capability signals already powering your existing mentorship experience.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="roles" className="mx-auto max-w-7xl px-5 py-16">
          <div className="max-w-2xl"><p className="landing-kicker">One ecosystem</p><h2 className="mt-2 text-3xl font-black text-white">Built for every side of the career journey.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Keep the same role-based workspaces and capabilities — now wrapped in a stronger, more memorable identity.</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [GraduationCap,'Students','Assess, learn, build a portfolio and apply.'],
              [Users,'Academicians','Support students through mentorship, research and projects.'],
              [BriefcaseBusiness,'Industries','Discover capability and recruit with better signals.'],
              [Building2,'Institutions','See readiness, gaps, participation and outcomes.'],
            ].map(([I,t,d]) => { const Icon = I as any; return <div className="role-card" key={t as string}><Icon className="text-cyan-300"/><h3 className="mt-4 font-bold text-white">{t as string}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{d as string}</p><ChevronRight size={16} className="mt-5 text-violet-300"/></div> })}
          </div>
        </section>

        <section id="feedback" className="mx-auto max-w-7xl px-5 pb-16">
          <div className="max-w-2xl"><p className="landing-kicker">Feedback</p><h2 className="mt-2 text-3xl font-black text-white">Built around real career journeys.</h2><p className="mt-3 text-sm leading-6 text-slate-400">A concise view of the experience users can share after learning, mentorship and recruitment activities.</p></div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[['Student · Software Developer','“The assessment showed me exactly which skills I needed to strengthen before applying.”'],['Academician · Faculty','“Mentorship and industry collaboration can live in one professional workspace.”'],['Industry · Recruiter','“Skill evidence and explainable matching make candidate review more structured.”']].map(([who,quote])=><article className="rounded-2xl border border-white/10 bg-white/5 p-5" key={who}><div className="flex items-center gap-2 text-amber-300"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div><p className="mt-4 text-sm leading-6 text-slate-200">{quote}</p><p className="mt-4 text-xs font-bold text-cyan-300">{who}</p><p className="mt-1 text-[10px] text-slate-500">Illustrative demo feedback</p></article>)}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-16">
          <div className="rounded-3xl border border-violet-300/10 bg-gradient-to-r from-violet-500/10 via-blue-500/5 to-cyan-400/10 p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-cyan-300">Your next chapter starts here</p><h2 className="mt-2 text-2xl font-black text-white">Turn potential into a career signal.</h2><p className="mt-1 text-sm text-slate-400">Keep your existing EduLyra features. Experience them as one intelligent journey.</p></div><Link className="btn-primary" to={u ? '/' + u.role : '/register'}>{u ? 'Open dashboard' : 'Start my journey'} <ArrowRight size={16}/></Link></div>
          </div>
        </section>
      </main>
    </div>
  );
}

export function Explore() {
  return <div className="min-h-screen bg-slate-50 text-slate-900"><header className="border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"><Link to="/" className="font-black">Edu<span className="text-cyan-600">Lyra</span></Link><Link to="/register" className="btn-primary">Create account</Link></div></header><main className="mx-auto max-w-7xl px-5 py-10"><h1 className="text-4xl font-black">Explore Platform</h1><p className="mt-2 max-w-3xl text-slate-500">Everything required for Problem Statement 26044, organized by stakeholder.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{[[GraduationCap,'Students',['Skill Assessment','Skill Profile','Skill Gap Analysis','Courses & Certifications','Internships & Jobs','Projects & Workshops','Mentorship','Digital Portfolio','Resume','Application Tracking']],[Users,'Academicians',['Career Goals','Faculty Internships','Industrial Training','FDPs','Workshops','Research','Consultancy','Industry Projects','Mentorship','Professional Profile']],[BriefcaseBusiness,'Industries',['Post Jobs','Internships','Projects','Apprenticeships','Training','Certifications','Workshops','Mentorship','Candidate Search','AI Matching','Applications','Shortlisting','Interviews','Recruitment Analytics']],[Building2,'Institutions',['Student Dashboard','Skill Gaps','Internship Participation','Placement Progress','Readiness','Course Progress','Department Analytics','Industry Connections','Recruitment Outcomes','Demand Trends']]].map(([I,t,items])=>{const Icon=I as any;return <section className="rounded-3xl border bg-white p-6 shadow-sm" key={t as string}><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-50 text-cyan-600"><Icon/></div><h2 className="text-xl font-black">{t as string}</h2></div><div className="mt-5 grid gap-2 sm:grid-cols-2">{(items as string[]).map(x=><div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-medium" key={x}><CheckCircle2 size={15} className="text-emerald-500"/>{x}</div>)}</div></section>})}</div></main></div>
}
