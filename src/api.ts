import axios from 'axios';

const api = axios.create({
	baseURL: 'https://open.assembly.go.kr/portal/openapi/nzmimeepazxkubdpn',
	params: {
		KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
		TYPE: 'json',
		pIndex: 1,
		pSize: 10,
		AGE: 21,
	},
});

type OptionalParams = {
	BILL_ID?: string; // 의안 ID
	BILL_NO?: string; // 의안 번호
	BILL_NAME?: string; // 법률안명
	COMMITTEE?: string; // 소관위원회
	PROC_RESULT?: string; // 본회의 심의결과
	PROPOSER?: string; // 제안자
	COMMITTEE_ID?: string; // 소관위원회 ID
};

export const fetchBills = <T>(params: OptionalParams) => {
	return api.get<T>('', {
		params,
	});
};

fetchBills({ PROPOSER: '이재명' }).then((res) => {
	console.log(res);
});
