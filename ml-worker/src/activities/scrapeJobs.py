from jobspy import scrape_jobs
from typing import List, Dict, Any
from temporalio import activity

from .utils.datamodels import JobSearchCriteria

@activity.defn
async def scraper(job_search_criteria: JobSearchCriteria) -> List[Dict[str, Any]]:
    print("============ACTIVITY STARTED================")
    jobtitle = job_search_criteria.title
    pref_country = job_search_criteria.pref_country
    pref_area = job_search_criteria.pref_area
    no_of_output = job_search_criteria.num
    if jobtitle==None:
        if pref_country==None:
            if pref_area==None:
                jobs = scrape_jobs(
                        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor", "google"],
                        results_wanted=no_of_output,
                        hours_old=72,
                        )
            else:
                jobs = scrape_jobs(
                        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor", "google"],
                        results_wanted=no_of_output,
                        hours_old=72,
                        location=pref_area
                        )
        else:
            if pref_area==None:
                jobs = scrape_jobs(
                        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor", "google"],
                        results_wanted=no_of_output,
                        hours_old=72,
                        country_indeed=pref_country
                        )
            else:
                jobs = scrape_jobs(
                        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor", "google"],
                        results_wanted=no_of_output,
                        hours_old=72,
                        country_indeed=pref_country,
                        location=pref_area
                        )
    else:
        if pref_country==None:
            if pref_area==None:
                jobs = scrape_jobs(
                        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor", "google"],
                        search_term=jobtitle,
                        google_search_term=jobtitle,
                        results_wanted=no_of_output,
                        hours_old=72,
                        )
            else:
                jobs = scrape_jobs(
                        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor", "google"],
                        search_term=jobtitle,
                        google_search_term=jobtitle,
                        results_wanted=no_of_output,
                        hours_old=72,
                        location=pref_area
                        )
        else:
            if pref_area==None:
                jobs = scrape_jobs(
                        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor", "google"],
                        search_term=jobtitle,
                        google_search_term=jobtitle,
                        results_wanted=no_of_output,
                        hours_old=72,
                        country_indeed=pref_country
                        )
            else:
                jobs = scrape_jobs(
                        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor", "google"],
                        search_term=jobtitle,
                        google_search_term=jobtitle,
                        results_wanted=no_of_output,
                        hours_old=72,
                        country_indeed=pref_country,
                        location=pref_area,
                        )
    if not jobs.empty:
        jobs = jobs.drop('date_posted', axis=1)
        activity.logger.info(type(jobs.columns))
        job_list_data = jobs.to_dict('records')
        activity.logger.info(f"Scraped and converted {len(job_list_data)} jobs from a Dataframe to a list of dictionaries which is JSON serialisable")
        return job_list_data
    else:
        activity.logger.info("Scraper returned empty. Returning an empty list")
        return []


