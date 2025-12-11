import path from "path";
import dotenv from "dotenv";
import type { CodegenConfig } from '@graphql-codegen/cli';

const project_root_dir = path.join(import.meta.dirname, "../.env");
const result = dotenv.config({ path: project_root_dir });

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.HASURA_URL + "v1/graphql",

  documents: "graphql/**/*.graphql",

  generates: {
    "generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request"
      ],
      config: {
        // This ensures the generated SDK is easy to use
        rawRequest: false,
        enumsAsTypes: true
      },
    },
  },
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET
  }
};

export default config;
