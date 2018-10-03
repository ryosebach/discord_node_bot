/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Channel, Message, TextChannel} from 'discord.js';

import * as bot_controller from 'server/app/controllers/bot';
import discord_bot from 'server/app/middleware/discord_bot';

export const ready = async (): Promise<void> => {
    const client = discord_bot.client;
    discord_bot.paymentChannel = (await client.channels.find((channel: Channel) => (channel as TextChannel).name === 'payment') as TextChannel);
};

export const message = async (mes: Message): Promise<void> => {
    bot_controller.route(mes);
};
