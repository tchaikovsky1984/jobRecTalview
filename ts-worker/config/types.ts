
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
  url: string;
  search_title?: string;
  search_pref_country?: string;
  search_pref_area?: string;
};

export type matchSkillsInput = {
  jobs: Jobs[];
  resume_skills: string[];
};

export type JobsWithSkills = Jobs & {
  matching_skills: string[];
  missing_skills: string[];
};

export type LLMInput = {
  job: JobsWithSkills[];
  resume: RankingWorkflowInput;
}
