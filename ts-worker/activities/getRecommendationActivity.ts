import { InterviewPrepWorkflowInput, RecJob, Recommendation, RecResume } from "../config/types";
import { gqlSdk } from "../config/graphqlClient.ts";

export async function getRecommendationActivity(recommendationId: InterviewPrepWorkflowInput): Promise<Recommendation> {

  try {
    const recQueryResult = await gqlSdk.SelectRecommendationWithId({ id: recommendationId.recId });
    const recommendation = recQueryResult.recommendation[0];
    if (!recommendation) throw new Error("No such recommendation");

    // Faster parallel execution
    const [jobResult, resumeResult] = await Promise.all([
      gqlSdk.SelectJobById({ id: recommendation.job_id }),
      gqlSdk.SelectResumeSkillSum({ id: Number(recommendation.res_id) })
    ]);

    const job: RecJob = jobResult.job[0] as RecJob;

    const resume: RecResume = resumeResult.resume[0] as RecResume;

    if (!job || !resume) throw new Error("No such resume or job");

    return { ...recommendation, job: job, resume: resume } as Recommendation;
  }
  catch (e) {
    console.log(e);
    throw e;
  }
}
