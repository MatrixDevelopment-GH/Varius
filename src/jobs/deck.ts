import { cardRank } from '../constants/card-rank.js';
import { Lang } from '../services/lang.js';
import { InteractionUtils, prisma } from '../utils/index.js';

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

    public async updateBalance(userId: any, status: number, bet: number): Promise<void> {
        let user = await prisma.user.findUnique({
            where: {
                user_id: userId,
            },
        });
        let balance = user.balance;
        status == 2 ? balance += bet : status == 0 ? balance -= bet : balance
        if (status == 0) {
            console.log("status 0")
            await prisma.user.update({
                where: {
                    user_id: userId,
                },
                data: {
                    balance: balance,
                },
            });
        } else if (status == 2) {
            console.log("status 2")
            await prisma.user.update({
                where: {
                    user_id: userId,
                },
                data: {
                    balance: balance,
                },
            });
        }
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
        betted: number,
        data: any
    ): Promise<void> {
        let desc = '';
        status == 0 ? desc = 'loseBets' : status == 1 ? desc = 'tieBets' : desc = 'winBets'
        function field(): any {
            return {
                name: 'Cash',
                value: Lang.getRef(`bjDescs.${desc}`, data, {
                    BET: `${betted}`
                }),
                inline: true,
            };
        }

        let embed = Lang.getEmbed('displayEmbeds.bj', data, {
            BJ_PLAYER_HAND: `${Lang.getRef('bjDescs.your_hand', data)} ${this.getHandValueBj(
                playerCards
            )}`,
            BJ_DEALER_HAND: `${Lang.getRef('bjDescs.dealer_hand', data)} ${this.getHandValueBj(
                dealerCards
            )}`,
        })
            .addFields(field())
            .setColor(status == 0 ? 'Red' : status == 1 ? 'Blurple' : 'Green')
            .setDescription(result);
        await InteractionUtils.editReply(intr, { embeds: [embed], components: [] });
    }
}
