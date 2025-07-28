import { z } from 'zod';
import { fetchBills } from './api.ts';
import type { OpenAPIBillResponse } from './types';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import axios from 'axios';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer(
	{
		name: 'weather-server',
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
server.registerTool(
	'get_bills_by_proposer',
	{
		title: '국회의원 발의 법률안 조회',
		description:
			'특정 국회의원이 발의한 법률안 목록을 가져옵니다. 이름, 회기, 기간 등으로 필터링할 수 있습니다',
		inputSchema: {
			proposer: z
				.string()
				.min(1, '국회의원 이름이 비어있어!!')
				.describe('법률안을 발의한 국회의원 이름입니다'),
		},
	},
	async ({ proposer }) => {
		if (!proposer || typeof proposer !== 'string') {
			throw new McpError(
				ErrorCode.InvalidParams,
				'국회의원 이름은 문자열이어야합니다',
			);
		}

		try {
			const response = await fetchBills<OpenAPIBillResponse>({
				PROPOSER: proposer,
			});

			const plainData = JSON.parse(JSON.stringify(response.data));
			const billListData = plainData.nzmimeepazxkubdpn[1]
				.row as OpenAPIBillResponse[];

			return {
				content: [
					{
						type: 'text',
						text: billListData
							.map((bill) => {
								return `의안 ID: ${bill.BILL_ID}
									의안 번호: ${bill.BILL_NO}
									법률안명: ${bill.BILL_NAME}
									링크 주소: ${bill.DETAIL_LINK}`;
							})
							.join('\n\n'),
					},
				],
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new McpError(
					ErrorCode.InternalError,
					`발의 법률안 API 오류: ${error.response?.data.message ?? error.message}`,
				);
			}
			throw error;
		}
	},
);

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
