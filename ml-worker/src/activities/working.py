import asyncio

import pydantic
from temporalio import activity
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.contrib.pydantic import PydanticDataConverter

from .jobworkflows import ScrapingJobsWorkflow
from .scrapeJobs import scraper

async def main():
    client = await Client.connect("localhost:7233", namespace="default", data_converter=PydanticDataConverter())
    worker = Worker(client, task_queue="scrape-queue", workflows=[ScrapingJobsWorkflow], activities=[scraper])
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())
