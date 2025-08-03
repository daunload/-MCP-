import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerPrompts } from './prompts/index.ts';
import { registerTools } from './tools/index.ts';

const server = new McpServer(
	{
		name: 'bill-server',
		version: '0.1.0',
	},
	{
		capabilities: {
			resources: {},
			tools: {},
		},
	},
);

// 도구 등록 추가
registerTools(server);
registerPrompts(server);

const transport = new StdioServerTransport();
server
	.connect(transport)
	.then(() => {
		console.error('Bill MCP server running on stdio');
	})
	.catch((error) => {
		console.error('Failed to run server', error);
		process.exit(1);
	});
