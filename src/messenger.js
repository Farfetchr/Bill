const NameSearchResponse = require("./responses/nameSearchResponse");
const MoveSearchResponse = require("./responses/moveSearchResponse");
const TypeEffectivenessResponse = require("./responses/typeEffectivenessResponse");
const ImageResponse = require("./responses/imageResponse");
const ErrorResponse = require("./responses/errorResponse");

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
        if (firstSpaceIndex === -1) {
          const promise = this.makeErrorPromise(`No method or move name found in {{${match}}}. Please provide a method or move name (Level/TM/Egg/Tutor/Flamethrower)`);
          this.promises.push(promise);
        } else {
          let methodOrName = "";

          if (piped.length > 1) {
            pokemonName = piped[0].substring(1, firstSpaceIndex);
            methodOrName = piped[0].substring(firstSpaceIndex + 1).trim();
            versionText = piped[1].trim();
          } else {
            pokemonName = match.substring(1, firstSpaceIndex);
            methodOrName = match.substring(firstSpaceIndex + 1);
          }
          const promise = this.makeMoveSearchPromise(pokemonName, methodOrName, versionText);
          this.promises.push(promise);
        }
      } else {
        if (piped.length > 1) {
          pokemonName = piped[0].trim();
          versionText = piped[1].trim();
        } else {
          pokemonName = match;
        }
        let promise;
        if (match.startsWith('#')) {
          promise = this.makeTypeEffectivenessPromise(pokemonName.substring(1), versionText);
        } else if (match.startsWith('^')) {
          promise = this.makeImagePromise(pokemonName.substring(1), versionText);
        } else {
          promise = this.makeNameSearchPromise(pokemonName, versionText);
        }
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

  makeTypeEffectivenessPromise(pokemonName, versionText) {
    return new Promise((resolve, reject) => {
      try {
        new TypeEffectivenessResponse(this.client, pokemonName, versionText)
          .embed()
          .then((embed) => {
            resolve(embed);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  makeImagePromise(pokemonName, versionText) {
    return new Promise((resolve, reject) => {
      try {
        new ImageResponse(this.client, pokemonName, versionText)
          .embed()
          .then((embed) => {
            resolve(embed);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  makeErrorPromise(errorText) {
    return new Promise((resolve, reject) => {
      try {
        new ErrorResponse(errorText)
          .embed()
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
