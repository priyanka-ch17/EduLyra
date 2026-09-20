import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  Award,
  BrainCircuit,
  BriefcaseBusiness,
  GraduationCap,
  CalendarDays,
  KanbanSquare,
  UserRound,
  MessageSquare,
  ShieldCheck,
  Bell,
  Settings,
  Users,
  Handshake,
  BarChart3,
  Building2,
  Search,
  X,
  Sparkles,
  WandSparkles,
  ChevronRight,
} from "lucide-react";

import type { Role } from "../types";
import { cn } from "../lib/utils";
import { Logo } from "./Logo";

type MenuItem = {
  label: string;
  path: string;
  icon: any;
};

const groups: Record<Role, MenuItem[]> = {
  student: [
    {
      label: "Dashboard",
      path: "/student",
      icon: LayoutDashboard,
    },
    {
      label: "Skill Assessment",
      path: "/student/assessment",
      icon: ClipboardCheck,
    },
    {
      label: "My Skills",
      path: "/student/skills",
      icon: BrainCircuit,
    },
    {
      label: "Career Advisor",
      path: "/student/careers",
      icon: BrainCircuit,
    },
    {
      label: "Career Intelligence",
      path: "/student/intelligence",
      icon: WandSparkles,
    },
    { label: "Career Readiness", path: "/student/readiness", icon: BarChart3 },
    { label: "What-If Simulator", path: "/student/simulator", icon: WandSparkles },
    { label: "Skill Demand Radar", path: "/student/radar", icon: BarChart3 },
    { label: "Skill Gap Intelligence", path: "/student/gaps", icon: BrainCircuit },
    { label: "90-Day Roadmap", path: "/student/roadmap", icon: KanbanSquare },
    {
      label: "Opportunities",
      path: "/student/opportunities",
      icon: BriefcaseBusiness,
    },
    {
      label: "Applications",
      path: "/student/applications",
      icon: KanbanSquare,
    },
    {
      label: "Portfolio",
      path: "/student/portfolio",
      icon: UserRound,
    },
    {
      label: "Messages",
      path: "/student/messages",
      icon: MessageSquare,
    },
    {
      label: "Notifications",
      path: "/student/notifications",
      icon: Bell,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ],

  faculty: [
    { label: "Dashboard", path: "/faculty", icon: LayoutDashboard },
    { label: "Research", path: "/faculty/research", icon: BrainCircuit },
    { label: "FDPs & Workshops", path: "/faculty/workshops", icon: GraduationCap },
    { label: "Industry Connections", path: "/faculty/collaborations", icon: Handshake },
    { label: "Mentorship", path: "/faculty/mentorship", icon: Users },
    { label: "Opportunities", path: "/faculty/opportunities", icon: BriefcaseBusiness },
    { label: "Projects", path: "/faculty/projects", icon: KanbanSquare },
    { label: "Internships", path: "/faculty/internships", icon: GraduationCap },
    { label: "Consultancy", path: "/faculty/consultancy", icon: Handshake },
    { label: "Applications", path: "/faculty/applications", icon: KanbanSquare },
    { label: "Settings", path: "/settings", icon: Settings },
  ],

  industry: [
    {
      label: "Dashboard",
      path: "/industry",
      icon: LayoutDashboard,
    },
    {
      label: "Opportunities",
      path: "/industry/opportunities",
      icon: BriefcaseBusiness,
    },
    {
      label: "Candidates",
      path: "/industry/candidates",
      icon: Users,
    },
    { label: "AI Talent Search", path: "/industry/talent", icon: Search },
    { label: "Recruitment Pipeline", path: "/industry/pipeline", icon: KanbanSquare },
    { label: "Industry Challenges", path: "/industry/challenges", icon: Handshake },
    { label: "Training & Certifications", path: "/industry/training", icon: GraduationCap },
    { label: "Workshops", path: "/industry/workshops", icon: CalendarDays },
    { label: "Mentorship", path: "/industry/mentorship", icon: Users },
    {
      label: "Applications",
      path: "/industry/applications",
      icon: KanbanSquare,
    },
    {
      label: "Interviews",
      path: "/industry/interviews",
      icon: MessageSquare,
    },
    {
      label: "Analytics",
      path: "/industry/analytics",
      icon: BarChart3,
    },
    {
      label: "Messages",
      path: "/industry/messages",
      icon: MessageSquare,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ],

  institution: [
    {
      label: "Dashboard",
      path: "/institution",
      icon: LayoutDashboard,
    },
    {
      label: "Students",
      path: "/institution/students",
      icon: Users,
    },
    { label: "Career Intelligence", path: "/institution/intelligence", icon: WandSparkles },
    { label: "Faculty Analytics", path: "/institution/faculty-analytics", icon: BarChart3 },
    { label: "Department Analytics", path: "/institution/department-analytics", icon: BarChart3 },
    {
      label: "Skill Analysis",
      path: "/institution/analytics",
      icon: BarChart3,
    },
    {
      label: "Internships",
      path: "/institution/internships",
      icon: BriefcaseBusiness,
    },
    {
      label: "Placements",
      path: "/institution/placements",
      icon: GraduationCap,
    },
    {
      label: "Industry Partners",
      path: "/institution/partners",
      icon: Building2,
    },
   
    { label: "Early Intervention", path: "/institution/early-intervention", icon: Sparkles },
    
    {
      label: "Reports",
      path: "/institution/reports",
      icon: Search,
    },
    {
      label: "Notifications",
      path: "/institution/notifications",
      icon: Bell,
    },
    {
      label: "Settings",
      path: "/institution/settings",
      icon: Settings,
    },
  ],
};

const roleNames: Record<Role, string> = {
  student: "Student",
  faculty: "Academician",
  industry: "Industry",
  institution: "Institution",
};

export function Sidebar({
  role,
  open,
  onClose,
}: {
  role: Role;
  open: boolean;
  onClose: () => void;
}) {
  const location = useLocation();

  const items = groups[role];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-[272px]",
        "border-r border-slate-200/80",
        "bg-white",
        "transition-transform duration-300 ease-out",
        "lg:static lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">

        {/* BRAND HEADER */}
        <div className="relative flex h-[72px] items-center justify-between border-b border-slate-100 px-5">
          <div className="pointer-events-none absolute left-5 top-2 h-10 w-10 rounded-full bg-violet-300/20 blur-xl" />

          <div className="relative">
            <Logo />
          </div>

          <button
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        {/* ROLE HEADER */}
        <div className="px-4 pt-5">
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-[#07051A] via-[#24104F] to-[#2563EB] p-4 text-white shadow-sm">
            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] text-white shadow-lg shadow-violet-500/20">
                <Sparkles size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                  EduLyra
                </p>

                <p className="mt-1 truncate text-sm font-bold">
                  {roleNames[role]} Workspace
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              AI Intelligence Active
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Main Navigation
          </p>

          <nav className="space-y-1">
            {items.map(({ label, path, icon: Icon }) => {
              const active =
                location.pathname === path ||
                (path !== `/${role}` &&
                  location.pathname.startsWith(`${path}/`));

              return (
                <Link
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
                    "text-[13px] font-semibold",
                    "transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-violet-50 to-cyan-50/70 text-violet-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  )}
                >
                  {/* ACTIVE INDICATOR */}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-violet-500" />
                  )}

                  {/* ICON */}
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-all",
                      active
                        ? "bg-violet-500 text-white shadow-md shadow-violet-500/20"
                        : "bg-slate-100 text-slate-500 group-hover:bg-violet-50 group-hover:text-violet-600"
                    )}
                  >
                    <Icon size={16} />
                  </span>

                  {/* LABEL */}
                  <span className="flex-1 truncate">
                    {label}
                  </span>

                  {/* ACTIVE ARROW */}
                  {active && (
                    <ChevronRight
                      size={15}
                      className="text-cyan-500"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* AI CARD */}
        <div className="border-t border-slate-100 p-3">
          <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-4">

            <div className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-violet-300/20 blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2">

                <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-950 text-cyan-300">
                  <BrainCircuit size={15} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Skill Intelligence
                  </p>

                  <p className="text-[9px] font-medium text-slate-400">
                    Powered by EduLyra
                  </p>
                </div>
              </div>

              <p className="mt-3 text-[10px] leading-4 text-slate-500">
                Your skills, opportunities and career journey connected in
                one intelligent ecosystem.
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-700">
                  ● Online
                </span>

                <span className="rounded-full bg-cyan-100 px-2 py-1 text-[9px] font-bold text-cyan-700">
                  AI Ready
                </span>
              </div>
            </div>
          </div>

          <p className="pt-3 text-center text-[9px] font-medium text-slate-400">
            EduLyra • SIH 2026
          </p>
        </div>
      </div>
    </aside>
  );
}