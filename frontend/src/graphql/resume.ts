export const GET_RESUME_BRIEF_QUERY = `
  query GetResume($userId: Int!){ 
    resume(where: {user_id: {_eq: $userId}}){ 
      id 
      summary
      recommendations_aggregate{
        aggregate{
          avg{
            score
          }
        }
      }
    } 
  }
`;

export const GET_RESUME_DATA = `
  query GetResumeData($resId: Int!){
    resume_by_pk(id: $resId){
      id
      summary
      extracted_skills
      filepath
    }
  }
`;

export const UPLOAD_RESUME = `
  mutation UploadResume($filedata: String!, $name: String!, $filety: String!){
    UploadResume(file64: $filedata, filename: $name, mimetype: $filety){
      message
      resumeId
    }
  }
`;

export const ANALYSE_RESUME_QUERY = `
  mutation ResumeAnalysis($res_id: String!) {
    AnalyseResume(id: $res_id){
      message
      workflowID
    }
  }
`;
