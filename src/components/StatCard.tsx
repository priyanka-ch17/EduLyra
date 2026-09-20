import type { LucideIcon } from "lucide-react";
export function StatCard({ label, value, hint, icon: Icon, trend }: { label:string; value:string|number; hint?:string; icon:LucideIcon; trend?:string }) {
  return <div className="card p-5">
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>{hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}</div>
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon size={20}/></div>
    </div>
    {trend && <div className="mt-4 text-xs font-semibold text-emerald-600">{trend}</div>}
  </div>;
}