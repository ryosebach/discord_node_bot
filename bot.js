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
		insert_pay_info(mes);
		send_total_pay(mes);
	}
});

async function insert_pay_info(mes) {
	const payInfo = mes.content.replace(/( |　)+/g, " ");
	if (payInfo.split(" ").length != 2)
		return;
	const db = await dbPromise;
	const payItemName = payInfo.split(" ")[0];
	const payItemPrice = parseInt(payInfo.split(" ")[1], 10);
	if (Number.isNaN(payItemPrice))
		return;
	db.run("INSERT INTO payment (name, price) VALUES (?, ?)", payItemName, payItemPrice);
}

async function send_total_pay(mes) {
	const mesContent = mes.content.replace(/( |　)+/g, " ");
	const command = mesContent.split(" ")[0];

	if(command != "!pay") return;
	
	const db = await dbPromise;
	const arg = mesContent.split(" ")[1];
	
	let sql = "";
	let durationToBeTotaled = "";
	let priceSum = 0;
	if (arg == "day")  {
		sql = "SELECT price FROM payment WHERE date > date('now')";
		durationToBeTotaled = "今日";
	} else if (arg == "week") {
		sql = "SELECT price FROM payment WHERE strftime('%W', date) = strftime('%W', 'now')";
		durationToBeTotaled = "今週";
	} else if (arg == "month") {
		sql = "SELECT price FROM payment WHERE strftime('%m', date) = strftime('%m', 'now')";
		durationToBeTotaled = "今月";
	} else {
		return;
	}
	await db.each(sql, function(err, row) {
		priceSum += row.price;		
	});
	mes.channel.send(`${durationToBeTotaled}は${priceSum}円使ってるにゃん`);
	mes.delete();
}


client.login(token);
