import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import crypto from "crypto";

export const createTempDirectory = () => {
  return mkdtempSync(join(tmpdir(), "test-"));
}

export const createMD5Hash = (input: string) => {
  const hash = crypto.createHash("md5");
  hash.update(input);
  return hash.digest("hex");
}

export const isE2ETest = !!process.env.RUN_E2E_TESTS;
