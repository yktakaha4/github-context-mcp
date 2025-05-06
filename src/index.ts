import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
 
export const server = new McpServer({
  name: "DiceRoller",
  version: "0.1.0",
});

server.tool(
  "getDiceRoll",
  "Roll a dice with a specified number of sides and return the result.",
  // ツールの引数を定義するスキーマ
  { sides: z.number().min(1).describe("Number of sides on the die") },
  async ({ sides }) => {
    const roll = Math.floor(Math.random() * sides) + 1;
    
    return {
      content: [
        {
          type: "text",
          text: roll.toString(),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}
 
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
