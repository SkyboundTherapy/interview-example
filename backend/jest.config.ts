import "source-map-support/register.js";

import type {Config} from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^better-auth$": "<rootDir>/test/stubs/empty.js",
    "^better-auth/(.*)$": "<rootDir>/test/stubs/empty.js",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
