import { Guild } from 'discord.js';

import { EventHandler } from './index.js';
import { Logs } from '../constants/config.js';
import { Language } from '../models/enum-helpers/index.js';
import { EventDataService, Lang, Logger } from '../services/index.js';
import { ClientUtils, FormatUtils, MessageUtils } from '../utils/index.js';

export class GuildJoinHandler implements EventHandler {
    constructor(private eventDataService: EventDataService) {}

    public async process(guild: Guild): Promise<void> {
        Logger.info(
            Logs.info.guildJoined
                .replaceAll('{GUILD_NAME}', guild.name)
                .replaceAll('{GUILD_ID}', guild.id)
        );

        let owner = await guild.fetchOwner();

        // Get data from database
        let data = await this.eventDataService.create({
            user: owner?.user,
            guild,
        });

        // Send welcome message to the server's notify channel
        let notifyChannel = await ClientUtils.findNotifyChannel(guild, data.langGuild);
        if (notifyChannel) {
            await MessageUtils.send(
                notifyChannel,
                Lang.getEmbed('displayEmbeds.welcome', data.langGuild, {
                    CMD_LINK_HELP: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            guild.client,
                            Lang.getRef('chatCommands.help', Language.Default)
                        )
                    ),
                }).setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL(),
                })
            );
        }
    }
}
