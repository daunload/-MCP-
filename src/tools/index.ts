import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { billsByProposer } from './billsByProposer.ts';

export function registerTools(server: McpServer) {
	server.registerTool(
		billsByProposer.name,
		billsByProposer.config,
		billsByProposer.callback,
	);
}
