export interface EnvConfig {
  SWAGGER_URL: string;
  SERVICE_GLOBAL_PREFIX: string;
  PORT: number;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  DATABASE_URL: string;
  CORS: {
    ORIGIN: string;
    CREDENTIALS: boolean;
  };
  PIPE_OPTIONS: {
    WHITE_LIST: boolean;
    FORBID_NON_WHITE_LISTED: boolean;
  };
  REDIS: {
    URL: string;
  };
  RMQ_URL: string;
}

export const envConfig = (): EnvConfig => ({
  SWAGGER_URL: process.env.SWAGGER_URL!,
  SERVICE_GLOBAL_PREFIX: String(process.env.SERVICE_GLOBAL_PREFIX),
  PORT: Number(process.env.PORT),
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  DATABASE_URL: process.env.DATABASE_URL!,
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN!,
    CREDENTIALS: Boolean(process.env.CORS_CREDENTIALS),
  },
  PIPE_OPTIONS: {
    WHITE_LIST: Boolean(process.env.SERVICE_PIPE_WHITE_LIST),
    FORBID_NON_WHITE_LISTED: Boolean(
      process.env.SERVICE_PIPE_FORBID_NON_WHITE_LISTED,
    ),
  },
  REDIS: {
    URL: process.env.REDIS_URL!,
  },
  RMQ_URL: process.env.RMQ_URL!,
});
