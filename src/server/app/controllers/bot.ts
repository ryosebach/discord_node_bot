/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Message} from 'discord.js';

import * as bot from 'server/app/services/bot';

export const route = (mes: Message): void => {
    const mesContent = mes.content.replace(/( |　)+/g, ' ');
    const command = mesContent.split(' ')[0];
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
