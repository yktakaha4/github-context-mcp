import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { server } from "./index.js";
 
describe("getDiceRoll", () => {
  it("ランダムにサイコロを振った結果を返す", async () => {
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
      name: "getDiceRoll",
      arguments: {
        sides: 6,
      },
    });
 
    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: expect.stringMatching(/^[1-6]$/),
        },
      ],
    });
  });
});
