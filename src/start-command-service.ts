import { REST } from '@discordjs/rest';

import {
    ChatCommandMetadata,
    MessageCommandMetadata,
    UserCommandMetadata,
} from './commands/index.js';
import { Config, Logs } from './constants/config.js';
import { CommandService, Logger } from './services/index.js';

async function start(): Promise<void> {
    try {
        let rest = new REST({ version: '10' }).setToken(Config.client.token);
        let commandService = new CommandService(rest);
        let localCmds = [
            ...Object.values(ChatCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
            ...Object.values(MessageCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
            ...Object.values(UserCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
        ];
        await commandService.process(localCmds, process.argv);
    } catch (error) {
        Logger.error(Logs.error.commandAction, error);
    }
    // Wait for any final logs to be written.
    await new Promise(resolve => setTimeout(resolve, 1000));
    process.exit();
}

start().catch(error => {
    Logger.error(Logs.error.unspecified, error);
});
