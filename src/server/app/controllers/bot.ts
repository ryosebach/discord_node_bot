/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Message} from 'discord.js';

import * as bot from 'server/app/services/bot';

export const route = (mes: Message): void => {
    const mesContent = mes.content.replace(/( |　)+/g, ' ');
    const args = mesContent.split(' ');
    const command = args[0];
    if (mes.author.username === 'Nyanko') {
        return;
    }

    if (command === '!health') {
        bot.sendHealth(mes);
    }

    if (command === '!weather' || command === '⛅') {
        bot.sendWeatherInfo(mes);
    }

    if (command === '!rc' || command === '📡') {
        bot.sendRainCloudGif(mes);
    }

    if (command === '!train' || command === '!tr') {
        if (args[1] && args[1] === 'all') {
            bot.sendKantoTrainInfo(mes);
        } else {
            bot.sendMyTrainInfo(mes, args[1]);
        }
    }

    if (command  === '!fsb') {
      bot.sendFortniteStatus(mes);
    }

    if (command === '!help') {
      bot.sendHelp(mes);
    }
};
