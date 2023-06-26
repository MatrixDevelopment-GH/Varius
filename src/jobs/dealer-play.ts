import { Deck } from './deck.js';
import { Lang } from '../services/lang.js';

export class DealerPlay {
    public async dealerPlayBj(
        intr: any,
        playerCards: any,
        dealerCards: any,
        data: any
    ): Promise<any> {
        const deck = new Deck();

        while (deck.getHandValueBj(dealerCards) < 17) {
            dealerCards.push(deck.drawCard());
        }

        const playerValue = deck.getHandValueBj(playerCards);
        const dealerValue = deck.getHandValueBj(dealerCards);

        if (dealerValue > 21 || dealerValue < playerValue) {
            return await deck.endGameBj(
                intr,
                playerCards,
                dealerCards,
                Lang.getRef('bjDescs.win', data),
                2,
                data
            );
        } else if (dealerValue === playerValue) {
            return await deck.endGameBj(
                intr,
                playerCards,
                dealerCards,
                Lang.getRef('bjDescs.tie', data),
                1,
                data
            );
        } else {
            return await deck.endGameBj(
                intr,
                playerCards,
                dealerCards,
                Lang.getRef('bjDescs.lose', data),
                0,
                data
            );
        }
    }
}
