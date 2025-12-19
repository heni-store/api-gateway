export interface EnvConfig {
  PORT: number;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  DATABASE_URL: string;
}

export const envConfig = (): EnvConfig => ({
  PORT: Number(process.env.PORT ?? 3000),
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  DATABASE_URL: process.env.DATABASE_URL!,
});
