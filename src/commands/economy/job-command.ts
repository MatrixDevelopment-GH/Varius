import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { JobOption } from '../../enums/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, prisma } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

// Todo: make a job system
export class JobCommand implements Command {
    public names = [Lang.getRef('chatCommands.job', Language.Default)];
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
            },
        });

        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.job', data.lang));
    }
}
