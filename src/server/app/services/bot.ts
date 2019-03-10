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
import FortniteStatus from 'server/app/utils/fortniteStatus';
import * as lang from 'server/app/utils/lang';
import * as yahooService from 'server/app/utils/yahooServices';

export const sendHealth = async (mes: Message): Promise<void> => {
    mes.delete();
    mes.channel.send('Runnning');
    await new Promise((r: () => void) => setTimeout(r, 3000));
    clearBotMessage(mes.channel as TextChannel, null, 'Runnning');
};

const clearBotMessage = async (channel: TextChannel, name?: string, content?: string): Promise<void> => {
    const messages = await channel.fetchMessages({ limit: 10});
    for (const message of messages.array()) {
        if (message.author.username !== 'Nyanko' ||
            (name && !message.attachments.first().filename.match(new RegExp(`${name}`))) ||
            (content && !message.content.match(new RegExp(content)))) {
            continue;
        }
        message.delete();
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
    const url = yahooService.rainCloudUrl[rainCloudInfos[1] ? rainCloudInfos[1] : 'kanto'];
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

export const sendMyTrainInfo = async (mes: Message, arg?: string): Promise<void> => {
    await clearBotMessage(mes.channel as TextChannel, 'train_info');
    mes.delete();
    for (const info of yahooService.trainInfos) {
        if (arg && !info.route_name.match(new RegExp(arg))) {
            continue;
        }
        const buffer = await Puppeteer.screenshotDOMElemtntWithPaddings(info.url, info.selector, info.paddingTop, info.paddingLeft, info.paddingBottom, info.paddingRight, info.delete_selector);
        const attachment = new Attachment(buffer, `train_info_${info.route_name}_${moment().format('HHmmss')}.png`);
        await mes.channel.send('', attachment);
    }
};

export const sendFortniteStatus = async (mes: Message): Promise<void> => {
  mes.delete();
  clearBotMessage(mes.channel as TextChannel, null, 'メンテ終わり');
  FortniteStatus.checkStatusForChannel(mes.channel as TextChannel);
};

export const sendHelp = async (mes: Message): Promise<void> => {
    mes.delete();
    const helpMes = lang.textByLocale('ja', 'all');
    mes.channel.send(helpMes);
    await new Promise((r: () => void) => setTimeout(r, 10000));
    clearBotMessage(mes.channel as TextChannel, null, ':information_desk_person:');
};
