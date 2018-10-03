/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import {Attachment, Message, TextChannel} from 'discord.js';
import * as log4js from 'log4js';

// import bot from 'server/app/middleware/discord_bot';
import Util from 'server/app/utils/util';

const logger = log4js.getLogger('console');

export const insert_pay_info = async (mes: Message): Promise<void> => {
    const payInfo = mes.content.replace(/( |　)+/g, ' ');
    const payInfos = payInfo.split(' ');

    if (payInfos.length < 3) {
        return;
    }

    const payItemName = payInfos[1];
    const payItemPrice = parseInt(payInfos[2], 10);
    const paymentDayInfo = payInfos[3];

    if (Number.isNaN(payItemPrice)) {

        return;
    }
    logger.info(`${payItemName} price is ${payItemPrice} and info is ${paymentDayInfo}`);
};

export const total_pay = async (mes: Message): Promise<void> => {
    const mesContent = mes.content.replace(/( |　)+/g, ' ');
    const arg = mesContent.split(' ')[1];

    let sql = '';
    let durationToBeTotaled = '';
    const totalPrice = 0;
    if (arg === 'day' || arg === 'today')  {
        sql = 'SELECT price FROM payment WHERE date(date, \'localtime\') >= date(\'now\', \'localtime\')';
        durationToBeTotaled = '今日';
    } else if (arg === 'week') {
        sql = 'SELECT price FROM payment WHERE strftime(\'%W\', datetime(date, \'localtime\')) = strftime(\'%W\', datetime(\'now\', \'localtime\'))';
        durationToBeTotaled = '今週';
    } else if (arg === 'month') {
        sql = 'SELECT price FROM payment WHERE strftime(\'%m\', datetime(date, \'localtime\')) = strftime(\'%m\', datetime(\'now\', \'localtime\'))';
        durationToBeTotaled = '今月';
    } else if (arg === 'clear') {
        clear_bot_message(mes.channel as TextChannel);
        mes.delete();
        return;
    } else {
        return;
    }
    clear_bot_message(mes.channel as TextChannel);
    // send_total_pay_to_channel(sql, durationToBeTotaled, '使ってる');
    mes.delete();
};

const clear_bot_message = async (channel: TextChannel): Promise<void> => {
    const messages = await channel.fetchMessages({ limit: 10});
    for (const val of messages.array()) {
      if (val.author.username !== 'Nyanko') { continue; }
      val.delete();
    }
};

// const send_total_pay_to_channel = async (sql: string, durationToBeTotaled: string, word: string): Promise<void> => {
//     // const db = await dbPromise;
//     // let totalPrice = 0;
//     // const rows = await db.all(sql);
//     // for (const val of rows) {
//     //   totalPrice += val.price;
//     // }
//     // bot.paymentChannel.send(`${durationToBeTotaled}は${totalPrice}円${word}にゃん`);
// };

export const weather = async (mes: Message): Promise<void> => {
    await clear_bot_message(mes.channel as TextChannel);
    const buffer = await Util.screenshotDOMElement('https://weather.yahoo.co.jp/weather/jp/13/4410.html', 'div .forecastCity', 2);
    const attachment = new Attachment(buffer, 'weather.png');
    await mes.channel.send('', attachment);
    mes.delete();
};
