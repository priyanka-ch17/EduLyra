import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  CircleUserRound,
  Sparkles,
  Target,
} from 'lucide-react';

import { getMyData, getOpportunities } from '../services/store';
import { StatCard } from '../components/StatCard';
import { ProgressBar } from '../components/ProgressBar';
import { MatchScore } from '../components/MatchScore';
import { OpportunityCard } from '../components/OpportunityCard';

// Feedback component
import { FeedbackSection } from './StudentPages';

export function StudentDashboard() {
  const u: any = getMyData();
  const a = u?.assessment;
  const apps = u?.applications || [];
  const learning = u?.learning || [];

  const goal = String(
    u?.profile?.desiredJobRole || u?.profile?.careerGoal || ''
  ).toLowerCase();

  const skills = u?.profile?.currentSkills || [];

  const ops = getOpportunities()
    .filter((o) => ['Job', 'Internship'].includes(o.type))
    .map((o) => ({
      ...o,
      match: Math.min(
        99,
        50 +
          o.skills.filter((x: string) =>
            skills.some(
              (s: string) => s.toLowerCase() === x.toLowerCase()
            )
          ).length *
            10 +
          (`${o.title} ${o.description}`
            .toLowerCase()
            .includes(goal)
            ? 25
            : 0)
      ),
    }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  const readiness = a?.overall || 0;

  const gaps = a?.gaps || [
    'Cloud Computing',
    'System Design',
    'Testing',
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-600">
              Student workspace
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Welcome, {u?.name} 👋
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your career journey connects assessment, Skill Gap Analysis,
              learning, opportunities and applications.
            </p>
          </div>

          <Link
            className="btn-primary"
            to="/student/assessment"
          >
            {a ? 'Retake assessment' : 'Start assessment'}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Industry Readiness"
          value={a ? `${readiness}/100` : 'Not assessed'}
          hint={a ? 'Based on latest assessment' : 'Complete assessment'}
          icon={Target}
        />

        <StatCard
          label="Skill Gaps"
          value={String(gaps.length)}
          hint="Priority skills to develop"
          icon={Sparkles}
        />

        <StatCard
          label="Applications"
          value={String(apps.length)}
          hint="Tracked per account"
          icon={BriefcaseBusiness}
        />

        <StatCard
          label="Learning Progress"
          value={
            learning.length
              ? `${Math.round(
                  learning.reduce(
                    (x: any, y: any) => x + y.progress,
                    0
                  ) / learning.length
                )}%`
              : '0%'
          }
          hint="Courses & certifications"
          icon={BookOpen}
        />
      </div>

      {/* Latest Assessment */}
      {a && (
        <section className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-bold">
                Latest Skill Assessment
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Full details are available in My Skills / Profile;
                this dashboard snapshot appears only after completion.
              </p>
            </div>

            <div className="grid h-20 w-20 place-items-center rounded-full bg-cyan-50 text-2xl font-black text-cyan-700">
              {a.overall}%
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-4">
            <ProgressBar
              label="Technical"
              value={a.technical}
            />

            <ProgressBar
              label="Soft Skills"
              value={a.soft}
            />

            <ProgressBar
              label="Aptitude"
              value={a.aptitude}
            />

            <ProgressBar
              label="Communication"
              value={a.communication}
            />
          </div>
        </section>
      )}

      {/* Skill Intelligence and AI Career Advisor */}
      <section className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">
                Skill Intelligence
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Strengths and Skills to Develop
              </p>
            </div>

            <Link
              className="text-sm font-bold text-cyan-700"
              to="/student/skills"
            >
              View profile
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {(u?.profile?.currentSkills || [
              'Complete assessment to generate skill scores',
            ])
              .slice(0, 6)
              .map((s: string, i: number) => (
                <ProgressBar
                  key={s}
                  label={s}
                  value={
                    a?.overall
                      ? Math.min(96, a.overall + i * 3)
                      : 0
                  }
                />
              ))}
          </div>
        </div>

        <div className="rounded-3xl bg-[#07151d] p-6 text-white">
          <div className="flex items-center gap-2">
            <Sparkles
              className="text-cyan-300"
              size={18}
            />

            <h2 className="font-bold">
              AI Career Advisor
            </h2>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Your recommendations use career goals, current skills,
            assessment scores and industry requirements.
            Terminology is standardized to{' '}
            <b className="text-white">Skill Gap</b>.
          </p>

          <div className="mt-5 space-y-2">
            {gaps.map((g: string) => (
              <div
                className="rounded-xl border border-white/10 p-3 text-sm"
                key={g}
              >
                {g}

                <span className="float-right text-amber-300">
                  Develop
                </span>
              </div>
            ))}
          </div>

          <Link
            className="mt-5 inline-flex w-full justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950"
            to="/student/careers"
          >
            Open Career Advisor
          </Link>
        </div>
      </section>

      {/* Recommended Opportunities */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold">
              Recommended Opportunities
            </h2>

            <p className="text-xs text-slate-400">
              Matched to your profile and goals
            </p>
          </div>

          <Link
            className="text-sm font-bold text-cyan-700"
            to="/student/opportunities"
          >
            Browse all
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {ops.map((o) => (
            <OpportunityCard
              key={o.id}
              opportunity={o}
            />
          ))}
        </div>
      </section>

      {/* Career Intelligence Hub */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-cyan-50 p-6">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-cyan-300">
            <Sparkles size={21} />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-black">
                New: Career Intelligence Hub
              </h2>

              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-violet-700">
                AI powered
              </span>
            </div>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Explore your AI Career Twin, simulate career choices,
              compare skill demand, follow an adaptive roadmap,
              verify your Skill Passport and discover industry
              projects.
            </p>
          </div>

          <Link
            className="btn-primary shrink-0"
            to="/student/intelligence"
          >
            Explore Intelligence
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Portfolio and Resume */}
      <section className="card p-5">
        <div className="flex items-center gap-3">
          <CircleUserRound className="text-cyan-600" />

          <div>
            <h2 className="font-bold">
              Portfolio & Resume
            </h2>

            <p className="text-sm text-slate-500">
              Completed courses, certifications, internships and
              projects automatically update your digital profile.
            </p>
          </div>

          <Link
            className="ml-auto btn-secondary"
            to="/student/portfolio"
          >
            Open
          </Link>
        </div>
      </section>

      {/* Feedback Section */}
      <FeedbackSection />
    </div>
  );
}