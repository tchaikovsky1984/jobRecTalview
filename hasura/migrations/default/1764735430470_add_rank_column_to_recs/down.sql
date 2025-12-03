ALTER TABLE public.recommendation 
DROP CONSTRAINT recommendation_res_id_rank_key;

ALTER TABLE public.recommendation 
DROP COLUMN rank;
