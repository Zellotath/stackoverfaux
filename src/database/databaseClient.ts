import { PrismaClient } from '@prisma/client';

/*
 * Should only have one instance of PrismaClient in the application, since it manages a database connection pool.
 * Additionally, this prevents hot-reloading from creating multiple connections in non-production environments.
 *
 * @source https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
 */

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
