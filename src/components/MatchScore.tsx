export function MatchScore({ value, size="md" }: { value:number; size?: "sm"|"md"|"lg" }) {
  const cls = size === "lg" ? "h-24 w-24 text-xl" : size === "sm" ? "h-12 w-12 text-xs" : "h-16 w-16 text-sm";
  return <div className={`${cls} relative grid place-items-center rounded-full font-bold text-brand-700`} style={{background:`conic-gradient(#4f46e5 ${value * 3.6}deg, #e2e8f0 0)`}}>
    <div className="absolute inset-1 grid place-items-center rounded-full bg-white">{value}%</div>
  </div>;
}