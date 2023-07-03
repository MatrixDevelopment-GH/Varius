import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, nwCache, prisma, PrismaUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PortfolioCommand implements Command {
    public names = [Lang.getRef('chatCommands.portfolio', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let prismaUtils = new PrismaUtils();

        let args = {
            option:
                intr.options.getUser(Lang.getRef('arguments.portfolio', Language.Default)) ??
                intr.user,
        };

        const user = await prisma.user.findUnique({
            where: {
                user_id: args.option.id,
            },
            include: {
                properties: true,
                stocks: true,
            },
        });

        if (!user) {
            await InteractionUtils.send(intr, {
                embeds: [Lang.getEmbed('displayEmbeds.accountNotFound', data.lang)],
            });
        } else {
            let total = 0.0;
            function findTotal(): number {
                user.properties.map(asset => {
                    total += asset.price;
                });
                user.stocks.map(async stock => {
                    let price = await prismaUtils.getStock(stock.ticker);
                    if (price != stock.currentPrice) {
                        prisma.stock.update({
                            where: {
                                id: stock.id,
                            },
                            data: {
                                currentPrice: price,
                            },
                        });
                    }
                    total += stock.amount * price;
                });
                total += user.balance;
                return total;
            }

            function findAssets(): string[] {
                let assets = [];
                user.properties.map(asset => {
                    assets.push(asset.name);
                });
                return assets;
            }

            let fields: any[] = await Promise.all(
                user.stocks.map(async stock => {
                    let amount = await prismaUtils.getStock(stock.ticker);
                    if (amount != stock.currentPrice) {
                        prisma.stock.update({
                            where: {
                                id: stock.id,
                            },
                            data: {
                                currentPrice: amount,
                            },
                        });
                    }
                    return {
                        name: `${stock.ticker}: ${stock.amount}x `,
                        value: `**Worth: ** ${(stock.currentPrice * stock.amount).toFixed(2)}$ → ${(
                            amount * stock.amount
                        ).toFixed(2)}$`,
                        inline: true,
                    };
                })
            );

            nwCache[user.user_id] = user.balance + total;

            let embed = Lang.getEmbed('displayEmbeds.portfolio', data.lang, {
                MENTIONED_USER: `${args.option}`,
                NET_WORTH: `${findTotal()}`,
                CASH: `${user.balance}`,
                PROPERTY: `${
                    findAssets().length == 0
                        ? Lang.getRef('portfolioDescs.no_props', data.lang)
                        : findAssets().map(asset => asset)
                }`,
                STOCKS: `${
                    fields.length == 0 ? Lang.getRef('portfolioDescs.no_stocks', data.lang) : ''
                }`,
            }).addFields(...fields);
            await InteractionUtils.send(intr, { embeds: [embed] });
        }
    }
}
