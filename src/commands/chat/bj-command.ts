// importing the class "Command" and other necessary classes and modules
import { Command, CommandDeferType } from '../index.js';
import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import require from 'node-fetch';

// importing utilities
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { cardRank } from '../../constants/card-rank.js';

// TODO: getting the image loading to work. Error: Image is seen as a module
function loadImg(rank: string, suit: string): any {
    const imagePath = `${rank}_of_${suit}.png`;
    const imageModule = require(`../../../assets/cards/${imagePath}`);
    return imageModule;
}

function getRandomCard(): any {
    const rank = cardRank.ranks[Math.floor(Math.random() * cardRank.ranks.length)];
    const suit = cardRank.suits[Math.floor(Math.random() * cardRank.suits.length)];
    console.log(rank + suit);
    const card = loadImg(rank, suit);
    console.log(card);
    return card;
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
            BJ_PLAYER_HAND: `${playerCards.map(i => i)}`,
            BJ_DEALER_HAND: `${dealerCards.map(i => i)}`,
        });
        await InteractionUtils.send(intr, embed);
    }
}
