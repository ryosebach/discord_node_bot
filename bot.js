const Discord = require('discord.js');
const sqlite = require('sqlite');
const dbPromise = sqlite.open('./db/payment.db', { Promise });
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;


const client = new Discord.Client();

client.on('ready', () => {

});


client.on('message', mes => {
	if (mes.channel.name == 'payment' && mes.author.username != 'Nyanko') {
		console.log(mes.content);
		
		insert_pay_info(mes);
		today_pay(mes);
		week_pay(mes);
	}
});

async function insert_pay_info(mes) {
	let payInfo = mes.content.replace(/( |　)+/g, " ");
	if (payInfo.split(" ").length != 2)
		return;
	let payItemName = payInfo.split(" ")[0];
	let payItemPrice = parseInt(payInfo.split(" ")[1], 10);
	if (Number.isNaN(payItemPrice))
		return;
	db.run("INSERT INTO payment (name, price) VALUES (?, ?)", payItemName, payItemPrice);
}

async function today_pay(mes) {
	if(mes.content == "!pay today") {
		const db = await dbPromise;
		let today_use_price = 0;
		await db.each("SELECT price FROM payment WHERE date > date('now')", function(err, row) {
			today_use_price += row.price;
		});
		mes.channel.send(`今日は${today_use_price}円使ってるにゃん`);
	}
}

async function week_pay(mes) {
	if (mes.content == "!pay week") {
		const db = await dbPromise;
		let week_use_price = 0;
		await db.each("SELECT price FROM payment WHERE strftime('%W', date) = strftime('%W', 'now')", function(err, row) {
			week_use_price += row.price;
		});
		mes.channel.send(`今週は${week_use_price}円使ってるにゃん`);
	}
}

async function month_pay(mes) {
	if (mes.content == "!pay month") {
		const db = await dbPromise;
	let month_use_price = 0;
	}
}

client.login(token);
