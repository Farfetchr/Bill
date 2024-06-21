const BaseResponse = require("./baseResponse");
const { getVersionId, getTypeColor } = require("../utils");

const { EmbedBuilder } = require("@discordjs/builders");

class MoveSearchResponse extends BaseResponse {
  constructor(client, pokemonName, methodOrName, versionText) {
    super(client, pokemonName, versionText);
    this.methodOrName = methodOrName;
  }

  makeUrl() {
    if (this.versionText) {
      this.versionId = getVersionId(this.versionText);
      return `${this.url}moves/${this.pokemonName}/${this.versionId}/${this.methodOrName}`;
    } else {
      return `${this.url}moves/${this.pokemonName}/${this.methodOrName}`;
    }
  }

  getMethodText(method) {
    switch (method) {
      case 'lvl':
        return 'Level Up';
      case 'egg':
        return 'Egg';
      case 'tm':
        return 'TM/HM';
      case 'tutor':
        return 'Tutor';
      default:
        return null;
    }
  }

  getMethod(pokemonMove) {

  }

  buildMoveList(moves) {

  }

  createMoveListEmbed(response) {
    const pokemonMoves = JSON.parse(response.body);
    if (pokemonMoves.length > 0) {
      const versionText = this.versionText
        ? `(${this.versionText.toUpperCase()})`
        : "";

      let moves = "";
      pokemonMoves.forEach(mv => {
        moves += mv.name + '\n';
      });
      const methodText = this.getMethodText(this.methodOrName.toLowerCase());
      const embed = new EmbedBuilder()
        .setTitle(`${this.pokemonName} ${versionText}`)
        .setURL(`${this.returnUrl}${pokemonMoves[0].pokemonId}&versionId=${this.versionId}`)
        .addFields(
          {
            name: `${methodText} Moves`,
            value: moves,
          },
        )
        .setThumbnail(
          "https://farfetchr-pokemon-images.s3.us-west-1.amazonaws.com/" +
          pokemonMoves[0].pokemonId +
          ".png"
        );
      return embed;
    } else {
      const endText = this.versionText ? `in ${this.versionText}` : '';
      const embed = new EmbedBuilder()
        .setURL("https://farfetchr.io")
        .setAuthor({
          name: "Farfetchr",
          iconURL: this.iconURL,
          url: "https://farfetchr.io",
        })
        .setDescription(`No ${this.getMethodText(this.methodOrName)} moves found for ${this.pokemonName} ${endText}`);
      return embed;
    }
  }

  createMoveSearchEmbed(response) {
    const pokemonMoves = JSON.parse(response.body);
    if (pokemonMoves.length > 0) {
      const versionText = this.versionText
        ? `(${this.versionText.toUpperCase()})`
        : "";
      let unlearnable = '❌'
      let learnable = '✅';
      let lvl = unlearnable;
      let egg = unlearnable;
      let tm = unlearnable;
      let tutor = unlearnable;

      pokemonMoves.forEach(mv => {
        if (mv.levelUpLearnable) {
          lvl = mv.levelLearned.toString();
        }

        if (mv.eggMoveLearnable) {
          egg = learnable;
        }

        if (mv.tmLearnable) {
          tm = learnable;
        }

        if (mv.tutorLearnable) {
          tutor = learnable;
        }

      })

      const embed = new EmbedBuilder()
        .setTitle(`${this.pokemonName} ${versionText}`)
        .setURL(`${this.returnUrl}${pokemonMoves[0].pokemonId}&versionId=${this.versionId}`)
        .setDescription(`${this.methodOrName}`)
        .addFields(
          {
            name: 'Level',
            value: lvl,
            inline: true
          },
          {
            name: 'Egg',
            value: egg,
            inline: true
          },
          { name: "\u200B", value: "\u200B" },
          {
            name: 'TM/HM',
            value: tm,
            inline: true
          },
          {
            name: 'Tutor',
            value: tutor,
            inline: true
          }
        )
        .setThumbnail(
          "https://farfetchr-pokemon-images.s3.us-west-1.amazonaws.com/" +
          pokemonMoves[0].pokemonId +
          ".png"
        );
        return embed;
    } else {
      const endText = this.versionText ? `in ${this.versionText}` : '';
      const embed = new EmbedBuilder()
        .setURL("https://farfetchr.io")
        .setAuthor({
          name: "Farfetchr",
          iconURL: this.iconURL,
          url: "https://farfetchr.io",
        })
        .setDescription(`${this.methodOrName} not found for ${this.pokemonName} ${endText}`);
      return embed;
    }
  }

  moveEmbed() {
    return new Promise((resolve, reject) => {
      this.makeRequest().then((response) => {
        let embed;
        if (this.getMethodText(this.methodOrName.toLowerCase())) {
          embed = this.createMoveListEmbed(response);
        } else {
          embed = this.createMoveSearchEmbed(response);
        }

        this.middleware.length > 0 &&
          this.middleware.forEach((mw) => {
            embed = mw(this.client, embed);
          });
        resolve(embed);
      });
    });
  }
}

module.exports = MoveSearchResponse;
