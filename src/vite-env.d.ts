/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string
  // 다른 환경 변수들을 추가합니다.
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
