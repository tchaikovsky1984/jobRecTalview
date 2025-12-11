import json
from numpy import var
from python_graphql_client import GraphqlClient
from temporalio import activity

from src.shared.database_con import loading_vars
from src.shared import ResumeStorerInput
from src.shared.pg_array_helper import to_pg_array

HASURA_UPDATE_QUERY = """
mutation StoreProcessedResume($id: Int!, $user_id: Int!, $embedding: vector!, $summary: String!, $skills: _text!){
  update_resume(
    where: {
      _and: [ 
        {id: 
          {_eq: $id}
        }, 
        {user_id: 
          {_eq: $user_id}
        } 
      ]
    }, 
    _set: {
      embedding: $embedding, 
      summary: $summary,
      extracted_skills: $skills
    }
  )
  {
    affected_rows
    returning
    {
      id
    }
  }
}
"""

@activity.defn
def res_storer(resInfo: ResumeStorerInput) -> bool:
    try: 

        db_info = loading_vars()
        client = GraphqlClient(endpoint=db_info.get("hasura_url", "localhost:8080/v1/graphql"))
        header = {
                "x-hasura-admin-secret": db_info.get("hasura_admin_secret", "nope")
        }
        variables = {
            "id": resInfo.res_id,
            "user_id": resInfo.user_id,
            "summary": resInfo.summary,
            "embedding": json.dumps(resInfo.embedding),
            "skills": to_pg_array(resInfo.skills)
        }
        response = client.execute(variables=variables, query=HASURA_UPDATE_QUERY, headers=header)

        if "errors" in response:
            raise Exception(f"Hasura Error: {response['errors']}")

        affected_rows = response["data"]["update_resume"]["affected_rows"]

        if affected_rows == 0:
            print(f"Resume {resInfo.res_id} not found or doesn't belong to user {resInfo.user_id}")
            return False

        return True

    except Exception as e:
        print(e)
        raise(e)
