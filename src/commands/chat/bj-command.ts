import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    PermissionsString,
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { cardRank } from '../../constants/card-rank.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

// TODO: Add a function to make sure you don't get repeating cards
function getRandomCard(): {
    rank: string;
    suit: string;
} {
    const rank = cardRank.ranks[Math.floor(Math.random() * cardRank.ranks.length)];
    const suit = cardRank.suits[Math.floor(Math.random() * cardRank.suits.length)];
    return { rank, suit };
}

// TODO: Add a func to calculate the value of your hand
function getScore(): number {
    let val = 0;
    let aces = 0;

    return val;
}

// TODO: Add a way to draw new cards and put em into the player's hands
// TODO: Add a
export class BjCommand implements Command {
    public names = [Lang.getRef('chatCommands.bj', Language.Default)];
    public cooldown = new RateLimiter(1, 10000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        // The initial hand of both the player & the dealer
        const playerCards = [getRandomCard(), getRandomCard()];
        const dealerCards = [getRandomCard()];

        let embed = Lang.getEmbed('displayEmbeds.bj', data.lang, {
            BJ_PLAYER_HAND: `${playerCards.map(i => i.rank + ' of ' + i.suit + ' ')}`,
            BJ_DEALER_HAND: `${dealerCards.map(i => i.rank + ' of ' + i.suit + ' ')}`,
        });

        const hit = new ButtonBuilder()
            .setCustomId('hit')
            .setLabel('Hit')
            .setStyle(ButtonStyle.Primary);
        const stand = new ButtonBuilder()
            .setCustomId('stand')
            .setLabel('Stand')
            .setStyle(ButtonStyle.Primary);
        const row: ActionRowBuilder<ButtonBuilder> =
            new ActionRowBuilder<ButtonBuilder>().addComponents(hit, stand);

        await InteractionUtils.send(intr, { embeds: [embed], components: [row] });
    }
}
