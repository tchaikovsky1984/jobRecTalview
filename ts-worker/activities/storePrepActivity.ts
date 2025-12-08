import { getDBClient } from "../config/db";
import { StoringPrepInput } from "../config/types";

export async function storePrepActivity(prep: StoringPrepInput): Promise<boolean> {
  const client = getDBClient();
  if (client instanceof Error) {
    console.log("Could not get DB");
    throw client;
  }

  const storeQuery = `INSERT INTO interview_prep(recommendation_id, questions, tips, topics)
                      VALUES ( $1, $2, $3, $4)
                      ON CONFLICT (recommendation_id) DO UPDATE
                      SET questions = EXCLUDED.questions, tips = EXCLUDED.tips, topics = EXCLUDED.topics;`;

  await client.query(storeQuery, [prep.recommendation_id, JSON.stringify(prep.prep.questions), prep.prep.tips, prep.prep.topics]);

  return true;
}
