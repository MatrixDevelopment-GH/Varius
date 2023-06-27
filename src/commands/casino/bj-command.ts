import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    PermissionsString,
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { DealerPlay, Deck } from '../../jobs/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, prisma } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

const deck = new Deck();
const dealer = new DealerPlay();

export class BjCommand implements Command {
    public names = [Lang.getRef('chatCommands.bj', Language.Default)];
    public cooldown = new RateLimiter(1, 10000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    // TODO: Add a betting system
    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let args = {
            option: intr.options.getInteger('arguments.bj') ?? 50,
        };
        console.log(intr.options.getInteger('arguments.bj'))
        let betted = args.option;
        console.log(args.option);

        // Checks to see if user has account
        const id = intr.user.id;
        let user = await prisma.user.findUnique({
            where: {
                user_id: id,
            },
        });

        if (!user) {
            await prisma.user.create({
                data: {
                    user_id: id,
                },
            });
            await InteractionUtils.send(intr, {
                embeds: [Lang.getEmbed('displayEmbeds.accountNotCreated', data.lang)],
            });
        } else {
            // The initial hand of both the player & the dealer
            const playerCards = [deck.drawCard(), deck.drawCard()];
            const dealerCards = [deck.drawCard()];

            let embed = Lang.getEmbed('displayEmbeds.bj', data.lang, {
                BJ_PLAYER_HAND: `${Lang.getRef(
                    'bjDescs.your_hand',
                    data.lang
                )} ${deck.getHandValueBj(playerCards)}`,
                BJ_DEALER_HAND: `${Lang.getRef(
                    'bjDescs.dealer_hand',
                    data.lang
                )} ${deck.getHandValueBj(dealerCards)}`,
            }).setColor('Random');

            const hit = new ButtonBuilder()
                .setCustomId('hit')
                .setLabel(Lang.getRef('bjOptions.hit', Language.Default))
                .setStyle(ButtonStyle.Primary);
            const stand = new ButtonBuilder()
                .setCustomId('stand')
                .setLabel(Lang.getRef('bjOptions.stand', Language.Default))
                .setStyle(ButtonStyle.Primary);
            const double = new ButtonBuilder()
                .setCustomId('double')
                .setLabel(Lang.getRef('bjOptions.double', Language.Default))
                .setStyle(ButtonStyle.Danger)
                .setDisabled(deck.getHandValueBj(playerCards) > 16);
            const row: ActionRowBuilder<ButtonBuilder> =
                new ActionRowBuilder<ButtonBuilder>().addComponents(double, hit, stand);

            await InteractionUtils.send(intr, { embeds: [embed], components: [row] });

            const filter: any = i => i.user.id === intr.user.id;
            const collector = intr.channel.createMessageComponentCollector({
                filter: filter,
                time: 20000,
            });

            collector.on('collect', async i => {
                let doubled = 0;
                switch (i.customId) {
                    case 'double':
                        doubled += 1;
                        betted *= 2;
                        console.log(betted);
                        if (deck.getHandValueBj(playerCards) > 15 || doubled >= 5) {
                            row[0].setDisabled(true);
                        }
                        embed.setDescription(
                            `${Lang.getRef('bjDescs.bet', data.lang, {
                                BET: `${betted}`,
                            })}`
                        );
                        await InteractionUtils.editReply(intr, {
                            embeds: [embed],
                            components: [row],
                        });
                        collector.resetTimer();
                        break;
                    case 'hit':
                        const newCard = deck.drawCard();
                        playerCards.push(newCard);
                        const handValue = deck.getHandValueBj(playerCards);

                        if (handValue > 21) {
                            collector.stop();
                            deck.updateBalance(intr.user.id, 0, betted);
                            return await deck.endGameBj(
                                intr,
                                playerCards,
                                dealerCards,
                                `${Lang.getRef('bjDescs.lose', data.lang)}`,
                                0,
                                betted,
                                data.lang
                            );
                        }
                        if (handValue == 21) {
                            collector.stop();
                            deck.updateBalance(intr.user.id, 2, betted);
                            return await deck.endGameBj(
                                intr,
                                playerCards,
                                dealerCards,
                                `${Lang.getRef('bjDescs.win', data.lang)}`,
                                2,
                                betted,
                                data.lang
                            );
                        }

                        embed = Lang.getEmbed('displayEmbeds.bj', data.lang, {
                            BJ_PLAYER_HAND: `${Lang.getRef(
                                'bjDescs.your_hand',
                                data.lang
                            )} ${handValue}`,
                            BJ_DEALER_HAND: `${Lang.getRef(
                                'bjDescs.dealer_hand',
                                data.lang
                            )} ${deck.getHandValueBj(dealerCards)}`,
                        });
                        embed.setDescription(
                            `${Lang.getRef('bjDescs.draw_card', data.lang, {
                                RANK: newCard.rank,
                                SUIT: newCard.suit,
                            })}`
                        );
                        await InteractionUtils.editReply(intr, { embeds: [embed] });
                        collector.resetTimer();
                        break;
                    case 'stand':
                        collector.stop();
                        await dealer.dealerPlayBj(
                            intr,
                            playerCards,
                            dealerCards,
                            data.lang,
                            betted
                        );
                        break;
                }
            });
        }
    }
}
