/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Channel, Client as DiscordClient, Message, TextChannel} from 'discord.js';

export default class DiscordBot {
    static client: DiscordClient;
    static paymentChannel: TextChannel;
    static newsChannel: TextChannel;

    static init(token: string, readyFunc: () => Promise<void>, messageFunc: (mes: Message) => Promise<void>): void {
        this.client = new DiscordClient();
        this.client.login(token);
        this.client.on('ready', async () => { readyFunc(); });
        this.client.on('message', async (mes: Message) => { messageFunc(mes); });
    }

    static findChannel = async (channelName: string): Promise<TextChannel> => {
        return DiscordBot.client.channels.find((channel: TextChannel) => channel.name === channelName) as TextChannel;
    }
}
