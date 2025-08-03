import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

type RegisterPrompt = McpServer['registerPrompt'];

export interface IRegisterPromptInfo {
	name: Parameters<RegisterPrompt>[0];
	config: Parameters<RegisterPrompt>[1];
	callback: Parameters<RegisterPrompt>[2];
}
