import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';

import { HelpOption } from '../../enums/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { ClientUtils, FormatUtils, InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class HelpCommand implements Command {
    public names = [Lang.getRef('chatCommands.help', Language.Default)];
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];
    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let args = {
            option: intr.options.getString(
                Lang.getRef('arguments.option', Language.Default)
            ) as HelpOption,
        };

        let embed: EmbedBuilder;
        switch (args.option) {
            case HelpOption.CONTACT_SUPPORT: {
                embed = Lang.getEmbed('displayEmbeds.helpContactSupport', data.lang);
                break;
            }
            case HelpOption.COMMANDS: {
                embed = Lang.getEmbed('displayEmbeds.helpCommands', data.lang, {
                    CMD_LINK_TEST: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.test', Language.Default)
                        )
                    ),
                    CMD_LINK_INFO: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.info', Language.Default)
                        )
                    ),
                    CMD_LINK_PURGE: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.purge', Language.Default)
                        )
                    ),
                    CMD_LINK_CREATE: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.create', Language.Default)
                        )
                    ),
                    CMD_LINK_DELETE: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.delete', Language.Default)
                        )
                    ),
                    CMD_LINK_PORTFOLIO: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.portfolio', Language.Default)
                        )
                    ),
                    CMD_LINK_BJ: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.bj', Language.Default)
                        )
                    ),
                    CMD_LINK_IQ: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.iq', Language.Default)
                        )
                    ),
                    CMD_LINK_JOB: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.job', Language.Default)
                        )
                    ),
                    CMD_LINK_WORK: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.work', Language.Default)
                        )
                    ),
                });
                break;
            }
            default: {
                return;
            }
        }

        await InteractionUtils.send(intr, embed);
    }
}
