import json
import pandas as pd
import os
import psycopg2
import ast
import numpy as np
from psycopg2.extras import execute_values
from typing import Dict
from temporalio import activity
from dotenv import load_dotenv
from src.shared.database_con import loading_vars

from src.shared import DBInsertData

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
        conn = psycopg2.connect(
                database=db_info["pg_name"], 
                user=db_info["pg_user"], 
                host=db_info["pg_url"], 
                port=db_info["pg_port"], 
                password=db_info["pg_pass"]
                )
        cursor = conn.cursor() 

        records = df.to_dict("records")

        l = []
        for row in records:
            l.append((row["title"], 
                      row["company"], 
                      row["description"] if row["description"] is not None else "", 
                      row["location"], 
                      row["embedding"], 
                      row["job_url"], 
                      insert_info.search_title, 
                      insert_info.search_pref_country, 
                      insert_info.search_pref_area, 
                      row["skills_list"]))

        query = """
                INSERT
                INTO job (title, company, description, location, embedding, url, search_title, search_pref_country, search_pref_area, skills)
                VALUES %s
                ON CONFLICT (url)
                DO NOTHING
                """

        execute_values(
                cursor,
                query,
                l
                )

        inserted_row_count = cursor.rowcount

        print(f"inserted {(inserted_row_count)} rows")
        print(f"skipped {len(records) - inserted_row_count} due to conflict")

        conn.commit()
        cursor.close()
        conn.close()

        return True
    except Exception as e:
        print(e)
        raise e
