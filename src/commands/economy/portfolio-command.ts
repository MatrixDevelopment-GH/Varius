import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, prisma } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PortfolioCommand implements Command {
    public names = [Lang.getRef('chatCommands.portfolio', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let args = {
            option:
                intr.options.getUser(Lang.getRef('arguments.portfolio', Language.Default)) ?? intr.user,
        };
        console.log(args.option)
        const user = await prisma.user.findUnique({
            where: {
                user_id: args.option.id
            },
            include: {
                properties: true,
            }
        })

        // TODO: get net worth + all other stats
        function findTotal(): number {
            let total = 0.0;
            user.properties.map( (asset) => {
                total += asset.price
            });
            total += user.balance
            console.log(total);
            return total;
        }

        let embed = Lang.getEmbed('displayEmbeds.portfolio', data.lang, {
            MENTIONED_USER: `${args.option}`,
            NET_WORTH: `${findTotal()}`,
            CASH: `${user.balance}`,
            PROPERTY: `${user.properties.map((asset) => asset.name)}`,
            STOCK: `to be implemented`,
        });
        await InteractionUtils.send(intr, { embeds: [embed] });
    }
}
