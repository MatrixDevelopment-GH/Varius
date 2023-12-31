import {
    CommandInteraction,
    GuildChannel,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    ThreadChannel,
} from 'discord.js';

import { FormatUtils, InteractionUtils } from './index.js';
import { Command } from '../commands/index.js';
import { Permission } from '../models/enum-helpers/index.js';
import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';

export class CommandUtils {
    public static findCommand(commands: Command[], commandParts: string[]): Command {
        let found = [...commands];
        let closestMatch: Command;
        for (let [index, commandPart] of commandParts.entries()) {
            found = found.filter(command => command.names[index] === commandPart);
            if (found.length === 0) {
                return closestMatch;
            }

            if (found.length === 1) {
                return found[0];
            }

            let exactMatch = found.find(command => command.names.length === index + 1);
            if (exactMatch) {
                closestMatch = exactMatch;
            }
        }
        return closestMatch;
    }

    public static async runChecks(
        command: Command,
        intr: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
        data: EventData
    ): Promise<boolean> {
        if (command.cooldown) {
            let limited: boolean = command.cooldown.take(intr.user.id);
            if (limited) {
                await InteractionUtils.send(
                    intr,
                    Lang.getEmbed('validationEmbeds.cooldownHit', data.lang, {
                        AMOUNT: command.cooldown.amount.toLocaleString(data.lang),
                        INTERVAL: FormatUtils.duration(command.cooldown.interval, data.lang),
                    })
                );
                return false;
            }
        }
        if (command.userCooldowns) {
            // TODO: FIX THIS PART
            let userLimited = command.userCooldowns[intr.user.id];
            if (Object.keys(command.userCooldowns).length !== 0) {
                let limited = userLimited.take(intr.user.id);
                console.log(limited);
                if (limited == true) {
                    console.log('yes');
                    await InteractionUtils.send(
                        intr,
                        Lang.getEmbed('validationEmbeds.userCooldownHit', data.lang, {
                            INTERVAL: FormatUtils.duration(
                                command.userCooldowns[intr.user.id].interval,
                                data.lang
                            ),
                        })
                    );
                    return false;
                }
                return;
            }
        }

        if (
            (intr.channel instanceof GuildChannel || intr.channel instanceof ThreadChannel) &&
            !intr.channel.permissionsFor(intr.client.user).has(command.requireClientPerms)
        ) {
            await InteractionUtils.send(
                intr,
                Lang.getEmbed('validationEmbeds.missingClientPerms', data.lang, {
                    PERMISSIONS: command.requireClientPerms
                        .map(perm => `**${Permission.Data[perm].displayName(data.lang)}**`)
                        .join(', '),
                })
            );
            return false;
        }

        return true;
    }
}
