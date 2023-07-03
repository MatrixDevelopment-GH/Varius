import {
    ApplicationCommandType,
    PermissionsBitField,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord.js';

import { Args } from './index.js';
import { Language } from '../models/enum-helpers/index.js';
import { Lang } from '../services/index.js';

export const ChatCommandMetadata: {
    [command: string]: RESTPostAPIChatInputApplicationCommandsJSONBody;
} = {
    HELP: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.help', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.help'),
        description: Lang.getRef('commandDescs.help', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.help'),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                ...Args.HELP_OPTION,
                required: true,
            },
        ],
    },
    INFO: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.info', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.info'),
        description: Lang.getRef('commandDescs.info', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.info'),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                ...Args.INFO_OPTION,
                required: true,
            },
        ],
    },
    TEST: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.test', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.test'),
        description: Lang.getRef('commandDescs.test', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.test'),
        dm_permission: true,
        default_member_permissions: undefined,
    },
    BJ: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.bj', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.bj'),
        description: Lang.getRef('commandDescs.bj', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.bj'),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                ...Args.BJ_OPTION,
                required: false,
            },
        ],
    },
    IQ: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.iq', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.iq'),
        description: Lang.getRef('commandDescs.iq', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.iq'),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                ...Args.IQ_OPTION,
                required: false,
            },
        ],
    },
    PURGE: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.purge', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.purge'),
        description: Lang.getRef('commandDescs.purge', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.purge'),
        dm_permission: false,
        default_member_permissions: `${PermissionsBitField.Flags.Administrator}`,
        options: [
            {
                ...Args.PURGE_OPTION,
                required: false,
            },
        ],
    },
    PORTFOLIO: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.portfolio', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.portfolio'),
        description: Lang.getRef('commandDescs.portfolio', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.portfolio'),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                ...Args.PORTFOLIO_OPTION,
                required: false,
            },
        ],
    },
    DELETE: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.delete', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.delete'),
        description: Lang.getRef('commandDescs.delete', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.delete'),
        dm_permission: false,
        default_member_permissions: undefined,
    },
    CREATE: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.create', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.create'),
        description: Lang.getRef('commandDescs.create', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.create'),
        dm_permission: false,
        default_member_permissions: undefined,
    },
    WORK: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.work', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.work'),
        description: Lang.getRef('commandDescs.work', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.work'),
        dm_permission: false,
        default_member_permissions: undefined,
    },
    JOB: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.job', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.job'),
        description: Lang.getRef('commandDescs.job', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.job'),
        dm_permission: false,
        default_member_permissions: undefined,
    },
};

export const MessageCommandMetadata: {
    [command: string]: RESTPostAPIContextMenuApplicationCommandsJSONBody;
} = {
    VIEW_DATE_SENT: {
        type: ApplicationCommandType.Message,
        name: Lang.getRef('messageCommands.viewDateSent', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('messageCommands.viewDateSent'),
        default_member_permissions: undefined,
        dm_permission: true,
    },
};

export const UserCommandMetadata: {
    [command: string]: RESTPostAPIContextMenuApplicationCommandsJSONBody;
} = {
    VIEW_DATE_JOINED: {
        type: ApplicationCommandType.User,
        name: Lang.getRef('userCommands.viewDateJoined', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('userCommands.viewDateJoined'),
        default_member_permissions: undefined,
        dm_permission: true,
    },
};
