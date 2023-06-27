import { Deck } from './deck.js';
import { Lang } from '../services/lang.js';

export class DealerPlay {
    public async dealerPlayBj(
        intr: any,
        playerCards: any,
        dealerCards: any,
        data: any,
        betted: number
    ): Promise<any> {
        const deck = new Deck();

        while (deck.getHandValueBj(dealerCards) < 17) {
            dealerCards.push(deck.drawCard());
        }

        const playerValue = deck.getHandValueBj(playerCards);
        const dealerValue = deck.getHandValueBj(dealerCards);

        if (dealerValue > 21 || dealerValue < playerValue) {
            deck.updateBalance(intr.user.id, 2, betted);
            return await deck.endGameBj(
                intr,
                playerCards,
                dealerCards,
                Lang.getRef('bjDescs.win', data),
                2,
                betted,
                data
            );
        } else if (dealerValue === playerValue) {
            return await deck.endGameBj(
                intr,
                playerCards,
                dealerCards,
                Lang.getRef('bjDescs.tie', data),
                1,
                betted,
                data
            );
        } else {
            deck.updateBalance(intr.user.id, 0, betted);
            return await deck.endGameBj(
                intr,
                playerCards,
                dealerCards,
                Lang.getRef('bjDescs.lose', data),
                0,
                betted,
                data
            );
        }
    }
}
