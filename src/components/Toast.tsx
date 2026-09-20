import { CheckCircle2, X } from "lucide-react";
export function Toast({ message, onClose }: { message:string; onClose:()=>void }) {
  return <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-xl"><CheckCircle2 className="text-emerald-600" size={20}/><p className="text-sm font-medium text-slate-700">{message}</p><button onClick={onClose}><X size={16}/></button></div>;
}