import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { GET_RECOMMENDATION_WITH_PREP } from "../graphql/recommendation.ts";
import ScoreRing from "../components/ScoreRing";
import SkillPill from "../components/SkillPill";
import type { AppUser } from "../types/types";

interface JobPrepPageProps {
  user: AppUser;
}

export default function JobPrepPage({ user }: JobPrepPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState<any>(null);

  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchFromHasura = () => {
    return api.post<any>(false, "", {
      query: GET_RECOMMENDATION_WITH_PREP,
      variables: { id: Number(id) }
    }, { "Authorization": "Bearer " + user.access_token });
  };

  const loadData = () => {
    setLoading(true);
    fetchFromHasura()
      .then(res => {
        if (res.data?.recommendation_by_pk) {
          setData(res.data.recommendation_by_pk);
        } else {
          alert("Recommendation not found");
          navigate("/app/jobs");
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) loadData();
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [id]);

  const handleGeneratePrep = async () => {
    setGenerating(true);

    try {
      await api.get(true, `/recommendation/prep/${id}`, {
        "Authorization": "Bearer " + user.access_token
      });

      let attempts = 0;
      pollInterval.current = setInterval(async () => {
        attempts++;
        try {
          const res = await fetchFromHasura();
          const freshData = res.data?.recommendation_by_pk;

          if (freshData?.prep && freshData.prep.length > 0) {
            setData(freshData);
            setGenerating(false);
            if (pollInterval.current) clearInterval(pollInterval.current);
          }

          if (attempts > 15) {
            setGenerating(false);
            if (pollInterval.current) clearInterval(pollInterval.current);
            alert("Generation is taking longer than usual. Please refresh manually in a moment.");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);

    }
    catch (e) {
      setGenerating(false);
      alert("Failed to start generation workflow");
      console.error(e);
    }
  };

  if (loading || !data) return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-2xl font-mono animate-pulse text-gray-500">Loading Prep Context...</h1>
    </div>
  );

  const { job } = data;
  const prep = data.prep && data.prep.length > 0 ? data.prep[0] : null;

  return (
    <div className="w-full h-full p-6 overflow-y-auto">

      <div className="bg-white rounded-xl border border-gray-300 shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{job.title}</h1>
            <h2 className="text-xl text-gray-600 font-mono mt-1">
              {job.company} • {job.location || "Remote/Unspecified"}
            </h2>
          </div>
          <div className="flex flex-col items-center">
            <ScoreRing score={data.score} size={70} />
            <span className="text-xs font-mono text-gray-400 mt-2 uppercase tracking-widest">Match</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {data.skill_matches?.map((s: string, i: number) => <SkillPill key={i} name={s} variant="match" />)}
          {data.skill_misses?.map((s: string, i: number) => <SkillPill key={i} name={s} variant="miss" />)}
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-gray-700 text-sm leading-relaxed">
          <strong>Why this match?</strong> {data.reasoning}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-bold font-mono text-gray-800 border-b pb-2">Interview Preparation</h3>

        {!prep ? (
          <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16 text-gray-400 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <h4 className="text-xl font-bold text-gray-700 mb-2">Ready to prepare?</h4>
            <p className="text-gray-500 max-w-md mb-6">
              Generate a custom interview guide based on your resume gaps and this specific job description.
            </p>
            <button
              onClick={handleGeneratePrep}
              disabled={generating}
              className={`
                px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center gap-2
                ${generating ? "bg-gray-400 cursor-wait" : "bg-black hover:bg-gray-800 hover:-translate-y-1"}
              `}
            >
              {generating && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {generating ? "Generating Guide..." : "Generate Interview Prep"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="flex flex-col gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  Focus Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prep.topics?.map((topic: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm">
                <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  Strategic Tips
                </h4>
                <ul className="space-y-3">
                  {prep.tips?.map((tip: string, i: number) => (
                    <li key={i} className="text-sm text-amber-900 flex items-start gap-2 leading-tight">
                      <span className="mt-1.5 min-w-[6px] min-h-[6px] rounded-full bg-amber-500" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-bold text-gray-800 mb-2">Technical & Behavioral Questions</h4>
              {prep.questions?.map((qObj: any, i: number) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors group">
                  {qObj.topic && (
                    <span className="inline-block px-2 py-0.5 mb-2 text-xs font-bold text-blue-600 bg-blue-50 rounded uppercase tracking-wide">
                      {qObj.topic}
                    </span>
                  )}
                  <p className="font-medium text-gray-900 mb-3 text-lg">
                    <span className="text-blue-500 font-mono mr-2">Q{i + 1}.</span>
                    {qObj.question}
                  </p>
                  {qObj.answer && (
                    <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm text-slate-700 mt-2">
                      <strong className="text-slate-900 block mb-1">Key Talking Points:</strong>
                      {qObj.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
