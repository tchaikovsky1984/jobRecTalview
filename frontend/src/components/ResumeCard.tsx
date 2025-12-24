// src/components/ResumeCard.tsx
import { useNavigate } from "react-router-dom";
import ScoreRing from "./ScoreRing.tsx";

export interface ResumeBriefData {
  id: number;
  summary: string;
  recommendations_aggregate: {
    aggregate: {
      avg: {
        score: number | null;
      };
    };
  };
}

interface ResumeCardProps {
  resume: ResumeBriefData;
}

export default function ResumeCard({ resume }: ResumeCardProps) {
  const navigate = useNavigate();

  const totalScore = resume.recommendations_aggregate.aggregate.avg.score || 0;


  return (
    <div
      onClick={() => navigate(`/app/jobs/${resume.id}/prep`)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 
                 hover:shadow-md hover:border-black/30 transition-all cursor-pointer 
                 flex flex-row justify-between items-start gap-4"
    >
      {/* LEFT: Content */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-2 rounded-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h3 className="font-mono font-bold text-lg whitespace-nowrap">Resume #{resume.id}</h3>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed min-h-[2.5em]">
          {resume.summary.substring(0, 72) + "..." || "No summary available."}
        </p>
      </div>
      <div className="shrink-0 pt-1">
        <ScoreRing score={totalScore} maxScore={100} />
      </div>
    </div>
  );
}
