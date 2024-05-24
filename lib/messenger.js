const Response = require('./response');

class Messenger {
  constructor(client, msg) {
    this.promises = [];
    this.client = client;
    this.msg = msg;
    this.pattern = /\(\((.*?)\)\)/;

    const matches = msg.content.match(this.pattern);
    if (matches) {
      matches.array.forEach(match => {
        const pokemonName = match;
        const promise = this.makePromise(pokemonName);
        this.promises.push(promise);
      });
    }
    Promise.all(this.promises).then(embeds => {
      embeds.forEach(embed => {
        this.msg.channel.sendEmbed(embed);
      });
    }).catch(err => console.log(err));
  }

  makePromise(pokemonName) {
    return new Promise((resolve, reject) => {
      try {
        new response(this.client, pokemonName).embed().then(embed => {
          resolve(embed);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = Messenger;
