const request = require("request-promise-native");
const typemoji = require("./middleware/typemoji");
const utm = require("./middleware/utm");
const { getVersionId, getTypeColor } = require("./utils");

const { EmbedBuilder } = require("@discordjs/builders");

class Response {
  constructor(client, pokemonName, versionText) {
    this.client = client;
    this.pokemonName = pokemonName;
    this.versionText = versionText;
    this.versionId;
  }

  makeUrl() {
    if (this.versionText) {
      this.versionId = getVersionId(this.versionText);
      return `${this.url}${this.pokemonName}/${this.versionId}`;
    } else {
      return this.url + this.pokemonName;
    }
  }

  makeRequest() {
    return new Promise((resolve, reject) => {
      request({
        method: "GET",
        resolveWithFullResponse: true,
        uri: this.makeUrl(),
      })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          resolve(err.response);
        });
    });
  }

  buildAbilities(pokemon, embed) {
    if (!this.versionId || this.versionId >= 3) {
      embed.addFields(
        { name: "\u200B", value: "\u200B" },
        {
          name: "Abilities",
          value: `${pokemon.ability1.name}\n${
            pokemon.ability2 ? pokemon.ability2.name : "\u200B"
          }`,
          inline: true,
        }
      );
      if (!this.versionId || this.versionId == 11 || this.versionId >= 14) {
        if (pokemon.hiddenAbility) {
          embed.addFields({
            name: "Hidden Ability",
            value: pokemon.hiddenAbility.name,
            inline: true,
          });
        }
      }

      if (pokemon.teraAbility) {
        embed.addFields({
          name: "Terastallized Ability",
          value: pokemon.teraAbility.name,
          inline: true,
        });
      }
    }
  }

  createPokemonEmbed(response) {
    const pokemon = JSON.parse(response.body);
    if (pokemon.id) {
      const type = pokemon.type2
        ? `${pokemon.type1}/${pokemon.type2}`
        : `${pokemon.type1}`;
      const color = getTypeColor(pokemon.type1.toLowerCase());
      const versionText = this.versionText
        ? `(${this.versionText.toUpperCase()})`
        : "";
      const embed = new EmbedBuilder()
        .setTitle(`${pokemon.name} #${pokemon.pokedexNumber} ${versionText}`)
        .setURL(`${this.returnUrl}${pokemon.id}&versionId=${this.versionId}`)
        .addFields(
          {
            name: "Stats",
            value: `HP: ${pokemon.hp}\nAtk: ${pokemon.attack}\nDef: ${pokemon.defense}`,
            inline: true,
          },
          {
            name: "\u200B",
            value: `SpAtk: ${pokemon.specAttack}\nSpDef: ${pokemon.specDefense}\nSpeed: ${pokemon.speed}`,
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

      this.buildAbilities(pokemon, embed);
      return embed;
    } else {
      const embed = new EmbedBuilder()
        .setURL(this.returnUrl + pokemon.id)
        .setAuthor({
          name: "Farfetchr",
          iconURL: this.iconURL,
          url: "https://farfetchr.io",
        })
        .setDescription(`No results found for ${this.pokemonName}`);
      return embed;
    }
  }

  standardEmbed() {
    return new Promise((resolve, reject) => {
      this.makeRequest().then((response) => {
        let embed = this.createPokemonEmbed(response);
        this.middleware.length > 0 &&
          this.middleware.forEach((mw) => {
            embed = mw(this.client, embed);
          });
        resolve(embed);
      });
    });
  }
}

Response.prototype.middleware = [typemoji, utm];
Response.prototype.url = "https://farfetchr.io/api/Bill/";
Response.prototype.returnUrl = "https://farfetchr.io/pokemon?id=";
Response.prototype.iconURL =
  "https://farfetchr-pokemon-images.s3.us-west-1.amazonaws.com/farfetchr.png";

module.exports = Response;
