const { Client, GatewayIntentBits } = require('discord.js');
let Messenger = require('./messenger');

class Bill {
  constructor(token) {
    this.token = token;
    this.client = this.makeClient(token);
  }

  makeClient(token) {
    console.log('bill client init');
    const client = new Client({ 
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
      ],
    });
    client.on('messageCreate', msg => {
      new Messenger(client, msg);
    });
    client.login(token);
    return client;
  }
}

module.exports = Bill;
