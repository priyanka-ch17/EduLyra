export function ProgressBar({ value, label, showValue = true }: { value:number; label?:string; showValue?:boolean }) {
  return <div className="space-y-1.5">
    {(label || showValue) && <div className="flex justify-between text-xs"><span className="font-medium text-slate-600">{label}</span>{showValue && <span className="font-semibold text-slate-500">{value}%</span>}</div>}
    <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-600 transition-all duration-700" style={{width:`${Math.min(100,Math.max(0,value))}%`}} /></div>
  </div>;
}