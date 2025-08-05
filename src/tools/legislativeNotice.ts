import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import { fetchLegislative } from '../api/bill.ts';
import type { LegislativeApiResponse } from '../api/types.ts';
// import { z } from 'zod';
import { getBillSummery } from '../crawler/bill-detail.ts';
import type { IToolInfo } from './types.ts';

export const legislativeNotice: IToolInfo = {
	name: 'get_legislative_notice',
	config: {
		title: '입법예고 조회',
		description: '진행중 입법예고 정보를 제공합니다.',
	},
	callback: async () => {
		try {
			const response = await fetchLegislative<LegislativeApiResponse>({});

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
			console.error(responseData.nknalejkafmvgzmpt[1]);

			const billListData = responseData.nknalejkafmvgzmpt[1].row;
			const formattedBillList = await Promise.all(
				billListData.map(async (bill) => {
					const summary = await getBillSummery(bill.LINK_URL);
					return {
						id: bill.BILL_ID,
						bill_number: bill.BILL_NO,
						name: bill.BILL_NAME,
						summary,
						detail_link: bill.LINK_URL,
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
