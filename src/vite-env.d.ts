// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add more here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

