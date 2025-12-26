interface SkillPillProps {
  name: string;
  variant?: 'neutral' | 'match' | 'miss';
}

export default function SkillPill({ name, variant = 'neutral' }: SkillPillProps) {
  const styles = {
    neutral: "bg-gray-200 text-gray-800 border-gray-300 border rounded-xl",
    match: "bg-green-100 text-green-800 border-green-200 rounded-xl",
    miss: "bg-red-50 text-red-800 border-red-100 decoration-red-300 line-through rounded-xl"
  };

  return (
    <span className={`px-2 py-1 text-xs md:text-sm font-mono border rounded-md ${styles[variant]}`}>
      {name}
    </span>
  );
}
