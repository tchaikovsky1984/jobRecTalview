import asyncio

from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.contrib.pydantic import pydantic_data_converter
from concurrent.futures import ThreadPoolExecutor

from src.workflows import ScrapingJobsWorkflow
from src.activities import scraper
from src.activities import embedder
from src.activities import storer

from src.workflows import ResumeProcessingWorkflow
from src.activities import readPDF
from src.activities import res_embedder
from src.activities import SummariseActivity
from src.activities import res_storer

async def main():
    act_exec = ThreadPoolExecutor(max_workers=8)
    summ_instance = SummariseActivity()

    client = await Client.connect("localhost:7233", 
                                  namespace="default", 
                                  data_converter=pydantic_data_converter,
                                  )

    job_worker = Worker(client, 
                    task_queue="scrape-queue", 
                    workflows=[ScrapingJobsWorkflow], 
                    activities=[scraper, embedder, storer],
                    activity_executor=act_exec
                    )
    resume_worker = Worker(client,
                           task_queue="resume-queue",
                           workflows=[ResumeProcessingWorkflow],
                           activities=[readPDF, summ_instance.summariser, res_embedder, res_storer],
                           activity_executor=act_exec
                           )

    await asyncio.gather(
            job_worker.run(),
            resume_worker.run()
    )

if __name__ == "__main__":
    asyncio.run(main())
