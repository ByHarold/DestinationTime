/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COUNTDOWN_NAME: string
  readonly VITE_COUNTDOWN_DATE: string
  readonly VITE_COUNTDOWN_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
