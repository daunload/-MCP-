import axios from 'axios';

const api = axios.create({
	baseURL: 'https://open.assembly.go.kr/portal/openapi',
	params: {
		KEY: import.meta.env.VITE_OPEN_API_KEY,
		TYPE: 'json',
		pIndex: 1,
		pSize: 10,
	},
});

type BillParams = {
	AGE: number;
	BILL_ID?: string; // 의안 ID
	BILL_NO?: string; // 의안 번호
	BILL_NAME?: string; // 법률안명
	COMMITTEE?: string; // 소관위원회
	PROC_RESULT?: string; // 본회의 심의결과
	PROPOSER?: string; // 제안자
	COMMITTEE_ID?: string; // 소관위원회 ID
};

export const fetchBills = <T>(params: BillParams) => {
	return api.get<T>('/nzmimeepazxkubdpn', {
		params,
	});
};
export interface LegislativeParams {
	BILL_ID?: string; // 의안 ID
	BILL_NO?: string; // 의안번호
	BILL_NAME?: string; // 법률안명 (검색어)
	PROPOSER_KIND_CD?: string; // 제안자 구분
	CURR_COMMITTEE?: string; // 소관위원회 (검색어)
	NOTI_ED_DT?: string; // 게시 종료일 (YYYY-MM-DD 형식)
	PROPOSER?: string; // 제안자 (검색어)
	CURR_COMMITTEE_ID?: string; // 소관위원회 ID
}

export const fetchLegislative = <T>(params: LegislativeParams) => {
	return api.get<T>('/nknalejkafmvgzmpt', {
		params,
	});
};
