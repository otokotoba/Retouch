import KeyvRedis from '@keyv/redis';
import { expect } from 'chai';
import 'dotenv/config';
import { Keyv } from 'keyv';
import * as sinon from 'sinon';

import { SettingsCommand } from '../../src/commands/chat/settings-command.js';
import { Settings } from '../../src/models/database.js';
import { Language } from '../../src/models/enum-helpers/index.js';
import { EventData } from '../../src/models/internal-models.js';
import { InteractionUtils } from '../../src/utils/index.js';
import { DiscordMock } from '../discord-mock.js';

describe('Settings command', () => {
    const discord = new DiscordMock();
    const db = new Keyv(new KeyvRedis(process.env.REDIS_URL));
    const command = new SettingsCommand(db);

    beforeEach(() => {
        sinon
            .stub(discord.eventDataService, 'create')
            .resolves(new EventData(Language.Default, Language.Default));
    });

    afterEach(() => {
        sinon.restore();
    });

    after(async () => {
        await db.disconnect();
    });

    it('should save the channel id on database when the sub command is log-channel.', async () => {
        const [channelId, guildId] = ['1', '1'];

        sinon
            .stub(discord.chatInputCommandInteraction.options, 'getSubcommand')
            .returns('log-channel');
        sinon
            .stub(discord.chatInputCommandInteraction.options, 'getChannel')
            .returns(discord.textChannel);

        sinon.stub(discord.textChannel, 'id').get(() => channelId);
        sinon.stub(discord.chatInputCommandInteraction, 'guildId').get(() => guildId);

        sinon.stub(InteractionUtils, 'send').resolves();

        await command.execute(
            discord.chatInputCommandInteraction,
            await discord.eventDataService.create()
        );

        const settings = await db.get<Settings>(guildId);

        expect(settings?.logChannel).to.be.equals(channelId);
    });
});
