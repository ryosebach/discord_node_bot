const Discord = require('discord.js');
const sqlite = require('sqlite');
const dbPromise = sqlite.open('./db/payment.db', { Promise });
require('dotenv').config();
const cron = require('./cron.js');

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
		send_total_pay(mes);
	}
});

cron.daily_pay_sent_job.start();
cron.weekly_pay_sent_job.start();
cron.monthly_pay_sent_job.start();


const insert_pay_info = async (mes) => {
	const payInfo = mes.content.replace(/( |　)+/g, " ");
	
	if (payInfo.split(" ").length != 2) return;
	
	const db = await dbPromise;
	const payItemName = payInfo.split(" ")[0];
	const payItemPrice = parseInt(payInfo.split(" ")[1], 10);

	if (Number.isNaN(payItemPrice)) return;

	await db.run("INSERT INTO payment (name, price) VALUES (?, ?)", payItemName, payItemPrice);
}

const send_total_pay = async (mes) => {
	const mesContent = mes.content.replace(/( |　)+/g, " ");
	const command = mesContent.split(" ")[0];

	if(command != "!pay") return;
	
	const db = await dbPromise;
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
	} else {
		return;
	}
	const rows = await db.all(sql);
	for (const val of rows) {
		totalPrice += val.price;
	}
	const messages = await mes.channel.fetchMessages({ limit: 10 });
	for (const val of messages.array()) {
		if (val.author.username != "Nyanko") continue;
		val.delete();
	}
	mes.channel.send(`${durationToBeTotaled}は${totalPrice}円使ってるにゃん`);
	mes.delete();
}

const send_total_pay_to_channel = async (channel, sql, durationToBeTotaled) => {
	const db = await dbPromise;
	let totalPrice = 0;
	const rows = await db.all(sql);
	for (const val of rows) {
		totalPrice += val.price;
	}
	channel.send(`${durationToBeTotaled}は${totalPrice}円使ったにゃん`);
}
module.exports.send_total_pay_to_channel = send_total_pay_to_channel;


client.login(token);
