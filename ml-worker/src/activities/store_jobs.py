import requests
import pandas as pd
from temporalio import activity


@activity.defn
def storer(file_path: str) -> bool:
    try:
        df = pd.read_csv(file_path)
        df.info()
        return True
    except Exception as e:
        print(e)
        return False
