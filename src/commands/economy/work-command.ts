import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { ClientUtils, FormatUtils, InteractionUtils, prisma } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

// TODO: MAKE A DYNAMIC COOLDOWN SYSTEM
export class WorkCommand implements Command {
    public names = [Lang.getRef('chatCommands.work', Language.Default)];
    public cooldown = new RateLimiter(1, 10800000);
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

        let job: string;
        let salary: number;
        if (user !== null) {
            job = user.job !== null ? user.job.name : 'None';
            salary = user.job !== null ? user.job.salary : 0;
            console.log(job);
            console.log(salary);
            console.log(user.job.required);
            console.log(user.job.id);
        } else {
            console.log('User.Job is null or undefined.');
        }

        let embed: EmbedBuilder;
        if (job == 'None') {
            embed = Lang.getEmbed('displayEmbeds.noJob', data.lang, {
                JOB_CMD: FormatUtils.commandMention(
                    await ClientUtils.findAppCommand(
                        intr.client,
                        Lang.getRef('chatCommands.job', Language.Default)
                    )
                ),
            });
        } else {
            embed = Lang.getEmbed('displayEmbeds.work', data.lang, {
                JOB: job,
                SALARY: `${salary}`,
            });
            let requiredReduction: number = user.job.required - 1 == 0 ? 2 : user.job.required - 1;
            console.log(requiredReduction);
            await prisma.user.update({
                where: {
                    user_id: intr.user.id,
                },
                data: {
                    balance: (user.balance += salary),
                },
            });
        }

        await InteractionUtils.send(intr, { embeds: [embed] });
    }
}
