import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import { z } from 'zod';
import { fetchBills } from '../api.ts';
import { getBillSummery } from '../crawler/bill-detail.ts';
import type { OpenAPIBillResponse } from '../types';
import type { IToolInfo } from './types.ts';

export const getBillsByProposer: IToolInfo = {
	name: 'get_bills_by_proposer',
	config: {
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
	callback: async ({ proposer }) => {
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
			if (Object.hasOwn(plainData, 'RESULT')) {
				return {
					content: [
						{
							type: 'text',
							text: `[${plainData.RESULT.CODE}] - ${plainData.RESULT.MESSAGE}`,
						},
					],
				};
			}
			const billListData = plainData.nzmimeepazxkubdpn[1]
				.row as OpenAPIBillResponse[];
			const formattedBillList = await Promise.all(
				billListData.map(async (bill) => {
					const summary = await getBillSummery(bill.DETAIL_LINK);
					return {
						id: bill.BILL_ID,
						bill_number: bill.BILL_NO,
						name: bill.BILL_NAME,
						summary,
						detail_link: bill.DETAIL_LINK,
					};
				}),
			);
			return {
				content: [
					{
						type: 'text',
						text: formattedBillList
							.map((bill) => {
								return `의안 ID: ${bill.id}
					의안 번호: ${bill.bill_number}
					법률안명: ${bill.name}
                                    제안 이유: ${bill.summary}
					링크 주소: ${bill.detail_link}`;
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
};
