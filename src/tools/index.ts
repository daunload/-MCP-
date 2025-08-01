import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getBillsByProposer } from './getBillsByProposer.ts';

export function registerTools(server: McpServer) {
	server.registerTool(
		getBillsByProposer.name,
		getBillsByProposer.config,
		getBillsByProposer.callback,
	);
}
