const NameSearchResponse = require("./responses/nameSearchResponse");
const MoveSearchResponse = require("./responses/moveSearchResponse");

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

      if (match.startsWith('!')) {
        const firstSpaceIndex = match.indexOf(' ');
        pokemonName = match.substring(1, firstSpaceIndex);

        let methodOrName = "";

        if (piped.length > 1) {
          methodOrName = piped[0].substring(firstSpaceIndex + 1).trim();
          versionText = piped[1].trim();
        } else {
          methodOrName = match.substring(firstSpaceIndex + 1);
        }
        const promise = this.makeMoveSearchPromise(pokemonName, methodOrName, versionText);
        this.promises.push(promise);
      } else {
        if (piped.length > 1) {
          pokemonName = piped[0].trim();
          versionText = piped[1].trim();
        } else {
          pokemonName = match;
        }

        const promise = this.makeNameSearchPromise(pokemonName, versionText);
        this.promises.push(promise);
      }
    }
    Promise.all(this.promises)
      .then((embeds) => {
        embeds.forEach((embed) => {
          this.msg.channel.send({ embeds: [embed] });
        });
      })
      .catch((err) => console.log(err));
  }

  makeNameSearchPromise(pokemonName, versionText) {
    return new Promise((resolve, reject) => {
      try {
        new NameSearchResponse(this.client, pokemonName, versionText)
          .standardEmbed()
          .then((embed) => {
            resolve(embed);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  makeMoveSearchPromise(pokemonName, methodOrName, versionText) {
    return new Promise((resolve, reject) => {
      try {
        new MoveSearchResponse(this.client, pokemonName, methodOrName, versionText)
          .moveEmbed()
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
