// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClient } from '@prisma/client';

export let cache = {};
export let nwCache = {};
export const prisma: PrismaClient = new PrismaClient();
