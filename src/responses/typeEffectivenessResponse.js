const BaseResponse = require("./baseResponse");
const { getVersionId } = require("../utils/versionUtils");
const { getTypeEffectiveness, getTypeColor} = require("../utils/typeUtils");

const { EmbedBuilder } = require("@discordjs/builders");

class TypeEffectivenessResponse extends BaseResponse {
  constructor(client, pokemonName, versionText) {
    super(client, pokemonName, versionText);
  }

  makeUrl() {
    if (this.versionText) {
      this.versionId = getVersionId(this.versionText);
      return `${this.url}${this.pokemonName}/${this.versionId}`;
    } else {
      return this.url + this.pokemonName;
    }
  }

  getEffectivenessFields(type1, type2) {
    let neutralString = "\u200B";
    let weaknessString = "\u200B";
    let resistanceString = "\u200B";
    let immunityString = "\u200B";

    getTypeEffectiveness(type1, type2).forEach((value, key) => {
      switch(value) {
        case 0.25:
          resistanceString += `${key} ¼x\n`;
          break;
        case 0.5:
          resistanceString += `${key} ½x\n`;
          break;
        case 0:
          immunityString += `${key} 0x\n`;
          break;
        case 1.0:
          neutralString += `${key} 1x\n`;
          break;
        case 2.0:
          weaknessString += `${key} 2x\n`;
          break;
        case 4.0:
          weaknessString += `${key} 4x\n`;
          break;
      }
    });

    return [neutralString, weaknessString, resistanceString, immunityString];
  }

  createTypeEmbed(response) {
    const pokemon = JSON.parse(response.body);
    if (pokemon.id) {
      const type = pokemon.type2
        ? `${pokemon.type1}/${pokemon.type2}`
        : `${pokemon.type1}`;
      const color = getTypeColor(pokemon.type1.toLowerCase());
      const versionText = this.versionText
        ? `(${this.versionText.toUpperCase()})`
        : "";
      const versionParam = this.versionText ? `&versionId=${this.versionId}` : '';

      const typeEffectivenessFields = this.getEffectivenessFields(pokemon.type1, pokemon.type2);

      const embed = new EmbedBuilder()
        .setTitle(`${pokemon.name} #${pokemon.pokedexNumber} ${versionText}`)
        .setURL(`${this.returnUrl}${pokemon.id}${versionParam}`)
        .addFields(
          {
            name: "Neutral",
            value: typeEffectivenessFields[0],
            inline: true,
          },
          {
            name: "Weaknesses",
            value: typeEffectivenessFields[1],
            inline: true,
          },
          { name: "\u200B", value: "\u200B" },
          {
            name: "Resistances",
            value: typeEffectivenessFields[2],
            inline: true,
          },
          {
            name: "Immunities",
            value: typeEffectivenessFields[3],
            inline: true,
          }
        )
        .setColor(color)
        .setThumbnail(
          "https://farfetchr-pokemon-images.s3.us-west-1.amazonaws.com/" +
            pokemon.id +
            ".png"
        )
        .setDescription(`${type}`);
      return embed;
    } else {
      const embed = new EmbedBuilder()
        .setURL("https://farfetchr.io")
        .setAuthor({
          name: "Farfetchr",
          iconURL: this.iconURL,
          url: "https://farfetchr.io",
        })
        .setDescription(`No results found for ${this.pokemonName}`);
      return embed;
    }
  }

  embed() {
    return new Promise((resolve, reject) => {
      this.makeRequest().then((response) => {
        let embed = this.createTypeEmbed(response);
        this.middleware.length > 0 &&
          this.middleware.forEach((mw) => {
            embed = mw(this.client, embed);
          });
        resolve(embed);
      });
    });
  }
}

module.exports = TypeEffectivenessResponse;
