import json
import psycopg2
from temporalio import activity

from src.shared.database_con import loading_vars
from src.shared import ResumeStorerInput

@activity.defn
def res_storer(resInfo: ResumeStorerInput) -> bool:
    try: 

        db_info = loading_vars()
        conn = psycopg2.connect(
            database=db_info["pg_name"], 
            user=db_info["pg_user"], 
            host=db_info["pg_url"], 
            port=db_info["pg_port"], 
            password=db_info["pg_pass"]
            )
        cursor = conn.cursor()

        payload = (json.dumps(resInfo.embedding), resInfo.summary, resInfo.skills, resInfo.res_id, resInfo.user_id)

        query = f"""
            UPDATE resume
            SET embedding = %s, summary = %s, extracted_skills = %s
            WHERE id = %s AND user_id = %s 
            """
        cursor.execute(query, payload) 

        conn.commit()
        cursor.close()
        conn.close()

        return True

    except Exception as e:
        print(e)
        raise(e)
