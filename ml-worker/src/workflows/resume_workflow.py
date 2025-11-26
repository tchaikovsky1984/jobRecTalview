from datetime import timedelta
from os import read
from numpy import maximum
from temporalio import workflow
from temporalio.common import RetryPolicy

from shared.datamodels import ResumeStorerInput, ResumeWorkflowInput, SummariserInput, SummaryType
from src.activities import readPDF
from src.activities import SummariseActivity
from src.activities import res_embedder
from src.activities import res_storer

from src.shared SummariserInput
from src.shared SummaryType
from src.shared ResumeWorkflowInput
from src.shared ResumeStorerInput

@workflow.defn
class ResumeProcessingWorkflow:

    @workflow.run
    async def processResume(self, resumeInput: ResumeWorkflowInput | None = None) -> bool:
        # emulating input
        user_id = 1
        res_id = 1
        filepath = "~/dev/jobRecTalview/samples/uploads/resume1.pdf"

        resume_text = await workflow.execute_activity(
                readPDF,
                "~/dev/jobRecTalview/samples/uploads/resume1.pdf",
                schedule_to_close_timeout=timedelta(seconds=20),
                retry_policy=RetryPolicy(maximum_attempts=5)
                )

        llm_response = await workflow.execute_activity_method(
                SummariseActivity.summariser, 
                SummariserInput(
                    text = resume_text, 
                    sum_type = SummaryType.RESUME
                    ), 
                start_to_close_timeout = timedelta(seconds = 20), 
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
                ResumeStorerInput(embedding = embedding, user_id = user_id, res_id = res_id),
                schedule_to_close_timeout = timedelta(seconds = 20),
                retry_policy = RetryPolicy(maximum_attempts= 5)
                )

        return result
