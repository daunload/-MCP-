import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { evaluationProposer } from './evaluationProposer';

export function registerPrompts(server: McpServer) {
	server.registerPrompt(
		evaluationProposer.name,
		evaluationProposer.config,
		evaluationProposer.callback,
	);
}
