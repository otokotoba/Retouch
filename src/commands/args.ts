import {
    APIApplicationCommandBasicOption,
    APIApplicationCommandSubcommandOption,
    ApplicationCommandOptionType,
    ChannelType,
} from 'discord.js';

import { DevCommandName, HelpOption, InfoOption } from '../enums/index.js';
import { Language } from '../models/enum-helpers/index.js';
import { Lang } from '../services/index.js';

export class Args {
    public static readonly DEV_COMMAND: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.command', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.command'),
        description: Lang.getRef('argDescs.devCommand', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.devCommand'),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: Lang.getRef('devCommandNames.info', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('devCommandNames.info'),
                value: DevCommandName.INFO,
            },
        ],
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
        description: Lang.getRef('argDescs.infoOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.infoOption'),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: Lang.getRef('infoOptions.about', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('infoOptions.about'),
                value: InfoOption.ABOUT,
            },
            // {
            //     name: Lang.getRef('infoOptions.translate', Language.Default),
            //     name_localizations: Lang.getRefLocalizationMap('infoOptions.translate'),
            //     value: InfoOption.TRANSLATE,
            // },
        ],
    };
    public static readonly SETTINGS_LOG_CHANNEL: APIApplicationCommandSubcommandOption = {
        name: Lang.getRef('chatCommands.settingsLogChannel', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.settingsLogChannel'),
        description: Lang.getRef('commandDescs.settingsLogChannel', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.settingsLogChannel'),
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: Lang.getRef('arguments.channel', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('arguments.channel'),
                description: Lang.getRef('argDescs.settingsLogChannel', Language.Default),
                description_localizations: Lang.getRefLocalizationMap(
                    'argDescs.settingsLogChannel'
                ),
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildText],
                required: true,
            },
        ],
    };
    public static readonly SETTINGS_LIST: APIApplicationCommandSubcommandOption = {
        name: Lang.getRef('chatCommands.settingsList', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.settingsList'),
        description: Lang.getRef('commandDescs.settingsList', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.settingsList'),
        type: ApplicationCommandOptionType.Subcommand,
    };
}
