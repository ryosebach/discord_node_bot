/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import * as cron from 'cron';
import {Attachment} from 'discord.js';

import DiscordBot from 'server/app/middleware/discordBot';
import Puppeteer from 'server/app/middleware/puppeteer';

export const checkMorningWeatherInfo = new cron.CronJob('20 0 6 * * *', async () => {
        const buffer = await Puppeteer.screenshotDOMElement('https://weather.yahoo.co.jp/weather/jp/13/4410.html', 'div .forecastCity', 2);
        const attachment = new Attachment(buffer, 'weather.png');
        await DiscordBot.newsChannel.send('', attachment);
    },
    undefined,
    false,
    'Asia/Tokyo'
);
