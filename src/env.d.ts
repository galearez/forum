/// <reference types="astro/client" />

interface ImportMetaEnv {
  PG_HOST: string;
  PG_PORT: number;
  PG_USER: string;
  PG_PASSWORD: string;
  PG_DATABASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
