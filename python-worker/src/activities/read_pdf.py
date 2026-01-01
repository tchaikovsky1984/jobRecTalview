import io
import os
from temporalio import activity
from PyPDF2 import PdfReader
from minio import Minio
from minio.error import S3Error

# Configuration (Matches your Docker/Local setup)
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "172.17.0.1:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
BUCKET_NAME = "resumes"

@activity.defn
def readPDF(filepath: str) -> str:
    """
    Downloads a PDF from MinIO and extracts its text.
    filepath: The Object Key (e.g., "14/173566_resume.pdf")
    """
    client = Minio(
        MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False  # False because we are using HTTP (Localhost)
    )

    try:
        # 1. Get the object from MinIO
        # response is a stream of data
        response = client.get_object(BUCKET_NAME, filepath)
        
        # 2. Read data into memory (BytesIO)
        # This creates a "virtual file" in RAM
        pdf_file_in_memory = io.BytesIO(response.read())
        
        # Close the MinIO stream connection
        response.close()
        
        # 3. Parse PDF from memory
        reader = PdfReader(pdf_file_in_memory)
        text = ""
        
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
                
        activity.logger.info(f"Successfully extracted {len(text)} characters from {filepath}")
        return text

    except S3Error as e:
        activity.logger.error(f"MinIO Download Error: {e}")
        raise e
    except Exception as e:
        activity.logger.error(f"PDF Parsing Error: {e}")
        raise e

"""
from temporalio import activity
from PyPDF2 import PdfReader

@activity.defn
def readPDF(filepath: str) -> str:
    try:
        reader = PdfReader(filepath)
        text = ""
        for page in reader.pages:
            text = text + page.extract_text() + "\n"
        return text

    except Exception as e:
        print(e)
        raise e
"""
