from typing import List
from temporalio import activity

from src.shared.local_embedding_utils import local_embedder

@activity.defn
def res_embedder(resume_text: str) -> List[float]:
    try:
        embedding = local_embedder.embed_text(resume_text)
        return embedding

    except Exception as e:
        print(e)
        raise(e)
