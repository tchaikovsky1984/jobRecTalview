CREATE TABLE "public"."job" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" text DEFAULT '"Role"', "company" text DEFAULT '"Company"', "description" text DEFAULT '"Job Description"', "skills" jsonb, "location" text DEFAULT '"Place"', "job_vector" vector, "refresh_date" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
