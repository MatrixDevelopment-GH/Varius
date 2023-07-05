import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ComponentType,
    PermissionsString,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from 'discord.js';
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
        let args = {
            option: intr.options.getString(Lang.getRef('arguments.option', data.lang)) as JobOption,
        };
        let user = await prisma.user.findUnique({
            where: {
                user_id: intr.user.id,
            },
            include: {
                job: true,
            },
        });
        // TODO: FIX THE FUCKIN BUGS HERE
        switch (args.option) {
            case 'APPLY':
                const select = new StringSelectMenuBuilder()
                    .setCustomId('job')
                    .setPlaceholder('Make a selection!')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setEmoji("889984011865292800")
                            .setLabel(Lang.getRef('jobDescs.cashier', data.lang))
                            .setValue(Lang.getRef('jobDescs.cashier', data.lang))
                    )
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setEmoji('1114545433948213288')
                            .setLabel(Lang.getRef('jobDescs.janitor', data.lang))
                            .setValue(Lang.getRef('jobDescs.janitor', data.lang))
                    );
                const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
                await InteractionUtils.send(intr, {
                    embeds: [Lang.getEmbed('displayEmbeds.jobApply', data.lang)],
                    components: [row],
                });

                const filter: any = i => i.user.id === intr.user.id;
                const collector = intr.channel.createMessageComponentCollector({
                    componentType: ComponentType.StringSelect,
                    filter: filter,
                    time: 20000,
                });
                collector.on('collect', async i => {
                    if (i.customId == 'job') {
                        await InteractionUtils.send(intr, `${i.values}`);
                        console.log(i.values);
                    }
                });
                break;
            case 'LIST':
                await InteractionUtils.send(
                    intr,
                    Lang.getEmbed('displayEmbeds.jobList', data.lang)
                );
                break;
        }
    }
}
