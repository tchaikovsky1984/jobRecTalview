import os
import time
import json
import re
from google.genai import Client
from google.genai import types
from dotenv import load_dotenv
from temporalio import activity
from src.shared import SummariserInput
from src.shared import SummaryType

class SummariseActivity:

    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = Client(api_key=self.api_key)
        self.RATE_LIMIT_DELAY = 4.1

    @activity.defn
    def summariser(self, summariserInput: SummariserInput) -> dict:
        text = summariserInput.text
        sum_type = summariserInput.sum_type

        if(sum_type == SummaryType.JOB):
            prompt = f"""Role: Expert HR Analyst.
                         Task: Extract job title, role relevant text, skills, requirements, and responsibilities.
                         Input Text:
                         {text[:10000]}

                         Instructions:
                         1. SUMMARY: Write a dense, 256-word max summary of responsibilities and requirements. Return a single, dense paragraph. No markdown formatting (bolding/bullets). Focus ONLY on technical skills and hard requirements.
                         2. SKILLS: Extract a list of technical hard skills. 
                            - STANDARDIZE them (e.g., "React.js" -> "React", "JS" -> "JavaScript", "TS" -> "TypeScript", "AWS Cloud" -> "AWS").
                            - Exclude soft skills (e.g., "Leadership", "Communication").

                        Output Format:
                        You MUST return valid JSON with exactly these keys:
                        {{
                            "summary": "string",
                            "skills": ["string", "string"]
                        }}
                    """

            try:
                time.sleep(self.RATE_LIMIT_DELAY)

                response = self.client.models.generate_content(
                    model = "gemini-2.5-flash-lite",
                    contents = prompt,
                    config = types.GenerateContentConfig(
                        response_mime_type = "application/json",
                        temperature = 0.1
                        )
                    )

                raw_text = response.text or "{}"
                print(raw_text)
                clean_text = raw_text.strip()
                clean_text = re.sub(r"^```json\s*", "", clean_text, flags=re.IGNORECASE)
                clean_text = re.sub(r"^```\s*", "", clean_text)
                clean_text = re.sub(r"\s*```$", "", clean_text)

                return json.loads(clean_text)

            except Exception as e:
                print(e)
                raise e

        else:
            # SummaryType.RESUME case
            try:
                prompt= f"""
                        Role: Expert Technical Recruiter and Candidate Profiler.
                        Task: Analyze the Resume text and extract structured data for matching against Job Descriptions.
                        Input Text: {text[:15000]}
        
                        Instructions:
                        1. SUMMARY: Write a dense, 256-word max professional profile. 
                            - Focus on: Total years of experience, primary domains (e.g., Backend, AI/ML), key achievements, and tech stack proficiency.
                            - Convert "I did X" to professional 3rd-person phrasing (e.g., "Experienced Software Engineer with...").
                        2. SKILLS: Extract a list of technical hard skills.
                            - STANDARDIZE them exactly like the Job Descriptions (e.g., "React.js" -> "React", "JS" -> "JavaScript", "TS" -> "TypeScript", "AWS Cloud" -> "AWS").
                            - Exclude soft skills (e.g., "Hard worker", "Punctual") unless they are technical methodologies (e.g., "Agile", "Scrum").
                        Output Format:
                        You MUST return valid JSON with exactly these keys:
                        {{
                            "summary": "string",
                            "skills": ["string", "string"]
                        }}
                        """
                time.sleep(self.RATE_LIMIT_DELAY)

                response = self.client.models.generate_content(
                    model = "gemini-2.5-flash-lite",
                    contents = prompt,
                    config = types.GenerateContentConfig(
                        response_mime_type = "application/json",
                        temperature = 0.1
                        )
                    )

                raw_text = response.text or "{}"
                print(raw_text)
                clean_text = raw_text.strip()
                clean_text = re.sub(r"^```json\s*", "", clean_text, flags=re.IGNORECASE)
                clean_text = re.sub(r"^```\s*", "", clean_text)
                clean_text = re.sub(r"\s*```$", "", clean_text)

                return json.loads(clean_text)

            except Exception as e:
                print(e)
                raise(e)


