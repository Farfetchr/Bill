const NameSearchResponse = require("./responses/nameSearchResponse");
const MoveSearchResponse = require("./responses/moveSearchResponse");
const TypeEffectivenessResponse = require("./responses/typeEffectivenessResponse");
const ImageResponse = require("./responses/imageResponse");
const FormResponse = require("./responses/formResponse");
const ErrorResponse = require("./responses/errorResponse");

class Messenger {
  constructor(client, msg) {
    this.promises = [];
    this.client = client;
    this.msg = msg;
    this.pattern = /{{(.+?)}}/g;

    const matches = msg.content.match(this.pattern);
    if (matches) {
      matches.forEach(match => {
        match = match.replaceAll("{", "").replaceAll("}", "");
        const piped = match.split("|");

        let pokemonName = "";
        let versionText = "";

        if (match.startsWith('!')) {
          const firstSpaceIndex = match.indexOf(' ');
          let methodOrName = "";

          if (piped.length > 1) {
            pokemonName = piped[0].substring(1).trimEnd();
            methodOrName = piped[1].trimStart().trimEnd();
            versionText = piped.length > 2 ? piped[2].trim() : "";
            const promise = this.makeMoveSearchPromise(pokemonName, methodOrName, versionText);
            this.promises.push(promise);
          } else {
            const promise = this.makeErrorPromise(`No method or move name found in {{${match}}}. Please provide a method or move name (Level/TM/Egg/Tutor/Flamethrower)`);
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
          } else if (match.startsWith('*')) {
            promise = this.makeFormsPromise(pokemonName.substring(1));
          } else {
            promise = this.makeNameSearchPromise(pokemonName, versionText);
          }
          this.promises.push(promise);
        }
      });

      Promise.all(this.promises)
        .then((embeds) => {
          embeds.forEach((embed) => {
            this.msg.channel.send({ embeds: [embed] });
          });
        })
        .catch((err) => console.log(err));
    }
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

  makeFormsPromise(pokemonName, versionText) {
    return new Promise((resolve, reject) => {
      try {
        new FormResponse(this.client, pokemonName)
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
