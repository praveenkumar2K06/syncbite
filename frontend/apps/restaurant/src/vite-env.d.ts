/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute API base for staging/production. Defaults to the dev proxy (/api/v1). */
  readonly VITE_API_URL?: string;
  /** Branch (outlet) id this portal manages. Falls back to local storage. */
  readonly VITE_BRANCH_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
