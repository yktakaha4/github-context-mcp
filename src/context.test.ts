import { describe, it } from "vitest";
import { getContextByFilePath } from "./context.js";

describe("getContextByFileHash", () => {
  it("", async () => {
    const result = await getContextByFilePath(__filename);
  });
})
