interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function Sparkline({ data, width = 120, height = 36, color = '#6366f1' }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padX = 4;
  const padY = 4;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * innerW;
    const y = padY + (1 - (v - min) / range) * innerH;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');

  const lastPt = points[points.length - 1].split(',');
  const lastX = parseFloat(lastPt[0]);
  const lastY = parseFloat(lastPt[1]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx={lastX} cy={lastY} r="3" fill={color} />
    </svg>
  );
}
