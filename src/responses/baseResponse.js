const request = require("request-promise-native");

const typemoji = require("../middleware/typemoji");
const utm = require("../middleware/utm");

class BaseResponse {
  constructor(client, pokemonName, versionText) {
    this.client = client;
    this.pokemonName = pokemonName;
    this.versionText = versionText;
    this.versionId;
  }

  formatName(pokemonName) {
    let name = "";
    pokemonName.split(' ').forEach((part) => name += part.charAt(0).toUpperCase() + part.toLowerCase().slice(1) + " ");
    return name;
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
}


BaseResponse.prototype.middleware = [typemoji, utm];
// BaseResponse.prototype.url = "http://localhost:5000/api/Bill/";
BaseResponse.prototype.url = "https://farfetchr.io/api/Bill/";
BaseResponse.prototype.returnUrl = "https://farfetchr.io/pokemon?id=";
BaseResponse.prototype.iconURL =
  "https://farfetchr-pokemon-images.s3.us-west-1.amazonaws.com/farfetchr.png";

module.exports = BaseResponse;
