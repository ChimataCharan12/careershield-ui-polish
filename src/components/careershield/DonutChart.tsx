interface Slice {
  value: number;
  color: string;
  label: string;
}

export function DonutChart({
  slices,
  size = 200,
  thickness = 28,
  centerLabel,
  centerSub,
}: {
  slices: Slice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const r = size / 2 - thickness / 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  let acc = 0;
  const c = 2 * Math.PI * r;

  // Scale center text relative to chart size so it always fits inside the donut
  const labelSize = Math.round(size * 0.18);
  const subSize = Math.max(10, Math.round(size * 0.07));

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} stroke="#f1f5f9" strokeWidth={thickness} fill="none" />
        {slices.map((s, i) => {
          const len = (s.value / total) * c;
          const dash = `${len} ${c - len}`;
          const offset = -((acc / total) * c);
          acc += s.value;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              stroke={s.color}
              strokeWidth={thickness}
              fill="none"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      {(centerLabel || centerSub) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
          {centerLabel && (
            <div className="font-bold text-foreground" style={{ fontSize: labelSize, lineHeight: 1 }}>
              {centerLabel}
            </div>
          )}
          {centerSub && (
            <div className="text-muted-foreground mt-1" style={{ fontSize: subSize, lineHeight: 1 }}>
              {centerSub}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
