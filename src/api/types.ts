/** 개별 법률안 정보 인터페이스 */
export interface BillInfo {
	BILL_ID: string; // 의안 ID
	BILL_NO: string; // 의안 번호
	BILL_NAME: string; // 법률안명
	COMMITTEE: string; // 소관위원회
	PROPOSE_DT: string; // 제안일 (YYYY-MM-DD)
	PROC_RESULT: string; // 본회의심의 결과
	AGE: string; // 국회 대수
	DETAIL_LINK: string; // 상세페이지 URL
	PROPOSER: string; // 제안자
	MEMBER_LIST: string; // 제안자목록 링크
	LAW_PROC_DT: string; // 법사위 처리일
	LAW_PRESENT_DT: string; // 법사위 상정일
	LAW_SUBMIT_DT: string; // 법사위 회부일
	CMT_PROC_RESULT_CD: string; // 소관위 처리결과코드
	CMT_PROC_DT: string; // 소관위 처리일
	CMT_PRESENT_DT: string; // 소관위 상정일
	COMMITTEE_DT: string; // 소관위 회부일
	PROC_DT: string; // 의결일
	COMMITTEE_ID: string; // 소관위원회 ID
	PUBL_PROPOSER: string; // 공동발의자
	LAW_PROC_RESULT_CD: string; // 법사위 처리결과 코드
	RST_PROPOSER: string;
}

/** 입법예고 정보 인터페이스 */
export interface LegislativeInfo {
	BILL_ID: string; // 의안 ID
	BILL_NO: string; // 의안번호
	BILL_NAME: string; // 법률안명
	AGE: string; // 국회 회기 (예: "22")
	PROPOSER_KIND_CD: string; // 제안자 구분 (예: "정부", "국회의원")
	CURR_COMMITTEE: string; // 소관위원회명
	NOTI_ED_DT: string; // 게시종료일 (YYYY-MM-DD)
	LINK_URL: string; // 입법안 상세페이지 링크
	PROPOSER: string; // 제안자 이름
	CURR_COMMITTEE_ID: string; // 소관위원회 ID
}

/** API 응답 결과 코드 인터페이스*/
interface ApiResult {
	CODE: string;
	MESSAGE: string;
}

/** 응답 헤더 정보 인터페이스*/
interface ResponseHead {
	list_total_count?: number;
	RESULT?: ApiResult;
}

/** 응답 데이터 구조 인터페이스*/
interface ResponseData {
	head: ResponseHead[];
}

/** 응답 행 데이터 인터페이스*/
interface ResponseRow<T> {
	row: T[];
}

interface ErrorResponse {
	RESULT: ApiResult;
}

interface BillSuccessResponse {
	nzmimeepazxkubdpn: [ResponseData, ResponseRow<BillInfo>];
}
interface LegislativeSuccessResponse {
	nknalejkafmvgzmpt: [ResponseData, ResponseRow<LegislativeInfo>];
}

/** 전체 API 응답 인터페이스*/
export type BillApiResponse = BillSuccessResponse | ErrorResponse;

/** 전체 API 응답 인터페이스*/
export type LegislativeApiResponse = LegislativeSuccessResponse | ErrorResponse;
