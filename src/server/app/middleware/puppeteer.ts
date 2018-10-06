/**
 * DIscord bot
 *
 * (c) 2018 ryosebach
 */
import * as path from 'path';
import * as puppeteer from 'puppeteer';

import Config from 'server/app/config/config';

export default class Puppeteer {
    static page: puppeteer.Page;

    static async init(): Promise<void> {
        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        this.page = await browser.newPage();

        await this.page.setViewport({width: 1000, height: 600, deviceScaleFactor: 2});
    }

    static screenshotDOMElement = async (url: string, selector: string, padding: number): Promise<Buffer> => {
        await Puppeteer.page.goto(url, {waitUntil: 'networkidle2'});

        const rect = await Puppeteer.page.evaluate((sel: string) => {
            const element = document.querySelector(sel);
            const {top, left, width, height} = element.getBoundingClientRect();
            return {left, top, width, height, id: element.id};
        }, selector);

        return Puppeteer.page.screenshot({
            path: path.join(Config.ROOT_DIR, 'images', 'element.png'),
            clip: {
                x: rect.left - padding,
                y: rect.top - padding,
                width: rect.width + padding * 2,
                height: rect.height + padding * 2
            }
        });
    }

    static screenshotDOMElemtntWithPaddings = async (url: string, selector: string, paddingTop: number, paddingLeft: number, paddingBottom: number, paddingRight: number): Promise<Buffer> => {
        await Puppeteer.page.goto(url, {waitUntil: 'networkidle2'});

        const rect = await Puppeteer.page.evaluate((sel: string) => {
            const element = document.querySelector(sel);
            const {top, left, width, height} = element.getBoundingClientRect();
            return {left, top, width, height, id: element.id};
        }, selector);

        return Puppeteer.page.screenshot({
            path: path.join(Config.ROOT_DIR, 'images', 'element.png'),
            clip: {
                x: rect.left - paddingLeft,
                y: rect.top - paddingTop,
                width: rect.width + paddingLeft + paddingRight,
                height: rect.height + paddingTop + paddingBottom
            }
        });
    }
}
