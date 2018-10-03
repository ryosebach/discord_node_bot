/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Message, TextChannel} from 'discord.js';
import * as log4js from 'log4js';

const logger = log4js.getLogger('console');

import * as bot from 'server/app/services/bot';
import Util from 'server/app/utils/util';

export const route = (mes: Message): void => {
    logger.info('rout');
    const mesContent = mes.content.replace(/( |　)+/g, ' ');
    const command = mesContent.split(' ')[0];
    const channel = mes.channel as TextChannel;
    if (mes.author.username === 'Nyanko') {
        return;
    }

    if (command === '!buy' && channel.name === 'payment') {
        bot.insert_pay_info(mes);
    }

    if (command === '!pay' && channel.name === 'payment') {
        bot.total_pay(mes);
    }

    if (command === '!weather') {
        bot.weather(mes);
    }
};
