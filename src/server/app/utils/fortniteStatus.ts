/**
 * discord node bot
 *
 * 2019 (c) ryosebach
 */
import * as cheerio_client from 'cheerio-httpcli';
import * as cron from 'cron';
import { TextChannel } from 'discord.js';

export default class FortniteStatus {

  static replyChannels: TextChannel[] = [];

  static checkServiceStatus: cron.CronJob = new cron.CronJob(
    '*/3 * * * * *',
    async () => {
      const $ = (await cheerio_client.fetch('https://status.epicgames.com')).$;
      const underMainte = await $('span.component-status').filter(function(this: void) {
        return !$(this).text().match(/Operational|Degraded Performance/);
      });
      if (underMainte.length !== 0) { return; }

      FortniteStatus.replyChannels.forEach((channel: TextChannel) => {
        channel.send('メンテ終わり！Fortnite遊べるよ！');
      });
      FortniteStatus.replyChannels.splice(0, FortniteStatus.replyChannels.length);

      FortniteStatus.checkServiceStatus.stop();
    },
    undefined,
    false,
    'Asia/Tokyo'
  );

  static checkStatusForChannel = (channel: TextChannel) => {
    FortniteStatus.replyChannels.push(channel);
    if (!FortniteStatus.checkServiceStatus.running) {
      FortniteStatus.checkServiceStatus.start();
    }
  }
}
