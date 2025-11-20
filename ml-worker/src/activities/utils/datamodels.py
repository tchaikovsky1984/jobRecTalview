"""
This module defines class JobSearchCritera, which is used to pass data to 
activity scrapeJobsActivity in a single object
"""

from pydantic import BaseModel, Field
from typing import Optional

class JobSearchCriteria(BaseModel):
    """
    Defines the criteria for job scraping. Inherits from BaseModel for 
    automatic validation and JSON serialization/deserialization.
    """
    title: Optional[str] = Field(default=None)
    pref_country: Optional[str] = Field(default=None)
    pref_area: Optional[str] = Field(default=None)
    num: int = Field(default=100) # Number of job outputs / search domain

    @property
    def valid_countries(self):
        return ['argentina', 'australia', 'austria', 'bahrain', 'belgium', 'brazil', 'canada', 'chile', 'china', 'colombia', 'costa rica', 'czech republic', 'czechia', 'denmark', 'ecuador', 'egypt', 'finland', 'france', 'germany', 'greece', 'hong kong', 'hungary', 'india', 'indonesia', 'ireland', 'israel', 'italy', 'japan', 'kuwait', 'luxembourg', 'malaysia', 'malta', 'mexico', 'morocco', 'netherlands', 'new zealand', 'nigeria', 'norway', 'oman', 'pakistan', 'panama', 'peru', 'philippines', 'poland', 'portugal', 'qatar', 'romania', 'saudi arabia', 'singapore', 'south africa', 'south korea', 'spain', 'sweden', 'switzerland', 'taiwan', 'thailand', 'türkiye', 'turkey', 'ukraine', 'united arab emirates', 'uk', 'united kingdom', 'usa', 'us', 'united states', 'uruguay', 'venezuela', 'vietnam', 'usa/ca', 'worldwide']

    # Custom logic (can be handled on initialization if needed, like your original logic)
    def model_post_init(self, _context) -> None:
        if self.pref_country and self.pref_country.lower() not in self.valid_countries:
            self.pref_country = None
        
        # Ensure title/area are None if empty string was passed
        if self.title == "": self.title = None
        if self.pref_area == "": self.pref_area = None
