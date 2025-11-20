from datetime import timedelta
from temporalio import workflow
from temporalio.common import RetryPolicy
from typing import List, Dict, Any

from .utils.datamodels import JobSearchCriteria

@workflow.defn
class ScrapingJobsWorkflow:

    @workflow.run
    async def findJobs(self) -> List[Dict[str, Any]]:
        job_criteria = JobSearchCriteria(title="AI Engineer", pref_country="India")

        answer = await workflow.execute_activity(
                "scraper",
                job_criteria,
                schedule_to_close_timeout=timedelta(seconds=300),
                retry_policy=RetryPolicy(maximum_attempts=1)
                )

        return answer 
