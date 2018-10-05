/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Attachment, Message, TextChannel} from 'discord.js';
import * as log4js from 'log4js';

import Puppeteer from 'server/app/middleware/puppeteer';
import * as cheerio from 'server/app/services/cheerio';
import * as yahooWeather from 'server/app/utils/yahooServices';

const logger = log4js.getLogger('console');

const clearBotMessage = async (channel: TextChannel): Promise<void> => {
    const messages = await channel.fetchMessages({ limit: 10});
    for (const val of messages.array()) {
      if (val.author.username !== 'Nyanko') { continue; }
      val.delete();
    }
};

export const sendWeatherInfo = async (mes: Message): Promise<void> => {
    await clearBotMessage(mes.channel as TextChannel);
    const buffer = await Puppeteer.screenshotDOMElement('https://weather.yahoo.co.jp/weather/jp/13/4410.html', 'div .forecastCity', 2);
    const attachment = new Attachment(buffer, 'weather.png');
    await mes.delete();
    await mes.channel.send('', attachment);
};

export const sendRainCloudGif = async (mes: Message): Promise<void> => {
    const rainCloudInfo = mes.content.replace(/( |　)+/g, ' ');
    const rainCloudInfos = rainCloudInfo.split(' ');
    await clearBotMessage(mes.channel as TextChannel);
    const url = yahooWeather.rainCloudUrl[rainCloudInfos[1] ? rainCloudInfos[1] : 'kanto'];
    const buffer = await cheerio.fetchRainCloudRadorGif(url);
    const attachment = new Attachment(buffer, 'weather.gif');
    await mes.delete();
    await mes.channel.send('', attachment);
};

export const sendKantoTrainInfo = async (mes: Message): Promise<void> => {
    await clearBotMessage(mes.channel as TextChannel);
    const buffer = await Puppeteer.screenshotDOMElement('https://transit.yahoo.co.jp/traininfo/area/4/', 'div #mdStatusTroubleLine', 5);
    const attachment = new Attachment(buffer, 'weather.png');
    await mes.delete();
    await mes.channel.send('', attachment);
};
