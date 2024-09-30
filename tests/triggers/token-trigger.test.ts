/* eslint-disable @typescript-eslint/unbound-method */
import KeyvRedis from '@keyv/redis';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { Keyv } from 'keyv';
import * as sinon from 'sinon';

import { TriggerHandler } from '../../src/events/trigger-handler.js';
import { Language } from '../../src/models/enum-helpers/language.js';
import { EventData } from '../../src/models/internal-models.js';
import { TokenTrigger } from '../../src/triggers/token-trigger.js';
import { FormatUtils } from '../../src/utils/format-utils.js';
import { DiscordMock } from '../discord-mock.js';

const URLS = [
    'https://www.google.com',
    'http://google.com/?q=some+text&param=3#dfsdf',
    'https://www.asd.google.com/search?q=some+text&param=3#dfsdf',
    'https://www.google.com/api/',
    'https://www.google.com/api/login.php',
    'https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-bot-s-token',
];

const TOKENS = [
    'OTk0MeQ3MDgxMjk0Njg0MjQw.LqsoPU.OeISfrT8o4SoLoPE7IPaIFWdOPa8PXOR8esdoO',
    'MTAwMzQyMDO0ozQ2O7g3MzM3Pf.E84Oip.80oOjExirQOPso5_Os8EoSoKwsEXAo9vMEp01s',
];

describe('Token trigger', () => {
    dotenv.config();

    const discord = new DiscordMock();
    const trigger = new TokenTrigger(new Keyv(new KeyvRedis(process.env.REDIS_URL)));

    beforeEach(() => {
        sinon
            .stub(discord.eventDataService, 'create')
            .resolves(new EventData(Language.Default, Language.Default));
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should be triggered when a message includes tokens.', () => {
        const texts = [
            FormatUtils.multiLines(TOKENS),
            FormatUtils.multiLines([...URLS, ...TOKENS]),
        ];

        for (const t of texts) {
            sinon.stub(discord.message, 'content').get(() => t);
            expect(trigger.triggered(discord.message)).to.equal(true);
        }
    });

    it('should be executed when triggered.', async () => {
        const triggerHandler = new TriggerHandler([trigger], discord.eventDataService);

        sinon.stub(trigger, 'triggered').returns(true);
        sinon.stub(trigger, 'execute').resolves();
        sinon.stub(discord.message, 'guild').get(() => true);

        await triggerHandler.process(discord.message);

        sinon.assert.calledOnce(trigger.triggered as sinon.SinonStub);
        sinon.assert.calledOnce(trigger.execute as sinon.SinonStub);
    });

    it('should not be triggered when a message does not include tokens.', () => {
        const texts = [FormatUtils.multiLines(URLS)];

        for (const t of texts) {
            sinon.stub(discord.message, 'content').get(() => t);
            expect(trigger.triggered(discord.message)).to.equal(false);
        }
    });
});
