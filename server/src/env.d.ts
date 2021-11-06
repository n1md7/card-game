declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    JWT_SECRET: string;
    SERVER_PORT: string;
    APP_PORT: string;
    ORIGINS: string;
  }
}
