import os
import psycopg2
from dotenv import load_dotenv
from src.shared.local_embedding_utils import local_embedder
from src.activities.summarise_jobs import SummariserActivity

load_dotenv()

RESUME_TEXT_2 = """
DARREN
JONES
Marketing
Manager
CONTACT
Djones@email.com
(123) 456-7890
Brooklyn, NY
LinkedIn
EDUCATION
B.S.
Marketing
University of Pittsburgh
September 2014 - April 2018
Pittsburgh, PA
SKILLS
HubSpot, Salesforce
Microsoft Excel, Word,
Powerpoint
Paid Ads (Facebook, Google,
LinkedIn, Instagram)
A/B testing, audience
segmentation
Google Analytics
SEO
WORK EXPERIENCE
Marketing Manager
Varsity Tutors
May 2023 - current Brooklyn NY
Directed six full-time marketers and three paid contractors,
enhancing team productivity by implementing agile
marketing methodologies
Spearheaded the launch of a campaign for a new educational
product, resulting in revenue of $5.4M in the first year
Streamlined lead management within HubSpot CRM,
facilitating a 32% decrease in lead-to-customer conversion
time
Developed partnerships with higher education institutions in
the US, resulting in an incremental $7M increase in revenue
Identified under-performing vendors, leading to a $451k
reduction in costs while exceeding revenue targets
Marketing Analyst
Edward Jones Financial
August 2019 - May 2023 New York NY
Built a comprehensive paid acquisition strategy across
Google, Facebook, and industry newsletters, attracting new
leads that generated $17M in 2020
Steered a strong brand awareness campaign through
conferences and speaking engagements, leading to a 78%
increase in inbound leads year-over-year
Led the implementation of real-time reporting on marketing
spend to adjust bid strategy, aiding a 27% bump in ROI
Exceeded growth targets every quarter by 24%, leveraging
Google Analytics to identify four high-performing channels
Marketing Analyst Intern
DeltaV Digital
August 2018 - August 2019 Washington DC
Created an A/B testing plan for Facebook ad copy,
contributing to a 21% improvement in ROI
Generated reports in Tableau for the executive team around
KPIs like marketing spend, new leads, revenue generated, and
ROI, saving 16 hours of manual reporting per week
Conducted comprehensive market trend analyses using MS
Excel, identifying key patterns that drove a significant boost
in targeted marketing campaign effectiveness
Supported content marketing initiatives, contributing to an
SEO-optimized blog series that increased website backlinks
by 44% and amplified online visibility
"""

RESUME_TEXT_3 ="""
SALES RESUME EXAMPLE
Memphis, Tennessee | (222) 333-4444
email address | linkedin.com/in/wandasales
SUMMARY OF QUALIFICATIONS
• Extensive experience procuring and cultivating new clients in addition to broad knowledge and
experience in various industries
• Proven track record in achieving and exceeding sales goals, as well as developing and executing
strategic sales and management programs and activities
• Hardworking professional adept at working under pressure and ability to efficiently plan and
complete simultaneous projects
PROFESSIONAL EXPERIENCE
Primary Care Sales Representative August 20XX – October 20XX
XYZ Pharmaceuticals, Memphis Tennessee
• Undertook a variety of sales related tasks and activities with accountability for achieving and
exceeding sales goals
• Planned, coordinated, and facilitated functions to optimize productivity
• Performed extensive competitor analyses of similar products to effectively present products to
customers
• Designed, developed, and presented various promotional, marketing, and advertising tools in order to
raise profits
• Prospected new clients in order to increase sales and profits for a wide array of different products
• Educated clients on new product information
• Provided superior customer service by troubleshooting client concerns and quickly resolving issues
• Maintained accountability for achieving and exceeding monthly and quarterly sales goals
• Developed innovative sales and marketing tactics to effectuate a strong profit margin
AWARDS AND RECOGNITION
• Effectively managed a $2M territory, and was ranked #3 nationally January 20XX
• Named District Representative of the Cycle six times September 20XX – July 20XX
• Regional Representative of the Year 20XX – 20XX
• Star-seller Award Winner – ranked #1 nationally March 20XX
• District Sales Representative of the Year 20XX
• Eastern Region Sales Representative of the Year 20XX
COMMUNITY INVOLVMENT
• Member of Toastmasters April 20XX – Present
• Member of State University Alumni Network May 20XX – Present
EDUCATION & PROFESSIONAL TRAINING
Bachelor of Science in Nursing May 20XX
State University, Memphis, Tennessee GPA: 3.43
Registered Nurse – State of Tennessee May 20XX
"""

def test_matching():
    print("--- Starting Resume Match POC ---")
    
    print("Summarizing Resume...")
    summarizer = SummariserActivity()
    clean_resume = summarizer.summariser(RESUME_TEXT_3) 
    print(f"Summary: {clean_resume[:100]}...")

    print("Vectorizing...")
    resume_vector = local_embedder.embed_text(clean_resume)
    
    print("Searching Database...")
    
    conn = psycopg2.connect(
        dbname=os.getenv("PG_NAME"),
        user=os.getenv("PG_USER"),
        password=os.getenv("PG_SECRET"),
        host=os.getenv("PG_URL"),
        port=os.getenv("PG_PORT")
    )
    
    cur = conn.cursor()
    
    query = """
    SELECT 
        title, 
        company, 
        url, 
        1 - (embedding <=> %s::vector) as similarity_score
    FROM job
    ORDER BY embedding <=> %s::vector ASC
    LIMIT 5;
    """
    
    cur.execute(query, (str(resume_vector), str(resume_vector)))
    rows = cur.fetchall()
    
    print("\n=== TOP 5 MATCHES ===")
    for rank, row in enumerate(rows, 1):
        title, company, url, score = row
        print(f"{rank}. {title} at {company}")
        print(f"   Score: {score:.4f}") 
        print(f"   URL: {url}\n")

    cur.close()
    conn.close()

if __name__ == "__main__":
    test_matching()
