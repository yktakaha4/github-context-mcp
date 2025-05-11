import { describe, it, expect, beforeEach, vi } from "vitest";
import * as context from "./context.js";
import * as cache from "./cache.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { server } from "./index.js";
import { createTempDirectory } from "./helper.js";
 
describe("getContextByFilePath", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(cache, "getCache").mockImplementation(() => {
      const tempDir = createTempDirectory();
      return new cache.ContentCache(tempDir);
    });
  });

  it("Contextが返却される", async () => {
    vi.spyOn(context, "getContextByFilePath").mockImplementation(() => {
      return new Promise((resolve) => {
        const ret = {
          pulls: [
            {
              pull: {
                number: 1,
                state: "open",
                title: "my test pull request",
                user: {
                  login: "yktakaha4",
                },
                created_at: "2023-10-01T00:00:00Z",
                updated_at: "2023-10-01T00:00:00Z",
                closed_at: null,
                merged_at: null,
                url: "https://example.com/pull/1",
                body: "This is a test pull request.",
              },
              comments: [],
              reviews: [],
            },
          ],
        } as any;
        resolve(ret);
      });
    });

    const client = new Client({
      name: "test client",
      version: "0.1.0",
    });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    const result = await client.callTool({
      name: "getContextByFilePath",
      arguments: {
        filePath: __filename,
      },
    });
    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: expect.stringContaining("my test pull request"),
          metadata: {
            filePath: __filename,
          },
        },
      ],
    });
  });

  it("ファイルが存在しない場合エラー", async () => {
    const client = new Client({
      name: "test client",
      version: "0.1.0",
    });
 
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
      
    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);
 
    const result = await client.callTool({
      name: "getContextByFilePath",
      arguments: {
        filePath: "invalid/file/path",
      },
    });
 
    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: expect.stringMatching(/^File path does not exist:/),
        },
      ],
      isError: true,
    });
  });
});
