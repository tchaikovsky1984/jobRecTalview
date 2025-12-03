ALTER TABLE public.recommendation
ADD COLUMN skill_match_id INTEGER;

CREATE TABLE public.skill_match (
    id SERIAL PRIMARY KEY,
    res_id INTEGER NOT NULL REFERENCES public.resume(id) ON UPDATE RESTRICT ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES public.job(id) ON UPDATE RESTRICT ON DELETE CASCADE,
    matches TEXT[],
    misses TEXT[],
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

WITH restored_rows AS (
    INSERT INTO public.skill_match (res_id, job_id, matches, misses, analysis_date)
    SELECT 
        res_id, 
        job_id, 
        skill_matches, 
        skill_misses, 
        analysis_date 
    FROM public.recommendation
    WHERE skill_matches IS NOT NULL OR skill_misses IS NOT NULL
    RETURNING id, res_id, job_id
)

UPDATE public.recommendation r
SET skill_match_id = rr.id
FROM restored_rows rr
WHERE r.res_id = rr.res_id AND r.job_id = rr.job_id;

ALTER TABLE public.recommendation
ADD CONSTRAINT recommendation_skill_match_id_fkey 
FOREIGN KEY (skill_match_id) REFERENCES public.skill_match(id);

ALTER TABLE public.recommendation
DROP COLUMN skill_matches;
