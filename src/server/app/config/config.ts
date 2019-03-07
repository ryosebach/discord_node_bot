/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import * as dotenv from 'dotenv';
import * as i18n from 'i18n';
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
        // i18nの初期化
        i18n.configure({
          directory: `${Config.ROOT_DIR}/locales/server`,
          autoReload: true,
          updateFiles: false
        });
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
