from datetime import timedelta
from numpy import maximum
from temporalio import workflow
from temporalio.common import RetryPolicy

with workflow.unsafe.imports_passed_through():
    from src.activities import scraper
    from src.activities import embedder
    from src.activities import storer

from src.shared import JobSearchCriteria
from src.shared import DBInsertData
from src.shared import SummariserInput
from src.shared import SummaryType

@workflow.defn
class ScrapingJobsWorkflow:

    @workflow.run
    async def findJobs(self, job_criteria: JobSearchCriteria) -> bool: 

        file_path = await workflow.execute_activity(
                scraper,
                job_criteria,
                schedule_to_close_timeout=timedelta(seconds=600),
                retry_policy=RetryPolicy(maximum_attempts=1)
                )

        embed_file_path = await workflow.execute_activity(
                embedder,
                file_path,
                schedule_to_close_timeout=timedelta(seconds=1200),
                retry_policy=RetryPolicy(maximum_attempts=1)
                )

        insert_info = DBInsertData(
                file_path=embed_file_path, 
                search_title=job_criteria.title or "", 
                search_pref_country=job_criteria.pref_country or "", 
                search_pref_area=job_criteria.pref_area or ""
                )

        final = await workflow.execute_activity(
                storer,
                insert_info,
                schedule_to_close_timeout=timedelta(seconds=120),
                retry_policy=RetryPolicy(maximum_attempts=1)
                )

        return final
