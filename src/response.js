const request = require('request-promise-native');

const typemoji = require('./middleware/typemoji');
const utm = require('./middleware/utm');
const { EmbedBuilder } = require('@discordjs/builders');

class Response {
  constructor(client, pokemonName) {
    this.client = client;
    this.pokemonName = pokemonName;
  }


  makeUrl() {
    return this.url + this.pokemonName;
  }

  makeRequest() {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        resolveWithFullResponse: true,
        uri: this.makeUrl()
      }).then(response => {
        resolve(response);
      }).catch(err => {
        resolve(err.response);
      });
    });
  }

  buildAbilities(pokemon, embed) {
    embed.addFields(
      { name: 'Abilities', value: `${pokemon.ability1.name}\n${pokemon.ability2 ? pokemon.ability2.name : '\u200B'}`, inline: true }
    );

    if (pokemon.hiddenAbility) {
      embed.addFields(
        { name: 'Hidden Ability', value: pokemon.hiddenAbility.name, inline: true }
      );
    }

    if (pokemon.teraAbility) {
      embed.addFields(
        { name: 'Terastallized Ability', value: pokemon.teraAbility.name, inline: true }
      );
    }
  }

  createEmbed(response) {
    const pokemon = JSON.parse(response.body);
    if (pokemon.id) {
      const type = pokemon.type2 ? `${pokemon.type1}/${pokemon.type2}` : `${pokemon.type1}`;
      const embed = new EmbedBuilder()
        .setTitle(`${pokemon.name} #${pokemon.pokedexNumber} ${type}`)
        .setURL(this.returnUrl + pokemon.id)
        .addFields(
          { name: 'Stats', value: `HP: ${pokemon.hp}\nAtk: ${pokemon.attack}\nDef: ${pokemon.hp}`, inline: true},
          { name: '\u200B', value: `SpAtk: ${pokemon.specAttack}\nSpDef: ${pokemon.specDefense}\nSpeed: ${pokemon.speed}`, inline: true },
          { name: '\u200B', value: '\u200B' }
        )
        .setThumbnail('https://farfetchr-pokemon-images.s3.us-west-1.amazonaws.com/' + pokemon.id + '.png')
        .setTimestamp();

      this.buildAbilities(pokemon, embed);
      return embed;
    } else {
      const embed = new EmbedBuilder()
        .setURL(this.returnUrl + pokemon.id)
        .setAuthor({ name: 'Farfetchr', iconURL: this.iconURL, url: 'https://farfetchr.io' })
        .setDescription(`No results found for ${this.pokemonName}`);
      return embed;
    }
  }

  embed() {
    return new Promise((resolve, reject) => {
      this.makeRequest().then(response => {
        let embed = this.createEmbed(response);
        this.middleware.length > 0 && this.middleware.forEach(mw => {
          embed = mw(this.client, embed);
        });
        resolve(embed);
      });
    });
  }
}

Response.prototype.middleware = [typemoji, utm];
Response.prototype.url = 'https://farfetchr.io/api/Pokemon/';
Response.prototype.returnUrl = 'https://farfetchr.io/pokemon?id=';
Response.prototype.iconURL = 'https://farfetchr-pokemon-images.s3.us-west-1.amazonaws.com/farfetchr.png';

module.exports = Response;