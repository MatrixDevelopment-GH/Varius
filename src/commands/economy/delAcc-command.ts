/* eslint-disable import/no-extraneous-dependencies */
import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import moment from 'moment';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, prisma } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class DeleteAccountCommand implements Command {
    public names = [Lang.getRef('chatCommands.delete', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let user = await prisma.user.findUnique({
            where: {
                user_id: intr.user.id,
            },
        });

        const currentTime = moment();
        const createdTime = moment(user.createdAt);

        const differenceInDays = currentTime.diff(createdTime, 'days');

        let embed = Lang.getEmbed('displayEmbeds.delete', data.lang);

        if (!user) {
            embed.setDescription('404 - Account Not Found').setColor('Red');
        } else if (differenceInDays < 2) {
            embed = Lang.getEmbed('displayEmbeds.deleteError', data.lang);
        } else {
            await prisma.user.delete({
                where: {
                    user_id: intr.user.id,
                },
            });
        }

        await InteractionUtils.send(intr, embed);
    }
}
