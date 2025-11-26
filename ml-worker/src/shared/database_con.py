from typing import Dict
from dotenv import load_dotenv
import os

def loading_vars() -> Dict[str, str]:
    try:
        load_dotenv()
        pg_name = os.getenv("PG_NAME", "chat_app_db")
        pg_url = os.getenv("PG_URL", "localhost")
        pg_port = os.getenv("PG_PORT", "5500")
        pg_user = os.getenv("PG_USER", "chat_user")
        pg_pass = os.getenv("PG_SECRET", "changethispassword")

        db_info = {
            "pg_name": pg_name,
            "pg_url": pg_url,
            "pg_port": pg_port,
            "pg_user": pg_user,
            "pg_pass": pg_pass,
        }

        return db_info
    except Exception as e:
        print(e)
        raise e
