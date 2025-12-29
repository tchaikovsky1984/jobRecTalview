import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import type { AppUser, ResumeDataResponse } from "../types/types";
import { GET_RECOMMENDATION_ON_RESUME } from "../graphql/recommendation.ts";
import { GET_RESUME_DATA } from "../graphql/resume.ts";
import { api } from "../services/api.ts";
import JobRow from "../components/JobRow";

interface ResumePrepPageProps {
  user: AppUser;
}

function ResumePrepPage(props: ResumePrepPageProps) {
  const { id } = useParams();
  const ids = Number(id);

  const [recData, setRecData] = useState<any[]>([]);
  const [resData, setResData] = useState<ResumeDataResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);

  const analysisIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchResumeData = async (resumeId: number) => {
    return api.post<any>(false, "", {
      query: GET_RESUME_DATA,
      variables: { resId: resumeId }
    }, { "Authorization": "Bearer " + props.user.access_token });
  }

  const fetchRecs = async (resumeId: number) => {
    return api.post<any>(false, "", {
      query: GET_RECOMMENDATION_ON_RESUME,
      variables: { resId: resumeId }
    }, { "Authorization": "Bearer " + props.user.access_token })
  }

  useEffect(() => {
    setLoading(true);
    fetchResumeData(ids)
      .then((res) => {
        setResData(res.data.resume_by_pk);
      })
      .catch((rej) => {
        console.error("failed resume fetch", rej);
      });
  }, [ids]);

  useEffect(() => {
    if (resData) {
      fetchRecs(ids)
        .then((res) => {
          setRecData(res.data.recommendation || []);
        })
        .catch((rej) => {
          console.error("failed rec fetch", rej);
        })
        .finally(() => setLoading(false));
    }
  }, [resData]);

  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
      if (recsIntervalRef.current) clearInterval(recsIntervalRef.current);
    };
  }, []);


  const pollForAnalysis = () => {
    let attempts = 0;
    const maxAttempts = 30;

    analysisIntervalRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await fetchResumeData(ids);
        const data = res.data?.resume_by_pk;

        const isDone = data && (data.summary || (data.extracted_skills && data.extracted_skills.length > 0));

        if (isDone) {
          setResData(data);
          setIsAnalyzing(false);
          if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
        } else if (attempts >= maxAttempts) {
          setIsAnalyzing(false);
          if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
          alert("Analysis timed out. Please try refreshing the page later.");
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000);
  };

  const pollForRecs = () => {
    let attempts = 0;
    const maxAttempts = 30;

    recsIntervalRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await fetchRecs(ids);
        const data = res.data?.recommendation || [];

        if (data.length > 0) {
          setRecData(data);
          setIsRecommending(false);
          if (recsIntervalRef.current) clearInterval(recsIntervalRef.current);
        } else if (attempts >= maxAttempts) {
          setIsRecommending(false);
          if (recsIntervalRef.current) clearInterval(recsIntervalRef.current);
          alert("Recommendation timed out. Please try refreshing the page later.");
        }
      } catch (err) {
        console.error("Polling recs error", err);
      }
    }, 5000);
  };



  const handleAnalyzeResume = async () => {
    setIsAnalyzing(true);
    try {
      await api.post(true, "/resume/analyse/" + ids, {}, {
        "Authorization": "Bearer " + props.user.access_token
      });

      pollForAnalysis();
    } catch (error) {
      console.error("Analysis failed to start", error);
      alert("Failed to start analysis.");
      setIsAnalyzing(false);
    }
  };

  const handleGenerateRecs = async () => {
    setIsRecommending(true);
    try {
      await api.get(true, "/resume/rank/" + ids, {
        "Authorization": "Bearer " + props.user.access_token
      });

      pollForRecs();
    } catch (error) {
      console.error("Recommendation generation failed to start", error);
      alert("Failed to start recommendation engine.");
      setIsRecommending(false);
    }
  };

  const safeRecs = useMemo(() => {
    return recData.map(rec => ({
      ...rec,
      resume: { id: ids }
    }));
  }, [recData, ids]);

  const skillsList = resData?.extracted_skills || [];
  const isAnalysed = (resData?.summary || (skillsList.length > 0));


  if (loading && !resData) {
    return (
      <div className="w-full h-full flex justify-center items-center gap-3 text-gray-500">
        <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h1 className="text-xl font-mono">Analyzing Profile...</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-hidden bg-gray-50/50">

      <div className="shrink-0 mb-6 bg-white border border-gray-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0 opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Resume Analysis #{ids}</h1>
                <p className="text-sm text-gray-500 font-mono mt-1">
                  {isAnalysed ? `${skillsList.length} skills detected` : "Pending Analysis"}
                </p>
              </div>
            </div>

            {resData?.filepath && (
              <a href={resData.filepath} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:border-blue-300 shadow-sm">
                View PDF
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            )}
          </div>

          {!isAnalysed ? (

            <div className="bg-blue-50/50 rounded-lg p-6 border border-blue-100 flex flex-col items-center justify-center gap-3 text-center transition-all">
              <p className="text-gray-600 text-sm">
                {isAnalyzing ? "Processing resume details..." : "This resume has not been processed yet."}
              </p>
              <button
                onClick={handleAnalyzeResume}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium flex items-center gap-2 transition-all shadow-sm disabled:opacity-80 disabled:cursor-wait"
              >
                {isAnalyzing ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM19.75 11.625a.375.375 0 0 0-.75 0v2.25H16.75a.375.375 0 0 0 0 .75h2.25v2.25a.375.375 0 0 0 .75 0v-2.25H22a.375.375 0 0 0 0-.75h-2.25v-2.25Z" />
                  </svg>
                )}
                {isAnalyzing ? "Analyzing (this may take a moment)..." : "Analyze Resume with AI"}
              </button>
            </div>

            //either or
            // if not analysed yet

          ) : (

            //either or
            // if analysed

            <>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 relative">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-purple-500">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM19.75 11.625a.375.375 0 0 0-.75 0v2.25H16.75a.375.375 0 0 0 0 .75h2.25v2.25a.375.375 0 0 0 .75 0v-2.25H22a.375.375 0 0 0 0-.75h-2.25v-2.25Z" />
                  </svg>
                  AI Generated Summary
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-sans">
                  {resData?.summary || "Summary generation pending."}
                </p>
              </div>
              {skillsList.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {skillsList.map((skill: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-full font-medium shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 px-1 shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">Matched Opportunities</h2>
        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
          {safeRecs.length}
        </span>
      </div>

      <div className="grow overflow-y-auto pr-2 space-y-4 pb-10">

        {safeRecs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 p-6 text-center">

            {isAnalysed ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 mb-2 opacity-50 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="font-medium text-gray-600 mb-1">
                  {isRecommending ? "Scanning Market..." : "Ready to find jobs"}
                </p>
                <p className="text-xs text-gray-400 mb-4 max-w-xs">
                  {isRecommending
                    ? "We are matching your skills against our job database. This runs in the background."
                    : "The resume is analyzed. Click below to scan the job database for matches."}
                </p>

                <button
                  onClick={handleGenerateRecs}
                  disabled={isRecommending}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-80 disabled:cursor-wait"
                >
                  {isRecommending ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                  )}
                  {isRecommending ? "Matching Jobs..." : "Find Job Recommendations"}
                </button>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 mb-2 opacity-50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <p className="font-medium text-gray-400">Analysis Required</p>
                <p className="text-xs text-gray-400 mt-1">Please analyze the resume above to unlock recommendations.</p>
              </>
            )}
          </div>
        ) : (
          safeRecs.map((rec) => (
            <JobRow key={rec.id} rec={rec} />
          ))
        )}
      </div>

    </div>
  );
};

export default ResumePrepPage;
