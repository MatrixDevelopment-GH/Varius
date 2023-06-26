import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PortfolioCommand implements Command {
    public names = [Lang.getRef('chatCommands.portfolio', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let args = {
            option:
                intr.options.getUser(Lang.getRef('arguments.iq', Language.Default)) ?? intr.user,
        };

        let embed = Lang.getEmbed('displayEmbeds.portfolio', data.lang, {
            
        });
        await InteractionUtils.send(intr, { embeds: [embed] });
    }
}
