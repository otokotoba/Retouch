import { Message, TextBasedChannel, TextChannel } from 'discord.js';
import { Keyv } from 'keyv';

import { Trigger } from './trigger.js';
import { Logs } from '../constants/config.js';
import { Settings } from '../models/database.js';
import { EventData } from '../models/internal-models.js';
import { ClientUtils, MessageUtils } from '../utils/index.js';

const TOKEN_REGEX = /[\w-]{10,}\.[\w-]{6,}\.[\w-]{20,}/g;

export class TokenTrigger implements Trigger {
    constructor(private db: Keyv) {}

    public requireGuild = true;

    public triggered(msg: Message): boolean {
        const content = msg.content;

        if (!content) {
            return false;
        }

        const tokens = Array.from(content.matchAll(TOKEN_REGEX), arr => arr[0]);

        return tokens.length > 0;
    }

    public async execute(msg: Message<boolean>, data: EventData): Promise<void> {
        let logChannel: TextBasedChannel;

        const settings = await this.db.get<Settings>(msg.guildId);
        if (settings?.logChannel) {
            logChannel = (await ClientUtils.getChannel(
                msg.client,
                settings.logChannel
            )) as TextChannel;
        } else {
            logChannel = await ClientUtils.findNotifyChannel(msg.guild, data.langGuild);
        }

        if (logChannel) {
            await MessageUtils.send(
                logChannel,
                Logs.warn.tokenTriggerLog.replaceAll('{USER}', msg.author)
            );
        }

        if (msg.deletable) {
            await msg.delete();
        } else {
            await msg.reply(Logs.warn.tokenTriggerReply);
        }
    }
}
