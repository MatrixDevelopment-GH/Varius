import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    PermissionsString,
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Deck } from '../../jobs/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

function drawCard(): {
    rank: string;
    suit: string;
} {
    const deck = new Deck();
    const createDeck = deck.createDeck(false);
    const card = createDeck.pop();
    console.log(card);
    return card;
}

function getVal(hand: any): number {
    const deck = new Deck();
    const val = deck.getHandValue(hand);
    return val;
}

// TODO: Add a way to draw new cards and put em into the player's hands
// TODO: Add a win mechanism
export class BjCommand implements Command {
    public names = [Lang.getRef('chatCommands.bj', Language.Default)];
    public cooldown = new RateLimiter(1, 10000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        // The initial hand of both the player & the dealer
        const playerCards = [drawCard(), drawCard()];
        const dealerCards = [drawCard()];

        let embed = Lang.getEmbed('displayEmbeds.bj', data.lang, {
            BJ_PLAYER_HAND: `
            ${playerCards.map(i => i.rank + ' of ' + i.suit + ' ')}
            , current points: ${getVal(playerCards)}
            `,
            BJ_DEALER_HAND: `
            ${dealerCards.map(i => i.rank + ' of ' + i.suit + ' ')}, ?
            ( current points: ${getVal(dealerCards)}) 
            `,
        }).setColor('Random');

        const hit = new ButtonBuilder()
            .setCustomId('hit')
            .setLabel(Lang.getRef('bjOptions.hit', Language.Default))
            .setStyle(ButtonStyle.Primary);
        const stand = new ButtonBuilder()
            .setCustomId('stand')
            .setLabel(Lang.getRef('bjOptions.stand', Language.Default))
            .setStyle(ButtonStyle.Primary);
        const row: ActionRowBuilder<ButtonBuilder> =
            new ActionRowBuilder<ButtonBuilder>().addComponents(hit, stand);

        await InteractionUtils.send(intr, { embeds: [embed], components: [row] });
    }
}
