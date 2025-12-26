import { useEffect, useState } from "react";
import { api } from "../services/api";
import { GET_ALL_RECOMMENDATIONS } from "../graphql/recommendation.ts";
import JobRow from "../components/JobRow";
import type { AppUser } from "../types/types";

interface JobsPageProps {
  user: AppUser;
}

export default function JobsPage({ user }: JobsPageProps) {
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState<any[]>([]);

  const [stats, setStats] = useState({ avgScore: 0, totalRecs: 0, topSkill: "N/A" });

  useEffect(() => {
    setLoading(true);
    api.post<any>(false, "", {
      query: GET_ALL_RECOMMENDATIONS,
      variables: { userId: Number(user.user_id) }
    }, { "Authorization": "Bearer " + user.access_token })
      .then(res => {
        const data = res.data?.recommendation || [];
        setRecs(data);
        calculateInsights(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const calculateInsights = (data: any[]) => {
    if (data.length === 0) return;

    const total = data.length;
    const avg = data.reduce((acc, curr) => acc + curr.score, 0) / total;

    const skillMap: Record<string, number> = {};
    data.forEach(r => {
      r.skill_matches?.forEach((s: string) => skillMap[s] = (skillMap[s] || 0) + 1);
    });
    const topSkill = Object.entries(skillMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    setStats({
      totalRecs: total,
      avgScore: Math.round(avg),
      topSkill: topSkill
    });
  };

  if (loading) return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-2xl font-mono animate-pulse text-gray-500">Analysing Market...</h1>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-hidden">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
        <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm flex flex-col">
          <span className="text-xs font-mono text-gray-400 uppercase">Total Opportunities</span>
          <span className="text-3xl font-bold text-gray-800">{stats.totalRecs}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm flex flex-col">
          <span className="text-xs font-mono text-gray-400 uppercase">Average Match Score</span>
          <span className={`text-3xl font-bold ${stats.avgScore > 70 ? 'text-green-600' : 'text-yellow-600'}`}>
            {stats.avgScore}%
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm flex flex-col">
          <span className="text-xs font-mono text-gray-400 uppercase">Top Matched Skill</span>
          <span className="text-3xl font-bold text-purple-600 truncate" title={stats.topSkill}>
            {stats.topSkill}
          </span>
        </div>
      </div>

      <div className="grow overflow-y-auto pr-2 space-y-4 pb-10">
        {recs.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            No recommendations yet. Upload a resume to start!
          </div>
        ) : (
          recs.map((rec) => <JobRow key={rec.id} rec={rec} />)
        )}
      </div>

    </div>
  );
}
