import { Sparkles, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-3"
      aria-label="EduLyra"
    >
      {/* LOGO MARK */}
      <div className="relative shrink-0">
        {/* Glow */}
        <div className="absolute -inset-2 rounded-2xl bg-violet-500/20 blur-lg transition-all duration-500 group-hover:bg-violet-400/35" />

        {/* Main logo */}
        <div className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-violet-400/20 bg-[#07051A] shadow-xl shadow-violet-500/15 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-violet-300/40 group-hover:shadow-violet-500/25">
          {/* Decorative circle */}
          <div className="absolute -right-4 -top-4 h-10 w-10 rounded-full bg-cyan-400/10" />

          <div className="absolute -bottom-5 -left-3 h-8 w-8 rounded-full bg-violet-400/10" />

          {/* Target ring */}
          <div className="absolute h-7 w-7 rounded-full border border-cyan-400/20" />

          {/* Main icon */}
          <Target
            size={21}
            strokeWidth={2.2}
            className="relative z-10 text-cyan-300 transition-transform duration-300 group-hover:rotate-12"
          />

          {/* Spark */}
          <Sparkles
            size={9}
            className="absolute right-2 top-2 text-fuchsia-300"
          />

          {/* Energy */}
          <Zap
            size={8}
            fill="currentColor"
            className="absolute bottom-2 right-2 text-cyan-300"
          />
        </div>
      </div>

      {/* BRAND TEXT */}
      {!compact && (
        <div className="leading-none">
          {/* Main name */}
          <div className={`text-[18px] font-black tracking-[-0.03em] ${dark ? "text-white" : "text-slate-900"}`}>
            Edu
            <span className="text-violet-400">Lyra</span>
          </div>

          {/* Tagline */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-cyan-500" />

            <span className={`text-[8px] font-extrabold uppercase tracking-[0.19em] ${dark ? "text-slate-400" : "text-slate-400"}`}>
              Guiding talent toward tomorrow
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}