import parser from "lambda-multipart-parser";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { minioClient, ensureBucketExists } from "./config/minioClient.ts";
import { gqlSdk } from "./config/graphqlClient.ts";
import { v4 as uuidv4 } from "uuid";

export async function controller(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  const multipartData = event.body;
  try {
    if (!multipartData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ "message": "No data provided" })
      };
    }

    console.log(event.headers["Authorization"]);
    const parsedEvent = await parser.parse(event);
    console.log(parsedEvent);

    if (!parsedEvent.files || parsedEvent.files.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ "message": "No file provided" })
      };
    }

    if (parsedEvent.files[0].fieldname !== "resume") {
      return {
        statusCode: 400,
        body: JSON.stringify({ "message": "Formdata fielname incorrect" })
      };
    }

    console.log(event.requestContext);
    const userId = Number(event.requestContext.authorizer?.userId);
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ "message": "User not provided" })
      };
    }

    const file = parsedEvent.files[0];
    const fileBuffer = file.content;
    const filename = file.filename;
    const mimeType = file.contentType;

    const objectName = `${userId}/${Date.now()}_${uuidv4()}.${filename.split(".").at(-1)}`;
    const bucketName = "resumes";

    await ensureBucketExists();
    await minioClient.putObject(
      bucketName,
      objectName,
      fileBuffer,
      fileBuffer.length,
      { "Content-Type": mimeType }
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
