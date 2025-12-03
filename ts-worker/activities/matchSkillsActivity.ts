import { matchSkillsInput } from "../config/types.ts";
import { JobsWithSkills } from "../config/types";

export async function matchSkillsActivity(matchingInput: matchSkillsInput): Promise<JobsWithSkills[]> {
  const resume_skills = new Set(matchingInput.resume_skills.map(s => s.toLowerCase())); // for O(1) lookup (not much but honest work)
  let jobsOuput: JobsWithSkills[] = [];

  for (const job of matchingInput.jobs) {
    let missing_skills: string[] = [];
    let matching_skills: string[] = [];

    if (!job.skills) {
      matching_skills = [];
      missing_skills = [];
    }

    else {
      for (const skill of job.skills.map(s => s.toLowerCase())) {
        if (resume_skills.has(skill)) {
          matching_skills.push(skill);
        }
        else {
          missing_skills.push(skill);
        }
      }
    }

    jobsOuput.push({ ...structuredClone(job), matching_skills: matching_skills, missing_skills: missing_skills });
  }

  return jobsOuput as JobsWithSkills[];
}
