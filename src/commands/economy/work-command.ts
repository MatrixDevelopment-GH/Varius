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
    public userCooldowns: { [userId: string]: RateLimiter } = {};
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

        let userCooldown = this.userCooldowns[intr.user.id];
        if (!userCooldown) {
            userCooldown = new RateLimiter(1, user.job !== null ? user.job.time * 60 * 1000 : 5000);
            this.userCooldowns[intr.user.id] = userCooldown;
        }

        let job: string;
        let salary: number;
        if (user !== null) {
            job = user.job !== null ? user.job.name : 'None';
            salary = user.job !== null ? user.job.salary : 0;
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
            let requiredReduction: number = user.job.required - 1 <= 0 ? 0 : user.job.required - 1;

            embed = Lang.getEmbed('displayEmbeds.work', data.lang, {
                JOB: job,
                SALARY: `${salary}`,
                REMAINING_SHIFTS: `${
                    requiredReduction == 0
                        ? ''
                        : `, you have ${requiredReduction} shifts left for today.`
                }`,
            });

            await prisma.user.update({
                where: {
                    user_id: intr.user.id,
                },
                data: {
                    balance: (user.balance += salary),
                    job: {
                        update: {
                            required: requiredReduction,
                        },
                    },
                },
            });
        }

        await InteractionUtils.send(intr, { embeds: [embed] });
    }
}
