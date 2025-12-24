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

export type UserDetailResponseBody = {
  data: {
    user: {
      username: string;
      name: string;
      email: string;
    }[]
  }
}

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
