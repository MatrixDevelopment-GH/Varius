import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { MoneyOption } from '../../enums/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, prisma } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class AddOrSubMoneyCommand implements Command {
    public names = [Lang.getRef('chatCommands.addsubMoney', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let args = {
            option: intr.options.getString(
                Lang.getRef('arguments.option', Language.Default)
            ) as MoneyOption,
            number: intr.options.getNumber(Lang.getRef('arguments.cash', Language.Default)),
            user: intr.options.getUser(Lang.getRef('arguments.cashUser', Language.Default)),
        };
        let num = args.number ?? null;
        let usr = args.user ?? null;
        console.log(`${usr}: ${num}`);
        let embed: EmbedBuilder;
        let user = await prisma.user.findUnique({
            where: {
                user_id: usr.id,
            },
        });
        if (usr == null || num == null || !user) {
            let str = usr == null ? 'user' : 'number';
            console.log(`${str} error`);
            embed = new EmbedBuilder().setDescription(`${str} error`);
            if (!user) {
                await InteractionUtils.send(intr, {
                    embeds: [Lang.getEmbed('displayEmbeds.accountNotFound', data.lang)],
                });
            }
        } else {
            let newBalance =
                args.option == MoneyOption.ADDCASH ? (user.balance += num) : (user.balance -= num);
            await prisma.user.update({
                where: {
                    user_id: usr.id,
                },
                data: {
                    balance: newBalance,
                },
            });
            console.log(newBalance);
            switch (args.option) {
                case MoneyOption.ADDCASH:
                    embed = Lang.getEmbed('displayEmbeds.addCash', data.lang, {
                        CASH: `${num}`,
                        MENTIONED_USER: `${usr}`,
                    });
                    break;
                case MoneyOption.SUBTRACTCASH:
                    embed = Lang.getEmbed('displayEmbeds.subCash', data.lang, {
                        CASH: `${num}`,
                        MENTIONED_USER: `${user}`,
                    });
                    break;
            }
        }

        await InteractionUtils.send(intr, { embeds: [embed] });
    }
}
