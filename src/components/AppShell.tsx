import { useState } from "react";
import {
  Bell,
  Menu,
  Search,
  LogOut,
  Sparkles,
  Command,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { User } from "../types";
import { Sidebar } from "./Sidebar";
import { Logo } from "./Logo";
import { signOut } from "../services/auth";
import { allUsers, getOpportunities } from "../services/store";

function listValue(value:any): string[]{if(Array.isArray(value)) return value.map(String); if(value==null||value==='') return []; return String(value).split(',').map(x=>x.trim()).filter(Boolean);}

function GlobalSearch({role,value,onChange}:{role:User['role'];value:string;onChange:(v:string)=>void}){
 const navigate=useNavigate(); const q=value.trim().toLowerCase();
 const ops=q?getOpportunities().filter(o=>`${o.title||''} ${o.company||''} ${o.type||''} ${o.description||''} ${listValue(o.skills).join(' ')}`.toLowerCase().includes(q)).slice(0,6):[];
 const users=q?allUsers().filter((u:any)=>{if(role==='industry'&&u.role!=='student')return false;return `${u.name} ${u.email} ${u.profile?.careerGoal||''} ${u.profile?.department||''} ${u.profile?.expertise||''} ${listValue(u.profile?.currentSkills).join(' ')}`.toLowerCase().includes(q)}).slice(0,4):[];
 const go=(path:string)=>{navigate(path);onChange('')};
 return <div className="relative hidden md:block"><div className={`flex h-11 w-[340px] items-center gap-3 rounded-2xl border px-4 text-sm ${q?'border-violet-300 bg-white shadow-sm ring-4 ring-violet-100':'border-slate-200 bg-slate-50/80'}`}><Search size={17} className="shrink-0 text-slate-400"/><input aria-label="Global search" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400" value={value} onChange={e=>onChange(e.target.value)} placeholder="Search skills, careers, opportunities..."/>{q&&<button type="button" className="text-xs text-slate-400" onClick={()=>onChange('')}>Clear</button>} {!q&&<div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-bold text-slate-400 sm:flex"><Command size={11}/><span>K</span></div>}</div>{q&&<div className="absolute left-0 top-14 z-50 w-[420px] max-w-[80vw] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">{ops.map(o=><button type="button" key={o.id} onClick={()=>go(role==='faculty'?`/faculty/opportunities/${o.id}`:role==='industry'?'/industry/opportunities':role==='institution'?'/institution/internships':`/student/opportunities/${o.id}`)} className="block w-full rounded-xl p-3 text-left hover:bg-slate-50"><span className="badge bg-cyan-50 text-cyan-700">{o.type}</span><p className="mt-1 text-sm font-bold">{o.title}</p><p className="text-xs text-slate-500">{o.company} · {listValue(o.skills).slice(0,3).join(', ')}</p></button>)}{users.map(u=><button type="button" key={u.id} onClick={()=>go(role==='industry'?'/industry/candidates':role==='institution'?'/institution/students':role==='faculty'?'/faculty/profile':'/student/skills')} className="block w-full rounded-xl p-3 text-left hover:bg-slate-50"><p className="text-sm font-bold">{u.name}</p><p className="text-xs text-slate-500">{u.role} · {u.profile?.careerGoal||u.profile?.department||u.profile?.expertise||u.email}</p></button>)}{!ops.length&&!users.length&&<p className="p-4 text-sm text-slate-500">No results found for “{value}”.</p>}</div>}</div>
}

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  async function logout() {
    await signOut();
    navigate("/login");
  }

  const initials =
    user.name
      ?.split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#F6F5FC] text-slate-900">

      <div className="flex min-h-screen">

        {/* =========================================================
            SIDEBAR
        ========================================================= */}

        <Sidebar
          role={user.role}
          open={open}
          onClose={() => setOpen(false)}
        />

        {/* =========================================================
            MOBILE OVERLAY
        ========================================================= */}

        {open && (
          <div
            className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* =========================================================
            MAIN APPLICATION
        ========================================================= */}

        <div className="min-w-0 flex-1">

          {/* =======================================================
              TOP HEADER
          ======================================================= */}

          <header className="sticky top-0 z-20 border-b border-violet-100/70 bg-white/90 backdrop-blur-xl">

            <div className="flex h-[72px] items-center justify-between px-4 lg:px-7">

              {/* ---------------------------------------------------
                  LEFT SIDE
              --------------------------------------------------- */}

              <div className="flex min-w-0 items-center gap-3">

                {/* Mobile menu */}

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="Open navigation"
                  className="group grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 lg:hidden"
                >
                  <Menu
                    size={20}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                </button>

                {/* Mobile logo */}

                <div className="lg:hidden">
                  <Logo compact />
                </div>

                {/* Desktop search */}

                <GlobalSearch role={user.role} value={search} onChange={setSearch} />

              </div>

              {/* ---------------------------------------------------
                  RIGHT SIDE
              --------------------------------------------------- */}

              <div className="flex shrink-0 items-center gap-2">

                {/* =================================================
                    AI INTELLIGENCE STATUS
                ================================================= */}

                <div className="mr-1 hidden items-center gap-2.5 rounded-2xl border border-cyan-100 bg-gradient-to-r from-violet-50 to-cyan-50 px-3 py-2 lg:flex">

                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-slate-950 text-cyan-300 shadow-sm">
                    <Sparkles size={14} />
                  </div>

                  <div className="leading-none">

                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-700">
                      Skill Intelligence
                    </p>

                    <p className="mt-1 text-[9px] font-semibold text-cyan-600">
                      AI engine active
                    </p>

                  </div>

                  <span className="ml-1 h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                </div>

                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/${user.role}/notifications`)
                  }
                  aria-label="Notifications"
                  className="group relative grid h-10 w-10 place-items-center rounded-xl border border-transparent text-slate-500 transition-all duration-200 hover:border-violet-100 hover:bg-violet-50 hover:text-violet-700"
                >

                  <Bell
                    size={19}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />

                  <span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-violet-500" />

                </button>

                {/* Divider */}

                <div className="mx-1 h-8 w-px bg-slate-200" />

                {/* =================================================
                    USER PROFILE
                ================================================= */}

                <button
                  type="button"
                  onClick={() => navigate("/settings")}
                  className="group hidden items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50 sm:flex"
                >

                  {/* Avatar */}

                  <div className="relative">

                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-slate-950 via-violet-900 to-blue-600 text-xs font-black text-white shadow-md shadow-slate-900/10 transition-transform duration-200 group-hover:scale-105">
                      {initials}
                    </div>

                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />

                  </div>

                  {/* User details */}

                  <div className="hidden text-left xl:block">

                    <p className="max-w-[140px] truncate text-xs font-black text-slate-800">
                      {user.name}
                    </p>

                    <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium capitalize text-slate-400">
                      {user.role}
                      <ChevronDown size={11} />
                    </p>

                  </div>

                </button>

                {/* =================================================
                    LOGOUT
                ================================================= */}

                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  aria-label="Sign out"
                  className="group grid h-10 w-10 place-items-center rounded-xl border border-transparent text-slate-500 transition-all duration-200 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                >

                  <LogOut
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />

                </button>

              </div>

            </div>

          </header>

          {/* =======================================================
              PAGE CONTENT
          ======================================================= */}

          <main className="relative mx-auto min-h-[calc(100vh-72px)] max-w-[1500px] overflow-hidden p-4 lg:p-7">

            {/* Decorative cyan glow */}

            <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-violet-300/10 blur-3xl" />

            {/* Decorative emerald glow */}

            <div className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

            {/* Content */}

            <div className="relative z-10">
              {children}
            </div>

          </main>

        </div>

      </div>

    </div>
  );
}