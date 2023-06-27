import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

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
        let user = prisma.user.findUnique({
            where: {
                user_id: intr.user.id
            }
        })

        let embed = Lang.getEmbed('displayEmbeds.delete', data.lang).setColor("Green");
        
        if (!user) {
            embed.setDescription("404 - Account Not Found").setColor("Red");
        } else {
            await prisma.user.delete({
                where: {
                    user_id: intr.user.id
                }
            })
        }

        await InteractionUtils.send(intr, embed);
    }
}
