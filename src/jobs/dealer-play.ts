import { Deck } from './deck.js';

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
            return await deck.endGameBj(intr, playerCards, dealerCards, 'You win!', 2, data);
        } else if (dealerValue === playerValue) {
            return await deck.endGameBj(intr, playerCards, dealerCards, "It's a tie!", 1, data);
        } else {
            return await deck.endGameBj(intr, playerCards, dealerCards, 'You lose.', 0, data);
        }
    }
}
