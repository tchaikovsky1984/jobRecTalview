
export type DatabaseConfig = {
  PG_URL: string;
  PG_PORT: number;
  PG_NAME: string;
  PG_USER: string;
  PG_SECRET: string;
};

export type RankingWorkflowInput = {
  user_id: number;
  resume_id: number;
  title?: string;
  location?: string;
};

export type Jobs = {
  id: number;
  title: string;
  company: string;
  description?: string;
  skills?: string[];
  experience?: number;
  embedding: number[];
  location: string;
  url: string;
  search_title?: string;
  search_pref_country?: string;
  search_pref_area?: string;
};

export type GetJobsOutput = {
  jobs: Jobs[];
  resume_skills: string[];
  summary: string;
};

export type matchSkillsInput = {
  jobs: Jobs[];
  resume_skills: string[];
};

export type JobsWithSkills = Jobs & {
  matching_skills: string[];
  missing_skills: string[];
};

export type LLMJobInput = {
  job: JobsWithSkills[];
  resume: RankingWorkflowInput;
  summary: string;
}

export type LLMJobOutputSingleton = {
  job_id: number;
  score: number;
  reasoning: string;
  matching_skills: string[];
  missing_skills: string[];
}

export type LLMJobOutput = {
  llmOuput: LLMJobOutputSingleton[];
  resume: RankingWorkflowInput;
}

export type InterviewPrepWorkflowInput = {
  recId: number;
}

export type RecJob = {
  title: string;
  company: string;
  description: string;
  skills: string[];
  location: string;
};

export type RecResume = {
  extracted_skills: string[];
  summary: string;
}

export type Recommendation = {
  id: number;
  res_id: number;
  job_id: number;
  job: RecJob;
  resume: RecResume;
  score: number;
  reasoning: string;
  skill_matches: string[];
  skill_misses: string[];
}

export type QuesAns = {
  question: string;
  answer: string;
  topic: string;
};

export type LLMPrepOutput = {
  questions: QuesAns[];
  tips: string[];
  topics: string[];
};

export type StoringPrepInput = {
  prep: LLMPrepOutput;
  recommendation_id: number;
};
