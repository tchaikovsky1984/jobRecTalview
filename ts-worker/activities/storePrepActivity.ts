import { StoringPrepInput } from "../config/types";
import { gqlSdk } from "../config/graphqlClient";
import { toPgArray } from "./storeRankingActivity";

export async function storePrepActivity(prep: StoringPrepInput): Promise<number> {
  try {
    const storeResult = await gqlSdk.UpsertPrepForRec({ rec_id: prep.recommendation_id, questions: prep.prep.questions, tips: toPgArray(prep.prep.tips), topics: toPgArray(prep.prep.topics) });
    if (!storeResult.insert_interview_prep_one?.id) {
      throw new Error("Could not store")
    }
    return storeResult.insert_interview_prep_one.id;
  }
  catch (e) {
    console.log(e);
    throw e;
  }
}
