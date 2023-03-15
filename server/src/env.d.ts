declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      SERVER_PORT: string;
      APP_PORT: string;
      ORIGINS: string;
    }
  }
}

export {};
