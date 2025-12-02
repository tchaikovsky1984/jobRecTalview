SET check_function_bodies = false;
CREATE TABLE public.job (
    id integer NOT NULL,
    title text,
    company text,
    description text,
    skills text[],
    location text,
    experience integer,
    ref_date timestamp with time zone DEFAULT now() NOT NULL,
    embedding public.vector(384),
    url text,
    search_title text,
    search_pref_country text,
    search_pref_area text
);
CREATE SEQUENCE public.job_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.job_id_seq OWNED BY public.job.id;
CREATE TABLE public.recommendation (
    id integer NOT NULL,
    res_id integer NOT NULL,
    job_id integer NOT NULL,
    skill_match_id integer NOT NULL,
    score double precision NOT NULL,
    analysis_date timestamp with time zone DEFAULT now() NOT NULL,
    reasoning text
);
CREATE SEQUENCE public.recommendation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.recommendation_id_seq OWNED BY public.recommendation.id;
CREATE TABLE public.resume (
    id integer NOT NULL,
    user_id integer NOT NULL,
    filepath text NOT NULL,
    extracted_skills text[],
    embedding public.vector
);
CREATE SEQUENCE public.resume_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.resume_id_seq OWNED BY public.resume.id;
CREATE TABLE public.skill_match (
    id integer NOT NULL,
    res_id integer NOT NULL,
    job_id integer NOT NULL,
    matches text[],
    misses text[],
    analysis_date timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.skill_match_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.skill_match_id_seq OWNED BY public.skill_match.id;
CREATE TABLE public."user" (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password_hash text NOT NULL
);
CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;
ALTER TABLE ONLY public.job ALTER COLUMN id SET DEFAULT nextval('public.job_id_seq'::regclass);
ALTER TABLE ONLY public.recommendation ALTER COLUMN id SET DEFAULT nextval('public.recommendation_id_seq'::regclass);
ALTER TABLE ONLY public.resume ALTER COLUMN id SET DEFAULT nextval('public.resume_id_seq'::regclass);
ALTER TABLE ONLY public.skill_match ALTER COLUMN id SET DEFAULT nextval('public.skill_match_id_seq'::regclass);
ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_url_key UNIQUE (url);
ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_res_id_job_id_key UNIQUE (res_id, job_id);
ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_skill_match_id_key UNIQUE (skill_match_id);
ALTER TABLE ONLY public.resume
    ADD CONSTRAINT resume_filepath_key UNIQUE (filepath);
ALTER TABLE ONLY public.resume
    ADD CONSTRAINT resume_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.skill_match
    ADD CONSTRAINT skill_match_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.skill_match
    ADD CONSTRAINT skill_match_res_id_job_id_key UNIQUE (res_id, job_id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);
CREATE INDEX job_embedding_idx ON public.job USING hnsw (embedding public.vector_cosine_ops) WITH (m='16', ef_construction='64');
ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.job(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_res_id_fkey FOREIGN KEY (res_id) REFERENCES public.resume(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_skill_match_id_fkey FOREIGN KEY (skill_match_id) REFERENCES public.skill_match(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.resume
    ADD CONSTRAINT resume_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.skill_match
    ADD CONSTRAINT skill_match_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.job(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.skill_match
    ADD CONSTRAINT skill_match_res_id_fkey FOREIGN KEY (res_id) REFERENCES public.resume(id) ON UPDATE RESTRICT ON DELETE CASCADE;
