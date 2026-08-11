import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { getEnvFileCandidates, loadEnvFiles } from "@/configs/dotenv.config";

describe("dotenv.config", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let tempDir: string;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    tempDir = mkdtempSync(join(tmpdir(), "dotenv-config-"));
    jest.spyOn(process, "cwd").mockReturnValue(tempDir);
  });

  afterEach((): void => {
    process.env = originalEnv;
    jest.restoreAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  const writeEnvFile = (file: string, content: string): void => {
    writeFileSync(join(tempDir, file), content);
  };

  describe("getEnvFileCandidates", () => {
    it("should return the four candidates in precedence order for development", () => {
      const candidates: string[] = getEnvFileCandidates("development");

      expect(candidates).toEqual([
        ".env.development.local",
        ".env.local",
        ".env.development",
        ".env",
      ]);
    });

    it("should build the mode-specific candidates from the given mode", () => {
      const candidates: string[] = getEnvFileCandidates("production");

      expect(candidates).toEqual([
        ".env.production.local",
        ".env.local",
        ".env.production",
        ".env",
      ]);
    });

    it("should return only the two test files when mode is test", () => {
      const candidates: string[] = getEnvFileCandidates("test");

      expect(candidates).toEqual([".env.test.local", ".env.test"]);
    });
  });

  describe("loadEnvFiles", () => {
    it("should return an empty list when no env files exist", () => {
      process.env.NODE_ENV = "development";

      const applied: string[] = loadEnvFiles();

      expect(applied).toEqual([]);
    });

    it("should load variables from .env", () => {
      process.env.NODE_ENV = "development";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-base");

      const applied: string[] = loadEnvFiles();

      expect(applied).toEqual([".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-base");
    });

    it("should not override variables already present in process.env", () => {
      process.env.NODE_ENV = "development";
      process.env.DOTENV_TEST_KEY = "from-process";
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-base");

      loadEnvFiles();

      expect(process.env.DOTENV_TEST_KEY).toBe("from-process");
    });

    it("should prefer .env.<mode>.local over .env.local, .env.<mode> and .env", () => {
      process.env.NODE_ENV = "development";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.development.local", "DOTENV_TEST_KEY=mode-local");
      writeEnvFile(".env.local", "DOTENV_TEST_KEY=local");
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=mode");
      writeEnvFile(".env", "DOTENV_TEST_KEY=base");

      const applied: string[] = loadEnvFiles();

      expect(applied).toEqual([".env.development.local", ".env.local", ".env.development", ".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("mode-local");
    });

    it("should prefer .env.local over .env.<mode> and .env", () => {
      process.env.NODE_ENV = "development";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.local", "DOTENV_TEST_KEY=local");
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=mode");
      writeEnvFile(".env", "DOTENV_TEST_KEY=base");

      loadEnvFiles();

      expect(process.env.DOTENV_TEST_KEY).toBe("local");
    });

    it("should prefer .env.<mode> over .env", () => {
      process.env.NODE_ENV = "development";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=mode");
      writeEnvFile(".env", "DOTENV_TEST_KEY=base");

      loadEnvFiles();

      expect(process.env.DOTENV_TEST_KEY).toBe("mode");
    });

    it("should resolve the mode from NODE_ENV declared in .env.local when the process does not set it", () => {
      delete process.env.NODE_ENV;
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.local", "NODE_ENV=production");
      writeEnvFile(".env.production", "DOTENV_TEST_KEY=from-mode-file");

      const applied: string[] = loadEnvFiles();

      expect(applied).toEqual([".env.local", ".env.production"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-mode-file");
    });

    it("should fall back to NODE_ENV declared in .env when .env.local does not declare it", () => {
      delete process.env.NODE_ENV;
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.local", "DOTENV_TEST_OTHER=1");
      writeEnvFile(".env", "NODE_ENV=production");
      writeEnvFile(".env.production", "DOTENV_TEST_KEY=from-mode-file");

      const applied: string[] = loadEnvFiles();

      expect(applied).toEqual([".env.local", ".env.production", ".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-mode-file");
    });

    it("should default the mode to development when NODE_ENV is not declared anywhere", () => {
      delete process.env.NODE_ENV;
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env", "DOTENV_TEST_OTHER=1");
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=from-development");

      const applied: string[] = loadEnvFiles();

      expect(applied).toEqual([".env.development", ".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-development");
    });

    it("should ignore .env and .env.local when mode is test", () => {
      process.env.NODE_ENV = "test";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env", "DOTENV_TEST_KEY=base");
      writeEnvFile(".env.local", "DOTENV_TEST_KEY=local");

      const applied: string[] = loadEnvFiles();

      expect(applied).toEqual([]);
      expect(process.env.DOTENV_TEST_KEY).toBeUndefined();
    });

    it("should load .env.test when mode is test", () => {
      process.env.NODE_ENV = "test";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.test", "DOTENV_TEST_KEY=from-test-file");
      writeEnvFile(".env", "DOTENV_TEST_KEY=base");

      const applied: string[] = loadEnvFiles();

      expect(applied).toEqual([".env.test"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-test-file");
    });

    it("should prefer .env.test.local over .env.test when mode is test", () => {
      process.env.NODE_ENV = "test";
      delete process.env.DOTENV_TEST_KEY;
      writeEnvFile(".env.test.local", "DOTENV_TEST_KEY=test-local");
      writeEnvFile(".env.test", "DOTENV_TEST_KEY=test");

      const applied: string[] = loadEnvFiles();

      expect(applied).toEqual([".env.test.local", ".env.test"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("test-local");
    });
  });
});
