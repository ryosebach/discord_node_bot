/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import * as dotenv from 'dotenv';
import * as log4js from 'log4js';
import * as path from 'path';

import Utils from 'server/app/utils/util';

/**
 * Config
 */
export default class Config {
    static DISCORD_TOKEN: string;
    static ROOT_DIR: string;
    static init(): void {
        dotenv.config();
        this.ROOT_DIR = path.resolve(`${__dirname}/../../../..`);
        this.DISCORD_TOKEN = Utils.stringToDefault(process.env.DISCORD_TOKEN);
        log4js.configure({
            appenders: {
                console: {
                    type: 'console'
                }
            },
            categories: {
                default: {
                    appenders: [
                        'console'
                    ],
                    level: 'INFO'
                }
            }
        });
    }
}
