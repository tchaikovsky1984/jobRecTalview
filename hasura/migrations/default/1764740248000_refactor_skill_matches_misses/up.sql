ALTER TABLE public.recommendation
ADD COLUMN skill_matches Text[];

ALTER TABLE public.recommendation
ADD COLUMN skill_misses Text[];

UPDATE public.recommendation r
SET 
  skill_matches = sm.matches,
  skill_misses = sm.misses
FROM public.skill_match sm
WHERE r.skill_match_id = sm.id;

ALTER TABLE public.recommendation
DROP COLUMN skill_match_id;

DROP TABLE public.skill_match;
