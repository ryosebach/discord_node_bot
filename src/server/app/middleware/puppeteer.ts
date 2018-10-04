/**
 * DIscord bot
 *
 * (c) 2018 ryosebach
 */
import * as puppeteer from 'puppeteer';

export default class Pptr {
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
}
