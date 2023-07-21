require("dotenv").config();

const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command("start", (ctx) => {
  ctx.reply("Hello! Welcome to your Telegram bot, how are you.");
});

bot.launch();
