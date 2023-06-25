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
            await eeeee['send'](e, 'Seriously? You expect me to delete 0 messages? Get real!');
            return;
        }
        e['channel']['bulkDelete'](ee, true);

        const eee = ee === 1 ? 'message' : 'messages';
        const eeee = `B^O^O^M! ${ee} ${eee} annihilated from existence!`;

        await eeeee['send'](e, eeee);
    }
}
