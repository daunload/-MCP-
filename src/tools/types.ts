import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

type RegisterTool = McpServer['registerTool'];

export interface IToolInfo {
	name: Parameters<RegisterTool>[0];
	config: Parameters<RegisterTool>[1];
	callback: Parameters<RegisterTool>[2];
}
