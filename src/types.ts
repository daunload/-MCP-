export interface OpenAPIBillResponse {
	BILL_ID: string; // 의안 ID
	BILL_NO: string; // 의안 번호
	BILL_NAME: string; // 법률안명
	COMMITTEE: string; // 소관위원회
	PROPOSE_DT: string; // 제안일 (YYYY-MM-DD)
	PROC_RESULT?: string; // 본회의심의 결과
	AGE: string; // 국회 대수
	DETAIL_LINK?: string; // 상세페이지 URL
	PROPOSER: string; // 제안자
	MEMBER_LIST?: string; // 제안자목록 링크
	LAW_PROC_DT?: string; // 법사위 처리일
	LAW_PRESENT_DT?: string; // 법사위 상정일
	LAW_SUBMIT_DT?: string; // 법사위 회부일
	CMT_PROC_RESULT_CD?: string; // 소관위 처리결과코드
	CMT_PROC_DT?: string; // 소관위 처리일
	CMT_PRESENT_DT?: string; // 소관위 상정일
	COMMITTEE_DT?: string; // 소관위 회부일
	PROC_DT?: string; // 의결일
	COMMITTEE_ID?: string; // 소관위원회 ID
	PUBL_PROPOSER?: string; // 공동발의자
	LAW_PROC_RESULT_CD?: string; // 법사위 처리결과 코드
	RST_PROPOSER?: string;
}
