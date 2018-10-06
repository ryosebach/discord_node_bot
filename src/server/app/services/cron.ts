/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import * as cron from 'server/app/middleware/cron';

export default class Cron {
    static init() {
        cron.checkMorningWeatherInfo.start();
    }
}
