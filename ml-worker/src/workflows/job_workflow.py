from datetime import timedelta
from temporalio import workflow
from temporalio.common import RetryPolicy

with workflow.unsafe.imports_passed_through():
    from src.activities import scraper

from src.shared import JobSearchCriteria

@workflow.defn
class ScrapingJobsWorkflow:

    @workflow.run
    async def findJobs(self) -> str: 

        job_criteria = JobSearchCriteria(title="AI Engineer", pref_country="India", num=100)

        answer = await workflow.execute_activity(
                scraper,
                job_criteria,
                schedule_to_close_timeout=timedelta(seconds=300),
                retry_policy=RetryPolicy(maximum_attempts=1)
                )

        return answer 
