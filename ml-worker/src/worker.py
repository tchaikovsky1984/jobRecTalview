import asyncio

from temporalio import activity
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.contrib.pydantic import pydantic_data_converter
from concurrent.futures import ThreadPoolExecutor

from src.workflows import ScrapingJobsWorkflow
from src.activities import scraper

async def main():
    act_exec = ThreadPoolExecutor(max_workers=2)
    client = await Client.connect("localhost:7233", 
                                  namespace="default", 
                                  data_converter=pydantic_data_converter,
                                  )

    worker = Worker(client, 
                    task_queue="scrape-queue", 
                    workflows=[ScrapingJobsWorkflow], 
                    activities=[scraper],
                    activity_executor=act_exec
                    )

    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())
