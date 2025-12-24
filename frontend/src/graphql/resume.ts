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
