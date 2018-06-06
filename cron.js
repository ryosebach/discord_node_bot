const CronJob = require('cron').CronJob;
const Discord = require('discord.js'); 
const bot = require('./bot.js');
const fs = require('fs');
const moment = require('moment');

const daily_pay_sent_job = new CronJob('50 59 23 * * *', () => {
		const sql = "SELECT price FROM payment WHERE date(date, 'localtime') >= date('now', 'localtime')";
		const durationToBeTotaled = "今日"
		bot.send_total_pay_to_channel(bot.payment_channel, sql, durationToBeTotaled, "使った");
		bot.clear_pay_info(bot.payment_channel);
	},
	null,
	false,
	"Asia/Tokyo"
);

const weekly_pay_sent_job = new CronJob('55 59 23 * * 0', () => {
		const sql = "SELECT price FROM payment WHERE strftime('%W', datetime(date, 'localtime')) = strftime('%W', datetime('now', 'localtime'))";
		const durationToBeTotaled = "今週";
		bot.send_total_pay_to_channel(bot.payment_channel, sql, durationToBeTotaled, "使った");
	},
	true,
	"Asia/Tokyo"
);

const monthly_pay_sent_job = new CronJob('00 00 00 1 * *', () => {
		const sql = "SELECT price FROM payment WHERE strftime('%m', datetime(date, 'localtime')) = strftime('%m', datetime('now', '-1 day', 'localtime'))";
		const durationToBeTotaled = "今月";
		bot.send_total_pay_to_channel(bot.payment_channel, sql, durationToBeTotaled, "使った");
	},
	true,
	"Asia/Tokyo"
);

const backup_database = new CronJob('45 59 23 * * *', () => {
		fs.copyFile("./db/payment.db", "db/backup/" + moment().format("YYMMDD-HHmmss") + "payment.db", () => {console.log("Backup Err")});
	},
	null,
	false,
	"Asia/Tokyo"
)

module.exports.daily_pay_sent_job = daily_pay_sent_job;
module.exports.weekly_pay_sent_job = weekly_pay_sent_job;
module.exports.monthly_pay_sent_job = monthly_pay_sent_job;
module.exports.backup_database = backup_database;
