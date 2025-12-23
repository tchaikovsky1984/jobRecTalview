import { useEffect, useState } from "react";

import { api } from "../services/api";
import type { LoginResponseBody } from "../types/types";

interface ResumePageProps {
  user: LoginResponseBody;
}
function ResumePage(props: ResumePageProps) {
  const [isLoading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);

  const loadResumes = () => {
    setLoading(true);
    console.log(props.user);
    const response = api.post(false, "", {
      "query": "query GetResume($userId: Int!){ resume(where: {user_id: {_eq: $userId}}) { id summary } }",
      "variables": {
        "userId": 1
      }
    },
      {
        "Authorization": "Bearer " + props.user.access_token
      });

    response.then(
      (res) => {
        setResumes((res as any).data.resume);
      }
    );
    setLoading(false);
  };

  useEffect(loadResumes, []);

  if (isLoading) {
    return <h1>Loading...</h1>
  }
  else {
    return <h1>Loaded</h1>
    //return resumes.map((r) => (<div id={(r as any).id}><h1>{(r as any).id}</h1><p>{(r as any).summary}</p></div>));
  }

}

export default ResumePage;
