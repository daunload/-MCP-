import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import { z } from 'zod';
import { getBillSummery } from '../crawler/bill-detail.ts';
import { fetchBills } from '../http/api.ts';
import type { BillApiResponse } from '../http/types.ts';
import type { IToolInfo } from './types.ts';

export const billsByProposer: IToolInfo = {
	name: 'get_bills_by_proposer',
	config: {
		title: '국회의원 발의 법률안 조회',
		description:
			'특정 국회의원이 발의한 법률안 목록을 가져옵니다. 이름, 대수 등으로 필터링할 수 있습니다',
		inputSchema: {
			proposer: z
				.string()
				.min(1, '국회의원 이름이 비어있어!!')
				.describe('법률안을 발의한 국회의원 이름입니다'),
			age: z.number().default(22).describe('국회의원 대수입니다.'),
		},
	},
	callback: async ({ proposer, age }) => {
		if (!proposer || typeof proposer !== 'string') {
			throw new McpError(
				ErrorCode.InvalidParams,
				'국회의원 이름은 문자열이어야합니다',
			);
		}
		try {
			const response = await fetchBills<BillApiResponse>({
				PROPOSER: proposer,
				AGE: age,
			});

			const responseData = response.data;
			if ('RESULT' in responseData) {
				return {
					content: [
						{
							type: 'text',
							text: `[${responseData.RESULT.CODE}] - ${responseData.RESULT.MESSAGE}`,
						},
					],
				};
			}
			const billListData = responseData.nzmimeepazxkubdpn[1].row;
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
