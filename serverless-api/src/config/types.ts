export type LogType = "LOG" | "ERR" | "WAR";

export type DatabaseConfig = {
  PG_URL: string;
  PG_PORT: number;
  PG_NAME: string;
  PG_USER: string;
  PG_SECRET: string;
};

export type RegisterRequestBody = {
  username: string;
  email: string;
  name: string;
  password: string;
};

export type LoginRequestBody = {
  username: string;
  password: string,
};

export type LoginResponseBody = {
  access_token: string;
  user_id: string;
  message: string;
};

export type ResumeAnalysisParam = {
  id: number;
};

export type ResumeWorkflowInput = {
  res_id: number;
  user_id: number;
  filepath: string;
};

export type RankingWorkflowInput = {
  user_id: number;
  resume_id: number;
  title?: string;
  location?: string;
};

export type InterviewPrepWorkflowInput = {
  recId: number;
};

export type JobSearchWorkflowInput = {
  title: string;
  pref_country?: string;
  pref_area?: string;
};
