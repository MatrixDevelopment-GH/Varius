import {
    APIApplicationCommandBasicOption,
    APIApplicationCommandNumberOption,
    APIApplicationCommandUserOption,
    ApplicationCommandOptionType,
} from 'discord.js';

import { HelpOption, InfoOption, MoneyOption } from '../enums/index.js';
import { Language } from '../models/enum-helpers/index.js';
import { Lang } from '../services/index.js';

export class Args {
    public static readonly IQ_OPTION: APIApplicationCommandUserOption = {
        name: Lang.getRef('arguments.iq', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.iq'),
        description: Lang.getRef('argDescs.iqOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.iqOption'),
        type: ApplicationCommandOptionType.User,
    };
    public static readonly PORTFOLIO_OPTION: APIApplicationCommandUserOption = {
        name: Lang.getRef('arguments.portfolio', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.portfolio'),
        description: Lang.getRef('argDescs.portOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.portOption'),
        type: ApplicationCommandOptionType.User,
    };
    public static readonly BJ_OPTION: APIApplicationCommandNumberOption = {
        name: Lang.getRef('arguments.bj', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.bj'),
        description: Lang.getRef('argDescs.bjOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.bjOption'),
        type: ApplicationCommandOptionType.Number,
    };
    public static readonly PURGE_OPTION: APIApplicationCommandNumberOption = {
        name: Lang.getRef('arguments.purge', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.purge'),
        description: Lang.getRef('argDescs.purgeOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.purgeOption'),
        type: ApplicationCommandOptionType.Number,
    };
    public static readonly MONEY_OPTION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.option', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.option'),
        description: Lang.getRef('argDescs.moneyOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.moneyOption'),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: Lang.getRef('cashOptionDescs.add', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('cashOptionDescs.add'),
                value: MoneyOption.ADDCASH,
            },
            {
                name: Lang.getRef('cashOptionDescs.sub', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('cashOptionDescs.sub'),
                value: MoneyOption.SUBTRACTCASH,
            },
        ],
    };
    public static readonly MONEY_USER_OPTION: APIApplicationCommandUserOption = {
        name: Lang.getRef('arguments.cashUser', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.cashUser'),
        description: Lang.getRef('argDescs.cashUserOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.cashUserOption'),
        type: ApplicationCommandOptionType.User,
    };
    public static readonly MONEY_NUMBER_OPTION: APIApplicationCommandNumberOption = {
        name: Lang.getRef('arguments.cash', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.cash'),
        description: Lang.getRef('argDescs.addsubMoneyOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.addsubMoneyOption'),
        type: ApplicationCommandOptionType.Number,
    };
    public static readonly HELP_OPTION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.option', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.option'),
        description: Lang.getRef('argDescs.helpOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.helpOption'),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: Lang.getRef('helpOptionDescs.contactSupport', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('helpOptionDescs.contactSupport'),
                value: HelpOption.CONTACT_SUPPORT,
            },
            {
                name: Lang.getRef('helpOptionDescs.commands', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('helpOptionDescs.commands'),
                value: HelpOption.COMMANDS,
            },
        ],
    };
    public static readonly INFO_OPTION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.option', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.option'),
        description: Lang.getRef('argDescs.helpOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.helpOption'),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: Lang.getRef('infoOptions.about', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('infoOptions.about'),
                value: InfoOption.ABOUT,
            },
            {
                name: Lang.getRef('infoOptions.translate', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('infoOptions.translate'),
                value: InfoOption.TRANSLATE,
            },
            {
                name: Lang.getRef('infoOptions.dev', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('infoOptions.dev'),
                value: InfoOption.DEV,
            },
        ],
    };
}
