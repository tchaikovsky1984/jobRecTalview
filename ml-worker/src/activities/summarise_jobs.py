import os
import time
from google.genai import Client
from dotenv import load_dotenv
from temporalio import activity

class SummariserActivity:

    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = Client(api_key=self.api_key)
        self.RATE_LIMIT_DELAY = 4.1

    @activity.defn
    def summariser(self, text: str) -> str:
        prompt = f"""Role: Expert HR Analyst.
    Task: Extract job title, role relevant text, skills, requirements, and responsibilities.
    Input Text:
    {text[:10000]}
    
    Output Requirements:
    1. Return a single, dense paragraph.
    2. No markdown formatting (bolding/bullets).
    3. Focus ONLY on technical skills and hard requirements.
    4. 256 words maximum
    """

        try:
            time.sleep(self.RATE_LIMIT_DELAY)
            
            response = self.client.models.generate_content(
                    model = "gemini-2.5-flash-lite",
                    contents = prompt
                    )

            return response.text or  ""

        except Exception as e:
            print(e)
            raise e
