import { useEffect, useState } from "react";

import { api } from "../services/api";
import ResumeCard from "../components/ResumeCard.tsx";
import type { AppUser, ResumeDetailResponseBody } from "../types/types";
import { GET_RESUME_BRIEF_QUERY } from "../graphql/resume";

interface ResumePageProps {
  user: AppUser;
}

function ResumePage(props: ResumePageProps) {
  const [isLoading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);

  const loadResumes = () => {
    setLoading(true);

    api.post<ResumeDetailResponseBody>(false, "", {
      query: GET_RESUME_BRIEF_QUERY,
      variables: {
        userId: Number(props.user.user_id)
      }
    }, {
      "Authorization": "Bearer " + props.user.access_token
    })
      .then((res) => {
        if (res.data && res.data.resume) {
          setResumes(res.data.resume as any);
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadResumes();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-4xl font-sans font-bold animate-pulse">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 overflow-y-auto">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resumes.map((r: any) => (
          <div key={r.id} className="aspect-4/5 flex flex-col h-full">
            <div className="h-full w-full [&>div]:h-full [&>div]:flex [&>div]:flex-col [&>div]:justify-between">
              <ResumeCard resume={r} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ResumePage;
