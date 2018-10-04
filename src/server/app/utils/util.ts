/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import * as puppeteer from 'puppeteer';
import Puppeteer from 'server/app/middleware/puppeteer';

export default class Utils {
    static stringToDefault = (val: string | undefined): string  => {
        if (val === undefined) {
            return '';
        } else {
            return val;
        }
    }

    static screenshotDOMElement = async (url: string, selector: string, padding: number): Promise<Buffer> => {
        const page = Puppeteer.page;
        await page.goto(url, {waitUntil: 'networkidle2'});

        const rect = await page.evaluate((sel: string) => {
            const element = document.querySelector(sel);
            const {top, left, width, height} = element.getBoundingClientRect();
            return {left, top, width, height, id: element.id};
        }, selector);

        return page.screenshot({
            path: 'element.png',
            clip: {
                x: rect.left - padding,
                y: rect.top - padding,
                width: rect.width + padding * 2,
                height: rect.height + padding * 2
            }
        });
    }
}
