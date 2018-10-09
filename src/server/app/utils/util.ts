/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import * as puppeteer from 'puppeteer';

export default class Utils {
    static stringToDefault = (val: string | undefined): string  => {
        if (val === undefined) {
            return '';
        } else {
            return val;
        }
    }
}
