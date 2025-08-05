/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_OPEN_API_KEY: string;
	readonly VITE_LAWMAKING_API_KEY: string;
	// 다른 환경 변수들을 추가합니다.
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
