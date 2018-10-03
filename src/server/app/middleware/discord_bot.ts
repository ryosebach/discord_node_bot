/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Client as DiscordClient, Message, TextChannel} from 'discord.js';

export default class DiscordBot {
    static client: DiscordClient;
    static paymentChannel: TextChannel;

    static init(token: string, readyFunc: () => Promise<void>, messageFunc: (mes: Message) => Promise<void>): void {
        this.client = new DiscordClient();
        this.client.login(token);
        this.client.on('ready', async () => { readyFunc(); });
        this.client.on('message', async (mes: Message) => { messageFunc(mes); });
    }
}
