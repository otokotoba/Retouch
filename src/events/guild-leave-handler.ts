import { Guild } from 'discord.js';

import { EventHandler } from './index.js';
import { Logs } from '../const.js';
import { Logger } from '../services/index.js';

export class GuildLeaveHandler implements EventHandler {
    public async process(guild: Guild): Promise<void> {
        Logger.info(
            Logs.info.guildLeft
                .replaceAll('{GUILD_NAME}', guild.name)
                .replaceAll('{GUILD_ID}', guild.id)
        );
    }
}
