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

        let eeeeee = {
            ee: e.options.getNumber(Lang.getRef('arguments.purge', data.lang)),
        };
        let ee = eeeeee.ee ?? 1;

        if (ee <= 0) {
            let eeeeeee = Lang.getEmbed('displayEmbeds.purge', data.lang, {
                STATUS: Lang.getRef('purgeDescs.error', data.lang),
            });
            await eeeee.send(e, eeeeeee);
            return;
        } else {
            await e.channel.bulkDelete(ee, true);
            async function sendEmbed(): Promise<void> {
                const eee = ee === 1 ? 'message' : 'messages';
                let eeeeeee = Lang.getEmbed('displayEmbeds.purge', data.lang, {
                    STATUS: Lang.getRef('purgeDescs.success', data.lang, {
                        EE: `${ee}`,
                        EEE: `${eee}`,
                    }),
                });
                await eeeee.send(e, eeeeeee);
            }
            sendEmbed();
        }
    }
}
