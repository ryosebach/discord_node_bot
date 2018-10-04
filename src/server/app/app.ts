/**
 * Discord Bot
 *
 * (C) 2018 ryosebach
 */
import Config from 'server/app/config/config';
import * as bot_helper from 'server/app/helpers/bot';
import DiscordBot from 'server/app/middleware/discordBot';
import Puppeteer from 'server/app/middleware/puppeteer';

Config.init();
DiscordBot.init(Config.DISCORD_TOKEN, bot_helper.ready, bot_helper.message);
Puppeteer.init();
