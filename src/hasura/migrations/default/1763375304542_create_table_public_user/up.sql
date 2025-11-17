CREATE TABLE "public"."user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "email" text NOT NULL, "username" text NOT NULL, "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "age" integer NOT NULL DEFAULT 18, PRIMARY KEY ("id") , UNIQUE ("id"), UNIQUE ("email"), UNIQUE ("username"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
