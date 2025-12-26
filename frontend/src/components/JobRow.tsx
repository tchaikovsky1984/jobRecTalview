import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ScoreRing from "./ScoreRing";
import SkillPill from "./SkillPill";

interface JobRowProps {
  rec: any;
}

export default function JobRow({ rec }: JobRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-row items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-white transition-colors"
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold font-sans text-gray-800" onClick={(e) => { e.stopPropagation; navigate(`/app/jobs/${rec.id}/prep`) }}>{rec.job.title}</h3>
          <p className="text-sm font-mono text-gray-500">
            {rec.job.company} • {rec.job.location}
          </p>
          <span className="inline-block bg-gray-200 rounded px-2 py-0.5 text-xs font-mono text-gray-600 w-fit mt-1">
            Matched Resume #{rec.resume.id}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="block text-xs text-gray-400 font-mono uppercase">Match Score</span>
          </div>
          <ScoreRing score={rec.score} size={50} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
            className={`size-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden border-t border-gray-100">
          <div className="p-6 bg-white flex flex-col gap-6">

            <div>
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-purple-600">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM19.75 11.625a.375.375 0 0 0-.75 0v2.25H16.75a.375.375 0 0 0 0 .75h2.25v2.25a.375.375 0 0 0 .75 0v-2.25H22a.375.375 0 0 0 0-.75h-2.25v-2.25Z" />
                </svg>
                Why this job?
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm bg-purple-50 p-4 rounded-lg border border-purple-100">
                {rec.reasoning || "No detailed reasoning provided by the engine."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <h5 className="font-bold text-sm text-green-700 mb-2 uppercase tracking-wide">Skill Matches</h5>
                <div className="flex flex-wrap gap-2">
                  {rec.skill_matches?.length > 0
                    ? rec.skill_matches.map((skill: string, i: number) => (
                      <SkillPill key={i} name={skill} variant="match" />
                    ))
                    : <span className="text-gray-400 text-xs italic">No specific matches logged</span>
                  }
                </div>
              </div>

              <div>
                <h5 className="font-bold text-sm text-red-700 mb-2 uppercase tracking-wide">Missing Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {rec.skill_misses?.length > 0
                    ? rec.skill_misses.map((skill: string, i: number) => (
                      <SkillPill key={i} name={skill} variant="miss" />
                    ))
                    : <span className="text-gray-400 text-xs italic">No missing skills detected</span>
                  }
                </div>
              </div>

            </div>

            <div className="pt-4 border-t">
              <h4 className="font-bold text-gray-900 mb-2">Job Description</h4>
              <p className="text-gray-500 text-sm line-clamp-6 hover:line-clamp-none transition-all cursor-text">
                {rec.job.description}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
