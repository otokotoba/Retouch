import { ChannelType, ChatInputCommandInteraction, PermissionsString } from 'discord.js';

import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { Command, CommandDeferType } from '../index.js';

export class SettingsCommand implements Command {
    public names = [Lang.getRef('chatCommands.settings', Language.Default)];
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction): Promise<void> {
        const subCommand = intr.options.getSubcommand(true);

        switch (subCommand) {
            case 'log-channel': {
                const channel = intr.options.getChannel(
                    Lang.getRef('arguments.channel', Language.Default),
                    true,
                    [ChannelType.GuildText]
                );
                console.log(channel);
                break;
            }
            default: {
                break;
            }
        }
    }
}
