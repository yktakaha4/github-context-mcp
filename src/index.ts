import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getCommitHashes, guessGitHubRepoInfo } from "./git.js";
import { getContextByFilePath } from "./context.js";
import { describeContextByFilePath } from "./describe.js";
 
export const server = new McpServer({
  name: "DiceRoller",
  version: "0.1.0",
});

server.tool(
  "getContextByFilePath",
  "Get context by file path",
  { filePath: z.string().describe("file path") },
  async ({ filePath }) => {
    const context = await getContextByFilePath(filePath);
    if (context.pulls.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No context found for the file",
            metadata: {
              filePath,
            },
          },
        ],
        isError: true,
      };
    }

    const text = describeContextByFilePath(context);

    return {
      content: [
        {
          type: "text",
          text,
          metadata: {
            filePath,
          },
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
