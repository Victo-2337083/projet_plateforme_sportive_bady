import { env } from './env';

export const mysqlConfig = {
  databaseUrl: env.DATABASE_URL,
  isConfigured: env.DATABASE_URL.startsWith('mysql://'),
};
