const Response = require('./response');

class Messenger {
  constructor(client, msg) {
    this.promises = [];
    this.client = client;
    this.msg = msg;
    this.pattern = /{{(.+?)}}/g;

    const matches = msg.content.match(this.pattern);
    if (matches) {
      const match = matches[0].replaceAll('{', '').replaceAll('}', '');
        const pokemonName = match;
        const promise = this.makePromise(pokemonName);
        this.promises.push(promise);
    }
    Promise.all(this.promises).then(embeds => {
      embeds.forEach(embed => {
        this.msg.channel.send({ embeds: [embed] });
      });
    }).catch(err => console.log(err));
  }

  makePromise(pokemonName) {
    return new Promise((resolve, reject) => {
      try {
        new Response(this.client, pokemonName).embed().then(embed => {
          resolve(embed);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = Messenger;
