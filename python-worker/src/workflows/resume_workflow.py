from datetime import timedelta
from os import read
from numpy import maximum
from temporalio import workflow
from temporalio.common import RetryPolicy

from src.activities import readPDF
from src.activities import SummariseActivity
from src.activities import res_embedder
from src.activities import res_storer

from src.shared import SummariserInput
from src.shared import SummaryType
from src.shared import ResumeWorkflowInput
from src.shared import ResumeStorerInput

@workflow.defn
class ResumeProcessingWorkflow:

    @workflow.run
    async def processResume(self, resumeInput: ResumeWorkflowInput) -> bool:

        if(not resumeInput.filepath or not resumeInput.res_id or not resumeInput.user_id):
            raise ValueError("Missing Input")

        resume_text = await workflow.execute_activity(
                readPDF,
                resumeInput.filepath,
                schedule_to_close_timeout=timedelta(seconds=20),
                retry_policy=RetryPolicy(maximum_attempts=5)
                )

        llm_response = await workflow.execute_activity_method(
                SummariseActivity.summariser, 
                SummariserInput(
                    text = resume_text, 
                    sum_type = SummaryType.RESUME
                    ), 
                start_to_close_timeout = timedelta(seconds = 60), 
                retry_policy = RetryPolicy(maximum_attempts = 2)
                )

        summary = llm_response.get("summary", "")
        skills = llm_response.get("skills", [])
        
        embedding = await workflow.execute_activity(
                res_embedder,
                summary,
                start_to_close_timeout = timedelta(seconds = 10),
                retry_policy = RetryPolicy(maximum_attempts= 10)
                )

        result = await workflow.execute_activity(
                res_storer,
                ResumeStorerInput(
                    embedding = embedding, 
                    user_id = resumeInput.user_id, 
                    res_id = resumeInput.res_id, 
                    skills = skills, 
                    summary = summary
                ),
                schedule_to_close_timeout = timedelta(seconds = 20),
                retry_policy = RetryPolicy(maximum_attempts= 5)
                )

        return result
