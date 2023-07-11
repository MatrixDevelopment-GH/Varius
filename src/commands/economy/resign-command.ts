import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, prisma, PrismaUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class ResignCommand implements Command {
    public names = [Lang.getRef('chatCommands.resign', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let user = await prisma.user.findUnique({
            where: {
                user_id: intr.user.id,
            },
            include: {
                job: true,
            }
        })

        if ( !user.job ) {
            await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.noJob', data.lang));
        } else {
            let utils = new PrismaUtils();
            await utils.deleteJob(intr.user.id);
            await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.resign', data.lang));
        }
    }
}