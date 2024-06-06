const request = require('request-promise-native');
const Discord = require('discord.js');
const Url = require('urijs');

const manamoji = require('./middleware/manamoji');
const utm = require('./middleware/utm');

class Response {
  constructor(client, pokemonName) {
    this.client = client;
    this.pokemonName = pokemonName;
  }

  makeQuerystring() {
    return {
      fuzzy: this.pokemonName,
      format: 'text'
    };
  }

  makeUrl() {
    return Url(this.url).query(this.makeQuerystring()).toString();
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

  makeEmbed(response) {
    let parts = response.body.split('\n');
    const embedTitle = parts.shift();
    return {
      title: `${embedTitle}`,
      description: parts.join('\n'),
      url: response.headers['x-farfetchr-pokemon'],
      thumbnail: {
        url: response.headers['x-farfetchr-pokemon-image']
      }
    };
  }

  embed() {
    return new Promise((resolve, reject) => {
      this.makeRequest().then(response => {
        let embed = this.makeEmbed(response);
        this.middleware.length > 0 && this.middleware.forEach(mw => {
          embed = mw(this.client, embed);
        });
        resolve(embed);
      });
    });
  }
}

Response.prototype.middleware = [typemoji, utm];
Response.prototype.url = 'https://api.farfetchr.io/pokemon/';

module.exports = Response;