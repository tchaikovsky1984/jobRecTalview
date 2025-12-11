import json
import pandas as pd
import ast
import numpy as np
from python_graphql_client import GraphqlClient
from temporalio import activity
from src.shared.database_con import loading_vars
from src.shared.pg_array_helper import to_pg_array

from src.shared import DBInsertData

INSERT_JOBS_MUTATION = """
mutation InsertScrapedJobs($objects: [job_insert_input!]!){
  insert_job(
    objects: $objects
    on_conflict: {
      constraint: job_url_key
      update_columns: []
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
def storer(insert_info: DBInsertData) -> bool:
    try:
        df = pd.read_csv(insert_info.file_path)

        if 'embedding' in df.columns:
            df['embedding'] = df['embedding'].apply(
                lambda x: json.loads(x) if isinstance(x, str) else x
            )

        if 'skills_list' in df.columns:
            df['skills_list'] = df['skills_list'].apply(
                lambda x: ast.literal_eval(x) if isinstance(x, str) else (x if isinstance(x, list) else [])
            )

        df = df.replace({np.nan: None})

        db_info = loading_vars()
        client = GraphqlClient(endpoint=db_info.get("hasura_url", "localhost:8080/v1/graphql/"))
        headers = {
                "x-hasura-admin-secret": db_info.get("hasura_admin_secret", "changethispassword")
        }

        jobs_payload = []

        for _, row in df.iterrows():
            embedding_val = row.get("embedding")
            if isinstance(embedding_val, (list, np.ndarray)):
                embedding_val = json.dumps(embedding_val.tolist() if isinstance(embedding_val, np.ndarray) else embedding_val)
            elif isinstance(embedding_val, str):
                pass
            skills_val = row.get("skills_list")
            skills_formatted = None
            
            if isinstance(skills_val, str):
                try:
                    # 1. Parse string literal to Python List
                    skills_list = ast.literal_eval(skills_val)
                    # 2. Convert Python List to Postgres Array String
                    skills_formatted = to_pg_array(skills_list)
                except:
                    skills_formatted = "{}"
            elif isinstance(skills_val, list):
                 skills_formatted = to_pg_array(skills_val)

            # --- Build Object ---
            job_obj = {
                "title": row.get("title"),
                "company": row.get("company"),
                "description": row.get("description") or "",
                "location": row.get("location"),
                "url": row.get("job_url"), # Matches 'url' in DB column
                "embedding": embedding_val, 
                "skills": skills_formatted, # Pass the String "{...}"
                
                # Context fields from Activity Input
                "search_title": insert_info.search_title,
                "search_pref_country": insert_info.search_pref_country,
                "search_pref_area": insert_info.search_pref_area
            }
            jobs_payload.append(job_obj)

        if not jobs_payload:
            print("No records to insert.")
            return True

        response = client.execute(
            query=INSERT_JOBS_MUTATION,
            variables={"objects": jobs_payload},
            headers=headers
        )

        if "errors" in response:
            raise Exception(f"GraphQL Errors: {response['errors']}")

        affected = response["data"]["insert_job"]["affected_rows"]
        skipped = len(jobs_payload) - affected

        print(f"Inserted {affected} rows.")
        print(f"Skipped {skipped} rows due to conflict.")

        return True


    except Exception as e:
        print(e)
        raise e
