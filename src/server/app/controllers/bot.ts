/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Message, TextChannel} from 'discord.js';
import * as log4js from 'log4js';

const logger = log4js.getLogger('console');

import * as bot from 'server/app/services/bot';

export const route = (mes: Message): void => {
    const mesContent = mes.content.replace(/( |　)+/g, ' ');
    const command = mesContent.split(' ')[0];
    // const channel = mes.channel as TextChannel;
    if (mes.author.username === 'Nyanko') {
        return;
    }

    if (command === '!weather' || command === '⛅') {
        bot.sendWeatherInfo(mes);
    }

    if (command === '!rc' || command === '📡') {
        bot.sendRainCloudGif(mes);
    }

    if (command === '!train') {
        bot.sendKantoTrainInfo(mes);
    }
};
