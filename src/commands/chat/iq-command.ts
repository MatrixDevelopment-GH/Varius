import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class IqCommand implements Command {
    public names = [Lang.getRef('chatCommands.iq', Language.Default)];
    public cooldown = new RateLimiter(1, 1000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let args = {
            option:
                intr.options.getUser(Lang.getRef('arguments.iq', Language.Default)) ?? intr.user,
        };
        let IQ = Math.floor(Math.random() * 2000 - 1000);
        let embed = Lang.getEmbed('displayEmbeds.iq', data.lang, {
            MENTIONED_USER: `${args.option}`,
            IQ: `${IQ}`,
        }).setColor(IQ < 0 ? 'Red' : IQ < 50 ? 'Yellow' : IQ < 200 ? 'Green' : 'DarkVividPink');
        await InteractionUtils.send(intr, embed);
    }
}
