require('dotenv').config();
let Discord = require("discord.js");
const Bill = require('./src/bot');

if (!process.env.DISCORD_TOKEN) {
  console.log('Error: Specify DISCORD_TOKEN in environment');
  process.exit(1);
}

new Bill(process.env.DISCORD_TOKEN);
