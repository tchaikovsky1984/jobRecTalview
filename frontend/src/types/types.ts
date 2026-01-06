interface AuthData {
  access_token: string;
  user_id: string;
  message: string;
}

interface UserProfile {
  username: string;
  name: string;
  email: string;
}

export interface AppUser extends AuthData, UserProfile { }

export type ResumeDetailResponseBody = {
  data: {
    resume: {
      id: number;
      summary: string;
      aggregate: {
        avg: {
          score: number | null
        }
      }
    }[]
  }
};

export type ResumeUploadResponse = {
  message: string;
  resumeId?: number;
  detail?: string;
};

export type ResumeDataResponse = {
  id: number;
  summary: string;
  extracted_skills: string[];
  filepath: string;
};

export type RecommendationDataResponse = {
  data: {
    recommendation_by_pk: {
      id: number;
      score: number;
      reasoning: string;
      skill_matches: string[];
      skill_misses: string[];
      job: {
        title: string;
        company: string;
        location: string | null;
        description: string;
      };
      prep: {
        id: number;
        topics: string[];
        tips: string[];
        questions: {
          topic: string;
          answer: string;
          question: string;
        }[];
      }[];
    }
  }
};

export type RecommedationData = {
  id: number;
  score: number;
  reasoning: string;
  skill_matches: string[];
  skill_misses: string[];
  job: {
    title: string;
    company: string;
    location: string | null;
    description: string;
  };
  prep: {
    id: number;
    topics: string[];
    tips: string[];
    questions: {
      topic: string;
      answer: string;
      question: string;
    }[];
  }[];
};

export type PrepareRecResponse = {
  data: {
    PrepareRec: {
      message: string;
      workflowId: string;
    }
  }
};

export type AllRecommendationsResponse = {
  data: {
    recommendation: {
      id: number;
      score: number;
      reasoning: string;
      skill_matches: string[];
      skill_misses: string[];
      resume: {
        id: number;
        summary: string;
      }
      job: {
        id: number;
        title: string;
        location: string | null;
        description: string;
      }
    }[];
  }
}

export type AllRecommendations = {
  id: number;
  score: number;
  reasoning: string;
  skill_matches: string[];
  skill_misses: string[];
  resume: {
    id: number;
    summary: string;
  }
  job: {
    id: number;
    title: string;
    location: string | null;
    description: string;
  }

}[];

export type LoginResponse = {
  data: {
    LoginUser: {
      user_id: string;
      access_token: string;
      message: string;
    }
  }
};

export type UserResponse = {
  data: {
    user: {
      username: string;
      name: string;
      email: string;
    }
  }
};

export type ResumeFetchResponse = {
  data: {
    resume_by_pk: ResumeDataResponse;
  }
};

export type RecommendationsOnResumeRespone = {
  data: {
    recommendation: {
      id: number;
      score: number;
      reasoning: string;
      skill_matches: string[];
      skill_misses: string[];
      job: {
        id: number;
        title: string;
        company: string;
        location: string | null;
        description: string;
      }
    }[];
  };
};

export type AnalyseResumeResponse = {
  data: {
    AnalyseResume: {
      message: string;
      workflowID: string;
    };
  };
};

export type GenerateRecsResponse = {
  data: {
    RankJobs: {
      message: string;
      workflowId: string;
    }
  };
};

