const Response = require("./response");

class Messenger {
  constructor(client, msg) {
    this.promises = [];
    this.client = client;
    this.msg = msg;
    this.pattern = /{{(.+?)}}/g;

    const matches = msg.content.match(this.pattern);
    if (matches) {
      const match = matches[0].replaceAll("{", "").replaceAll("}", "");
      const piped = match.split("|");

      let pokemonName = "";
      let versionText = "";

      if (piped.length > 1) {
        pokemonName = piped[0].trim();
        versionText = piped[1].trim();
      } else {
        pokemonName = match;
      }
      const promise = this.makePromise(pokemonName, versionText);
      this.promises.push(promise);
    }
    Promise.all(this.promises)
      .then((embeds) => {
        embeds.forEach((embed) => {
          this.msg.channel.send({ embeds: [embed] });
        });
      })
      .catch((err) => console.log(err));
  }

  makePromise(pokemonName, versionText) {
    return new Promise((resolve, reject) => {
      try {
        new Response(this.client, pokemonName, versionText)
          .standardEmbed()
          .then((embed) => {
            resolve(embed);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = Messenger;
