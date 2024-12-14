export const CONFIG = {
  PORT: Number(process.env.PORT) || 3000,
  HOST: process.env.HOST || 'localhost',
} as const;
