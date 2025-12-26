export const GET_ALL_RECOMMENDATIONS = `
  query GetAllRecommendations($userId: Int!) {
    recommendation(
      where: { resume: { user_id: { _eq: $userId } } }, 
      order_by: { score: desc }
    ) {
      id
      score
      reasoning
      skill_matches
      skill_misses
      
      resume {
        id
        summary
      }

      job {
        id
        title
        company
        location
        description
      }
    }
  }
`;

export const GET_RECOMMENDATION_WITH_PREP = `
  query GetRecommendationWithPrep($id: Int!) {
    recommendation_by_pk(id: $id) {
      id
      score
      reasoning
      skill_matches
      skill_misses
      
      job {
        title
        company
        location
        description
      }

      prep {
        id
        topics
        tips
        questions
      }
    }
  }
`;

export const GET_RECOMMENDATION_ON_RESUME = `
  query GetAllRecommendations($resId: Int!) {
    recommendation(
      where: { resume: { id: { _eq: $resId } } }, 
      order_by: { score: desc }
    ) {
      id
      score
      reasoning
      skill_matches
      skill_misses
     
      job {
        id
        title
        company
        location
        description
      }
    }
  }
`;
