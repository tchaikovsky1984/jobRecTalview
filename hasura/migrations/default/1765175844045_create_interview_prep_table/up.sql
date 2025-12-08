CREATE TABLE interview_prep (
    id SERIAL PRIMARY KEY,
    recommendation_id INT NOT NULL REFERENCES recommendation(id) ON DELETE CASCADE,

    questions JSONB, 
    topics TEXT[],    
    tips TEXT[],       

    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(recommendation_id) 
);
