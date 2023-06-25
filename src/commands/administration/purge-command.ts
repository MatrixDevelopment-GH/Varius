import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PurgeCommand implements Command {
    public names = [Lang.getRef('chatCommands.purge', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const e = intr;
        const eeeee = InteractionUtils;

        const ee = e['options']['getInteger']('amount') || 1;

        if (ee <= 0) {
            let embed = Lang.getEmbed('displayEmbeds.purge', data.lang, {
                STATUS: Lang.getRef('purgeDescs.error', data.lang),
            });
            await eeeee.send(e, embed);
            return;
        }
        e['channel']['bulkDelete'](ee, true);

        const eee = ee === 1 ? 'message' : 'messages';
        let embed = Lang.getEmbed('displayEmbeds.purge', data.lang, {
            STATUS: Lang.getRef('purgeDescs.success', data.lang, {
                EE: `${ee}`,
                EEE: `${eee}`,
            }),
        });
        await eeeee.send(e, embed);
    }
}
