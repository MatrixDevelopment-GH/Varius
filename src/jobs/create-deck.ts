import { cardRank } from '../constants/card-rank.js';

export class Deck {
    public createDeck(withJokers: boolean): any {
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

    public shuffle(deck: any): any {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    public getHandValue(hand: any): number {
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
}
