import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
export function PlacementChart({data}:{data:any[]}) {
 return <div className="h-72 w-full"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="month" tickLine={false} axisLine={false}/><YAxis tickLine={false} axisLine={false}/><Tooltip/><Bar dataKey="placements" fill="#4f46e5" radius={[6,6,0,0]}/><Bar dataKey="internships" fill="#94a3b8" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>;
}