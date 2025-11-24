from datetime import timedelta
from numpy import maximum
from temporalio import workflow
from temporalio.common import RetryPolicy

with workflow.unsafe.imports_passed_through():
    from src.activities import scraper
    from src.activities import embedder
    from src.activities import storer

from src.shared import JobSearchCriteria

@workflow.defn
class ScrapingJobsWorkflow:

    @workflow.run
    async def findJobs(self) -> bool: 

        job_criteria = JobSearchCriteria(title="AI Engineer", pref_country="India", num=300)

        answer = await workflow.execute_activity(
                scraper,
                job_criteria,
                schedule_to_close_timeout=timedelta(seconds=300),
                retry_policy=RetryPolicy(maximum_attempts=1)
                )

        result = await workflow.execute_activity(
                embedder,
                answer,
                schedule_to_close_timeout=timedelta(seconds=600),
                retry_policy=RetryPolicy(maximum_attempts=1)
                )

        final = await workflow.execute_activity(
                storer,
                result,
                schedule_to_close_timeout=timedelta(seconds=30),
                retry_policy=RetryPolicy(maximum_attempts=1)
                )

        return final
