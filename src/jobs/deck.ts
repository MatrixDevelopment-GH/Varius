import { cardRank } from '../constants/card-rank.js';
import { Lang } from '../services/lang.js';
import { InteractionUtils } from '../utils/interaction-utils.js';

export class Deck {
    public shuffle(deck: any): any {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    public drawCard(): {
        rank: string;
        suit: string;
    } {
        const createDeck = this.createDeckBj(false);
        const card = createDeck.pop();
        console.log(card);
        return card;
    }

    public createDeckBj(withJokers: boolean): any {
        const suits = cardRank.suits;
        const ranks = cardRank.ranks;
        const ranksWithJokers = cardRank.ranksWithJoker;
        const deck = [];

        for (const suit of suits) {
            if (!withJokers) {
                for (const rank of ranks) {
                    deck.push({ suit, rank });
                }
            } else {
                for (const rank of ranksWithJokers) {
                    deck.push({ suit, rank });
                }
            }
        }

        return this.shuffle(deck);
    }

    public getHandValueBj(hand: any): number {
        let value = 0;
        let hasAce = false;

        for (const card of hand) {
            if (card.rank === 'Ace') {
                value += 11;
                hasAce = true;
            } else if (['King', 'Queen', 'Jack'].includes(card.rank)) {
                value += 10;
            } else {
                value += parseInt(card.rank);
            }
        }

        if (hasAce && value > 21) {
            value -= 10;
        }

        return value;
    }

    public async endGameBj(
        intr: any,
        playerCards: any,
        dealerCards: any,
        result: string,
        status: number,
        data: any
    ): Promise<void> {
        let embed = Lang.getEmbed('displayEmbeds.bj', data, {
            BJ_PLAYER_HAND: `Player's Hand: ${this.getHandValueBj(playerCards)}`,
            BJ_DEALER_HAND: `Dealer's Hand: ${this.getHandValueBj(dealerCards)}`,
        })
            .setColor(status == 0 ? 'Red' : status == 1 ? 'Blurple' : 'Green')
            .setDescription(result);

        await InteractionUtils.editReply(intr, { embeds: [embed], components: [] });
    }
}
