/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Attachment, Message, TextChannel} from 'discord.js';
import * as log4js from 'log4js';
import * as moment from 'moment';

import Puppeteer from 'server/app/middleware/puppeteer';
import * as cheerio from 'server/app/services/cheerio';
import * as yahooWeather from 'server/app/utils/yahooServices';

const logger = log4js.getLogger('console');

const clearBotMessage = async (channel: TextChannel, name?: string): Promise<void> => {
    const messages = await channel.fetchMessages({ limit: 10});
    for (const val of messages.array()) {
        if (val.author.username !== 'Nyanko' ||
            (name && !val.attachments.first().filename.match(new RegExp(`${name}`)))) {
            continue;
        }
        val.delete();
    }
};

export const sendWeatherInfo = async (mes: Message): Promise<void> => {
    await clearBotMessage(mes.channel as TextChannel, 'weather');
    const buffer = await Puppeteer.screenshotDOMElement('https://weather.yahoo.co.jp/weather/jp/13/4410.html', 'div .forecastCity', 2);
    const attachment = new Attachment(buffer, `weather-${moment().format('HHmmss')}.png`);
    await mes.delete();
    await mes.channel.send('', attachment);
};

export const sendRainCloudGif = async (mes: Message): Promise<void> => {
    const rainCloudInfo = mes.content.replace(/( |　)+/g, ' ');
    const rainCloudInfos = rainCloudInfo.split(' ');
    await clearBotMessage(mes.channel as TextChannel, 'rain_cloud');
    const url = yahooWeather.rainCloudUrl[rainCloudInfos[1] ? rainCloudInfos[1] : 'kanto'];
    const buffer = await cheerio.fetchRainCloudRadorGif(url);
    const attachment = new Attachment(buffer, `rain_cloud-${moment().format('HHmmss')}.gif`);
    await mes.delete();
    await mes.channel.send('', attachment);
};

export const sendKantoTrainInfo = async (mes: Message): Promise<void> => {
    await clearBotMessage(mes.channel as TextChannel, 'train_info');
    const buffer = await Puppeteer.screenshotDOMElement('https://transit.yahoo.co.jp/traininfo/area/4/', 'div #mdStatusTroubleLine', 5);
    const attachment = new Attachment(buffer, `train_info-${moment().format('HHmmss')}.png`);
    await mes.delete();
    await mes.channel.send('', attachment);
};

export const sendMyTrainInfo = async (mes: Message): Promise<void> => {
    await clearBotMessage(mes.channel as TextChannel, 'train_info');
    mes.delete();
    for (const info of yahooWeather.trainInfos) {
        const buffer = await Puppeteer.screenshotDOMElemtntWithPaddings(info.url, info.selector, info.paddingTop, info.paddingLeft, info.paddingBottom, info.paddingRight);
        const attachment = new Attachment(buffer, `train_info_${info.route_name}_${moment().format('HHmmss')}.png`);
        await mes.channel.send('', attachment);
    }
};
