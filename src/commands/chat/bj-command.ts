import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { cardRank } from '../../constants/card-rank.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadImage(rank: string, suit: string): Promise<Buffer> {
    const imagePath = join(
        __dirname,
        '..',
        '..',
        '..',
        'assets',
        'images',
        `${rank}_of_${suit}.png`
    );
    console.log(imagePath);
    try {
        const imageData = await fs.readFile(imagePath);
        return imageData;
    } catch (error) {
        throw new Error(`Error reading image file '${imagePath}': ${error}`);
    }
}

function getRandomCard(): any {
    const rank = cardRank.ranks[Math.floor(Math.random() * cardRank.ranks.length)];
    const suit = cardRank.suits[Math.floor(Math.random() * cardRank.suits.length)];
    console.log(rank + suit);
    const card = loadImage(rank, suit);
    console.log(card);
    return card;
}
// TODO: Add buttons for options: Hit/Pass/Double
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
