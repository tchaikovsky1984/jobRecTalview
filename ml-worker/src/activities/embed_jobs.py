import pandas as pd
import os
import uuid
from temporalio import activity

from src.shared.local_embedding_utils import local_embedder

@activity.defn
def embedder(path: str) -> str:
    print("============EMBEDDING ACTIVITY STARTED================")
    
    if path.startswith("~"):
        path = os.path.expanduser(path)

    try:
        df = pd.read_csv(path)
        print(f"csv read: {len(df)} rows")

        # Added context labels to help the AI understand the text better
        df['combined_text'] = (
            "Title: " + df['title'].fillna("Unknown") + 
            "; Company: " + df["company"].fillna("Unknown") + 
            "; Description: " + df["description"].fillna("")
        ).str.slice(0, 500) # <-- Take FIRST 500 chars

        embeddings = []

        # Loop with explicit error checking per row
        for i, text in enumerate(df["combined_text"]):
            try:
                print(f"Embedding row {i}") # Uncomment if stuck
                vector = local_embedder.embed_text(text)
                embeddings.append(vector)
            except Exception as e:
                print(f"CRITICAL ERROR on row {i}: {e}")
                raise e # Stop here, don't return empty file

        df['embedding'] = embeddings

        df = df.drop(columns=["combined_text"])

        STORAGE_DIR = os.path.expanduser("~/dev/jobRecTalview/samples/jobs/")
        os.makedirs(STORAGE_DIR, exist_ok=True) # Ensure dir exists
        
        file_name = f"embed_jobs_{uuid.uuid4()}.csv"
        new_path = os.path.join(STORAGE_DIR, file_name)
        
        df.to_csv(new_path, index=False)
        print(f"stored at: {new_path}")
        df.info()

        return new_path

    except Exception as e:
        print(f"Activity Failed: {e}")
        raise e 
