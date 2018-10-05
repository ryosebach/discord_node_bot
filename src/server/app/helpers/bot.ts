/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Channel, Message, TextChannel} from 'discord.js';
import * as log4js from 'log4js';

import * as bot_controller from 'server/app/controllers/bot';
import DiscordBot from 'server/app/middleware/discordBot';

const logger = log4js.getLogger('console');

export const ready = async (): Promise<void> => {
    logger.info('log in discord');
    DiscordBot.paymentChannel = await DiscordBot.findChannel('payment');
    DiscordBot.newsChannel = await DiscordBot.findChannel('news');
};

export const message = async (mes: Message): Promise<void> => {
    bot_controller.route(mes);
};
