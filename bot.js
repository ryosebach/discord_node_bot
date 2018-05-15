const Discord = require('discord.js');
const sqlite = require('sqlite');
const dbPromise = sqlite.open('./db/payment.db', { Promise });
const CronJob = require('cron').CronJob;
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;


const client = new Discord.Client();
let payment_channel;

client.on('ready', async () => {
	payment_channel = await client.channels.find(val => val.name == "payment");
});


client.on('message', mes => {
	if (mes.channel.name == 'payment' && mes.author.username != 'Nyanko') {
		insert_pay_info(mes);
		send_total_pay(mes);
	}
});

const daily_pay_sent_job = new CronJob('50 59 23 * * *', () => {
		const sql = "SELECT price FROM payment WHERE date(date, 'localtime') >= date('now', 'localtime')";
		const durationToBeTotaled = "今日"
		send_total_pay_to_channel(payment_channel, sql, durationToBeTotaled);
	},
	true,
	"Asia/Tokyo"
);

const weekly_pay_sent_job = new CronJob('45 59 23 * * 0', () => {
		const sql = "SELECT price FROM payment WHERE strftime('%W', datetime(date, 'localtime')) = strftime('%W', datetime('now', 'localtime'))";
		const durationToBeTotaled = "今週";
		send_total_pay_to_channel(payment_channel, sql, durationToBeTotaled);
	},
	true,
	"Asia/Tokyo"
);

const monthly_pay_sent_job = new CronJob('00 00 00 1 * *', () => {
		sql = "SELECT price FROM payment WHERE strftime('%m', datetime(date, 'localtime')) = strftime('%m', datetime('now', '-1 day', 'localtime'))";
		durationToBeTotaled = "今月";
		send_total_pay_to_channel(payment_channel, sql, durationToBeTotaled);
	},
	true,
	"Asia/Tokyo"
);

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

client.login(token);
