import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export const createTempDirectory = () => {
  return mkdtempSync(join(tmpdir(), "test-"));
}
