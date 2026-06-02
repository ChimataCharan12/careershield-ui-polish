export function GaugeChart({ score, size = 220 }: { score: number; size?: number }) {
  const r = size / 2 - 20;
  const cx = size / 2;
  const cy = size / 2 + 10;
  // semicircle from 180 to 0
  const angle = (score / 100) * 180;
  const needleAngle = 180 - angle;
  const needleRad = (needleAngle * Math.PI) / 180;
  const nx = cx + (r - 10) * Math.cos(needleRad);
  const ny = cy - (r - 10) * Math.sin(needleRad);

  const arc = (start: number, end: number, color: string) => {
    const sr = ((180 - start) * Math.PI) / 180;
    const er = ((180 - end) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(sr);
    const y1 = cy - r * Math.sin(sr);
    const x2 = cx + r * Math.cos(er);
    const y2 = cy - r * Math.sin(er);
    const large = end - start > 180 ? 1 : 0;
    return (
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
        stroke={color}
        strokeWidth={18}
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  return (
    <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
      {arc(0, 60, "#22c55e")}
      {arc(60, 120, "#f59e0b")}
      {arc(120, 180, "#ef4444")}
      {/* needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={6} fill="#0f172a" />
      <text x={20} y={cy + 8} fontSize="11" fill="#64748b">0</text>
      <text x={cx - 6} y={20} fontSize="11" fill="#64748b">50</text>
      <text x={size - 30} y={cy + 8} fontSize="11" fill="#64748b">100</text>
    </svg>
  );
}
