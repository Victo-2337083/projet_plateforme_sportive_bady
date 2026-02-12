// Chargement différé de Prisma pour éviter les erreurs au démarrage
let PrismaClientClass: any;
let prismaInstance: any;

const getPrisma = () => {
  if (!prismaInstance) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      PrismaClientClass = require('@prisma/client').PrismaClient;
      prismaInstance = new PrismaClientClass({
        log: process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
      });
    } catch (error) {
      console.warn('Prisma non disponible:', error);
      // Retourne un mock pour permettre au serveur de démarrer
      prismaInstance = {
        $queryRaw: async () => { throw new Error('Database not configured'); },
      };
    }
  }
  return prismaInstance;
};

export const prisma = new Proxy({} as any, {
  get: (_target, prop) => {
    return getPrisma()[prop];
  },
});

