import { ChannelType, ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { Keyv } from 'keyv';

import { Settings } from '../../models/database.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { ClientUtils, InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class SettingsCommand implements Command {
    constructor(private db: Keyv) {}

    public names = [Lang.getRef('chatCommands.settings', Language.Default)];
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const subCommand = intr.options.getSubcommand(true);

        switch (subCommand) {
            case 'log-channel': {
                const channel = intr.options.getChannel(
                    Lang.getRef('arguments.channel', Language.Default),
                    true,
                    [ChannelType.GuildText]
                );

                const value: Settings = (await this.db.has(intr.guildId))
                    ? { ...(await this.db.get<Settings>(intr.guildId)), logChannel: channel.id }
                    : { logChannel: channel.id };

                await this.db.set(intr.guildId, value);

                break;
            }
            case 'list': {
                const settings = await this.db.get<Settings>(intr.guildId);

                await InteractionUtils.send(
                    intr,
                    Lang.getEmbed('displayEmbeds.settingsList', data.lang, {
                        LOG_CHANNEL: (
                            await ClientUtils.getChannel(intr.client, settings.logChannel)
                        ).toString(),
                    })
                );

                break;
            }
            default: {
                break;
            }
        }
    }
}
