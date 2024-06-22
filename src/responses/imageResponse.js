const BaseResponse = require("./baseResponse");
const { EmbedBuilder } = require("@discordjs/builders");

class ImageResponse extends BaseResponse {

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

  createImageEmbed(response) {
    const versionText = this.versionText
        ? `(${this.versionText.toUpperCase()})`
        : "";
    const versionParam = this.versionText ? `&versionId=${this.versionId}` : '';

    const pokemon = JSON.parse(response.body);
    if (pokemon.id) {
      const embed = new EmbedBuilder()
      .setTitle(`${pokemon.name} #${pokemon.pokedexNumber} ${versionText}`)
      .setURL(`${this.returnUrl}${pokemon.id}${versionParam}`)
      .setImage("https://farfetchr-pokemon-images.s3.us-west-1.amazonaws.com/" +
      pokemon.id +
      ".png");

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
        let embed = this.createImageEmbed(response);
        this.middleware.length > 0 &&
          this.middleware.forEach((mw) => {
            embed = mw(this.client, embed);
          });
        resolve(embed);
      });
    });
  }

}

module.exports = ImageResponse;
