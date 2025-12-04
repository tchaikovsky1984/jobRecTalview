ALTER TABLE public.recommendation
ADD COLUMN "rank" INTEGER;

ALTER TABLE public.recommendation
ADD CONSTRAINT recommendation_res_id_rank_key UNIQUE (res_id, rank);
