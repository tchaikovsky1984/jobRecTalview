interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
}

export default function ScoreRing({ score, maxScore = 100, size = 60 }: ScoreRingProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  let color = "text-red-500";
  if (percentage >= 60) color = "text-green-500";
  else if (percentage >= 40) color = "text-yellow-500";

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <span className={`absolute text-xs font-bold ${color}`}>
        {Math.round(percentage)}%
      </span>

      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="text-gray-200"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
      </svg>
    </div>
  );
}
