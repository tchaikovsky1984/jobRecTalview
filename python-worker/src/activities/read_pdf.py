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
