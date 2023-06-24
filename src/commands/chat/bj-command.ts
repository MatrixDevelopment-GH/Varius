// importing the class "Command" and other necessary classes and modules
import { Command, CommandDeferType } from '../index.js';
import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

// importing utilities
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { cardRank } from '../../constants/card-rank.js';

function getRandomCard(): {
    rank: string;
    suit: string;
} {
    const rank = cardRank.ranks[Math.floor(Math.random() * cardRank.ranks.length)];
    const suit = cardRank.suits[Math.floor(Math.random() * cardRank.suits.length)];
    console.log(rank + suit);
    return { rank, suit };
}

export class BjCommand implements Command {
    public names = [Lang.getRef('chatCommands.bj', Language.Default)];
    public cooldown = new RateLimiter(1, 10000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const playerCards = [getRandomCard(), getRandomCard()];
        const dealerCards = [getRandomCard(), getRandomCard()];
        let embed = Lang.getEmbed('displayEmbeds.bj', data.lang, {
            BJ_PLAYER_HAND: `${playerCards.map(card => card.rank + card.suit + ' ')}`,
            BJ_DEALER_HAND: `${dealerCards.map(card => card.rank + card.suit + ' ')}`,
        });
        await InteractionUtils.send(intr, embed);
    }
}
