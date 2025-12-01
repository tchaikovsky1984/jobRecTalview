import pandas as pd
import os
import uuid
from temporalio import activity

from .summarise_jobs import SummariseActivity

from src.shared.local_embedding_utils import local_embedder
from src.shared import SummariserInput
from src.shared import SummaryType

summarise_jobs = SummariseActivity()

@activity.defn
def embedder(path: str) -> str:
    print("============EMBEDDING ACTIVITY STARTED================")
    if path.startswith("~"):
        path = os.path.expanduser(path)

    try:
        df = pd.read_csv(path)
        print(f"csv read: {len(df)} rows")

        df['combined_text'] = (
            "Title: " + df['title'].fillna("Unknown") + 
            "; Company: " + df["company"].fillna("Unknown") + 
            "; Description: " + df["description"].fillna("")
        ).str.slice(0, 15000)

        embeddings = []
        extracted_text = []
        skills_list = []

        # Loop with explicit error checking per row
        for i, text in enumerate(df["combined_text"]):
            try:
                print(f"Summarising row {i}")
                print("returned text----------------------")
                response = summarise_jobs.summariser(SummariserInput(text = text, sum_type = SummaryType.JOB))

                summary = response.get("summary", "")
                skills = response.get("skills", [])

                if summary == "":
                    summary = text 

                print(f"Embedding row {i}-----------------") # Uncomment if stuck
                vector = local_embedder.embed_text(summary)

                embeddings.append(vector)
                extracted_text.append(summary)
                skills_list.append(skills)

            except Exception as e:
                print(f"CRITICAL ERROR on row {i}: {e}")
                raise e 

        df['embedding'] = embeddings
        df['summary'] = extracted_text
        df['skills_list'] = skills_list

        df = df.drop(columns=["combined_text"])

        STORAGE_DIR = os.path.expanduser("~/dev/jobRecTalview/samples/jobs/")
        os.makedirs(STORAGE_DIR, exist_ok=True) # Ensure dir exists
        
        file_name = f"embed_jobs_{uuid.uuid4()}.csv"
        new_path = os.path.join(STORAGE_DIR, file_name)
        
        df.to_csv(new_path, index=False)
        print(f"stored at: {new_path}")

        return new_path

    except Exception as e:
        print(f"Activity Failed: {e}")
        raise e 
