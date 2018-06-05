const Discord = require('discord.js');
const sqlite = require('sqlite');
const dbPromise = sqlite.open('./db/payment.db', { Promise });
require('dotenv').config();
const cron = require('./cron.js');
const moment = require('moment');

const token = process.env.DISCORD_TOKEN;


const client = new Discord.Client();
module.exports.client = client;
let payment_channel;


client.on('ready', async () => {
	payment_channel = await client.channels.find(val => val.name == "payment");
	module.exports.payment_channel = payment_channel;
});


client.on('message', mes => {
	if (mes.channel.name == 'payment' && mes.author.username != 'Nyanko') {
		insert_pay_info(mes);
		total_pay(mes);
	}
});

cron.daily_pay_sent_job.start();
cron.weekly_pay_sent_job.start();
cron.monthly_pay_sent_job.start();


const insert_pay_info = async (mes) => {
	const payInfo = mes.content.replace(/( |　)+/g, " ");
	const payInfos = payInfo.split(" ");

	if (payInfos.length < 2 || payInfos[0] == "!pay") return;
	

	
	const db = await dbPromise;
	const payItemName = payInfos[0];
	const payItemPrice = parseInt(payInfos[1], 10);
	const paymentDayInfo = payInfos[2];

	if (Number.isNaN(payItemPrice)) return;
	
	if(paymentDayInfo) 
		insert_before_pay_info(db, payItemName, payItemPrice, paymentDayInfo);
	else
		await db.run("INSERT INTO payment (name, price) VALUES (?, ?)", payItemName, payItemPrice);
}


const insert_before_pay_info = async (db, payItemName, payItemPrice, paymentDayInfo) => {
	if(paymentDayInfo == "昨日") {
		await db.run("INSERT INTO payment (name, price, date) VALUES(?, ?, ?)", payItemName, payItemPrice, moment().subtract(1, 'days').format("YYYY-MM-DD HH:m:s"));
		return;
	}
	if(paymentDayInfo.match(/^-\d+h$/)) {
		await db.run("INSERT INTO payment (name, price, date) VALUES(?, ?, ?)", payItemName, payItemPrice, moment().subtract(paymentDayInfo.match(/\d+/g)[0], 'hours').format("YYYY-MM-DD HH:m:s"));
		return;
	}
	if(paymentDayInfo.match(/^-\d+d$/)) {
		await db.run("INSERT INTO payment (name, price, date) VALUES(?, ?, ?)", payItemName, payItemPrice, moment().subtract(paymentDayInfo.match(/\d+/g)[0], 'days').format("YYYY-MM-DD HH:m:s"));
		return;
	}
}

const total_pay = async (mes) => {
	const mesContent = mes.content.replace(/( |　)+/g, " ");
	const command = mesContent.split(" ")[0];

	if(command != "!pay") return;
	
	const arg = mesContent.split(" ")[1];
	
	let sql = "";
	let durationToBeTotaled = "";
	let totalPrice = 0;
	if (arg == "day" || arg == "today")  {
		sql = "SELECT price FROM payment WHERE date(date, 'localtime') >= date('now', 'localtime')";
		durationToBeTotaled = "今日";
	} else if (arg == "week") {
		sql = "SELECT price FROM payment WHERE strftime('%W', datetime(date, 'localtime')) = strftime('%W', datetime('now', 'localtime'))";
		durationToBeTotaled = "今週";
	} else if (arg == "month") {
		sql = "SELECT price FROM payment WHERE strftime('%m', datetime(date, 'localtime')) = strftime('%m', datetime('now', 'localtime'))";
		durationToBeTotaled = "今月";
	} else if (arg == "clear") {
		clear_pay_info(mes.channel);
		mes.delete();
		return;
	} else {
		return;
	}
	clear_pay_info(mes.channel);
	send_total_pay_to_channel(payment_channel, sql, durationToBeTotaled, "使ってる");
	mes.delete();
}

const clear_pay_info = async (channel) => {
	const messages = await channel.fetchMessages({ limit: 10});
	for (const val of messages.array()) {
		if (val.author.username != "Nyanko") continue;
		val.delete();
	}
}
module.exports.clear_pay_info = clear_pay_info;

const send_total_pay_to_channel = async (channel, sql, durationToBeTotaled,  word) => {
	const db = await dbPromise;
	let totalPrice = 0;
	const rows = await db.all(sql);
	for (const val of rows) {
		totalPrice += val.price;
	}
	channel.send(`${durationToBeTotaled}は${totalPrice}円${word}にゃん`);
}
module.exports.send_total_pay_to_channel = send_total_pay_to_channel;


client.login(token);
