import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { minioClient, ensureBucketExists } from "./config/minioClient.ts";
import { gqlSdk } from "./config/graphqlClient.ts";
import { v4 as uuidv4 } from "uuid";

export async function controller(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  try {
    const eventbody = JSON.parse(event.body || "{}");
    const userId = eventbody.session_variables['x-hasura-user-id'];
    const { mimetype, file64, filename } = eventbody.input || {};

    if (!filename || !file64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ "message": "No data provided" })
      };
    }

    if (file64.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ "message": "Empty file provided" })
      };
    }

    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ "message": "User not provided" })
      };
    }

    const fileBuffer = Buffer.from(file64, 'base64');

    const objectName = `${userId}/${Date.now()}_${uuidv4()}.${filename.split(".").at(-1)}`;
    const bucketName = "resumes";

    await ensureBucketExists();
    await minioClient.putObject(
      bucketName,
      objectName,
      fileBuffer,
      fileBuffer.length,
      { "Content-Type": mimetype }
    );

    const result = await gqlSdk.InsertResume({ user_id: userId, filepath: objectName });
    console.log(result);

    const resumeId = result.insert_resume_one?.id;
    if (!resumeId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ "message": "Could not upload resume" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ "message": "Resume Uploaded", "resumeId": resumeId })
    };
  }

  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ "message": "Error", "detail": (e as Error).message })
    };
  }

}
