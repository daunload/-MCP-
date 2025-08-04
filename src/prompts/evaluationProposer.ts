import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { getBillSummery } from '../crawler/bill-detail.ts';
import { fetchBills } from '../http/api.ts';
import type { BillApiResponse } from '../http/types.ts';
import type { IRegisterPromptInfo } from './types.ts';

export const evaluationProposer: IRegisterPromptInfo = {
	name: '법안 평가',
	config: {
		title: '법안 평가',
		description: '국회의원이 발의한 법안을 평가합니다',
		argsSchema: {
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
		const response = await fetchBills<BillApiResponse>({
			PROPOSER: proposer,
			AGE: 22,
		});
		const responseData = response.data;
		if ('RESULT' in responseData) {
			return {
				messages: [
					{
						role: 'user',
						content: {
							type: 'text',
							text: `[${responseData.RESULT.CODE}] - ${responseData.RESULT.MESSAGE}`,
						},
					},
				],
			};
		}
		const billListData = responseData.nzmimeepazxkubdpn[1].row;
		const formattedBillList = await Promise.all(
			billListData.map(async (bill) => {
				const summary = await getBillSummery(bill.DETAIL_LINK);
				return `
					name: ${bill.BILL_NAME},
					제안 이유: ${summary}`;
			}),
		);
		return {
			messages: [
				{
					role: 'assistant',
					content: {
						type: 'text',
						text: evaluation,
					},
				},
				{
					role: 'user',
					content: {
						type: 'text',
						text: `이 국회의원이 발의한 법안들을 위 기준에 따라 평가해줘: ${formattedBillList}`,
					},
				},
			],
		};
	},
};

const evaluation = `
다음은 법안을 평가할 기준입니다. 각 항목마다 점수(숫자)와 간단한 이유를 제시해 주세요.

1. 목적의 타당성 (0~10): 문제의 중요성과 현실성
2. 실효성 (0~10): 문제 해결에 효과적인가?
3. 실현 가능성 (0~10): 재정·제도적으로 실행 가능한가?
4. 법적 명확성 (0~10): 문구가 명확하고 해석에 혼란이 없는가?
5. 사회적 합의도 (0~10): 국민 또는 이해관계자가 수용할 수 있는가?
6. 공익성 (0~10): 특정 이익이 아닌 사회 전체에 이로운가?
7. 기존 법률과의 정합성 (0~10): 기존 법과 잘 어울리는가?
8. 정치적 목적성 여부 (-5~0): 정치적 선전·포퓰리즘 목적은 아닌가?`;
