from transformers import AutoTokenizer, AutoModel
import numpy as np
import torch

MODEL = "sentence-transformers/all-MiniLM-L6-v2"

class LocalEmbedder:

    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL)
        self.model = AutoModel.from_pretrained(MODEL)

    def _mean_pooling(self, model_output, attention_mask):
        token_embeddings  = model_output.last_hidden_state
        input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
        return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

    def embed_text(self, text: str) -> list[float]:
        inputs = self.tokenizer(text, padding=True, truncation=True, return_tensors="pt", max_length=512)

        with torch.no_grad():
            model_output = self.model(**inputs)
        
        sentence_embeddings = self._mean_pooling(model_output, inputs['attention_mask'])

        sentence_embeddings = torch.nn.functional.normalize(sentence_embeddings, p=2, dim=1)

        return sentence_embeddings[0].tolist()

# single instance to avoid reloading

local_embedder = LocalEmbedder()
