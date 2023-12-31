import { PrismaClient } from '@prisma/client';

export class PrismaUtils {
    public async getData(url: string): Promise<any> {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await res.json();
    }

    public async getStock(ticker: string): Promise<any> {
        ticker = ticker.toUpperCase();
        if (cache[ticker] && cache[ticker].lastUpdated - new Date().getTime() < 300000) {
            return cache[ticker].value;
        } else {
            let tick = await this.getData(
                `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${process.env.API_KEY}`
            );
            if (tick.status != 'OK' || tick.resultsCount == 0)
                cache[ticker] = { lastUpdated: Number.MAX_SAFE_INTEGER, value: 0 };
            else cache[ticker] = { lastUpdated: new Date().getTime(), value: tick.results[0].c };
            return cache[ticker].value;
        }
    }

    public async registerJob(
        userId: string, 
        jobName: any, 
        jobSalary: number, 
        jobTime: number, 
        jobReq: number
    ): Promise<any> {
        await prisma.job.create({
            data: {
                name: `${jobName}`,
                salary: jobSalary,
                time: jobTime,
                required: jobReq,
                user: {
                    connectOrCreate: {
                        where: {
                            user_id: userId,
                        },
                        create: {
                            user_id: userId,
                        },
                    },
                },
            },
            include: {
                user: true,
            },
        });
    }
    
    public async deleteJob(userId: string): Promise<void> {
        await prisma.user.update({
            where: {
                user_id: userId
            },
            data: {
                job: {
                    delete: true,
                }
            }
        })
    }
}

export let cache = {};
export let nwCache = {};
export const prisma = new PrismaClient();
