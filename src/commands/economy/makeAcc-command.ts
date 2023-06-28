import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, prisma } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class CreateAccountCommand implements Command {
    public names = [Lang.getRef('chatCommands.create', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        try {
            await prisma.user.create({
                data: {
                    user_id: intr.user.id
                }
            })
            let embed = Lang.getEmbed('displayEmbeds.accountCreated', data.lang)
            await InteractionUtils.send(intr, embed);
        } catch {
            await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.accountAlreadyExists', data.lang));
        }

    }
}