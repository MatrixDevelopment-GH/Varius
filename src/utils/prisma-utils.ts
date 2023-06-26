import { PrismaClient } from "@prisma/client";

export let cache = {};
export let nwCache = {};
export const prisma = new PrismaClient();
