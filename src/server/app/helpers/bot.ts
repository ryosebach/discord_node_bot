/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Channel, Message, TextChannel} from 'discord.js';

import * as bot_controller from 'server/app/controllers/bot';
import DiscordBot from 'server/app/middleware/discordBot';

export const ready = async (): Promise<void> => {
    DiscordBot.paymentChannel = await DiscordBot.findChannel('payment');
    DiscordBot.newsChannel = await DiscordBot.findChannel('news');
};

export const message = async (mes: Message): Promise<void> => {
    bot_controller.route(mes);
};
