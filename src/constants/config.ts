import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export const Config =
    process.env.NODE_ENV === 'production'
        ? require('../../config/config.json')
        : require('../../config/config.local.json');

export const Logs = require('../../lang/logs.json');

export const Debug = require('../../config/debug.json');

export const BotSites = require('../../config/bot-sites.json');

export const TsConfig = require('../../tsconfig.json');
