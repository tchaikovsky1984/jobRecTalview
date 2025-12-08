import type { Config } from "jest";

const config: Config = {
  verbose: true,
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  roots: ["src/"],
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  testTimeout: 50000,
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[mc]?[jt]sx?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testPathIgnorePatterns: [".*/node_modules/"]
}

export default config;
