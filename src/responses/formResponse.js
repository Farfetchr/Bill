const BaseResponse = require("./baseResponse");
const { EmbedBuilder } = require("@discordjs/builders");

class FormResponse extends BaseResponse {
  constructor (client, pokemonName) {
    super(client, pokemonName, "");
  }

  makeUrl() {
    return `${this.url}forms/${this.pokemonName}`;
  }

  createFormEmbed(response) {
    const pokemon = JSON.parse(response.body);
    if (pokemon.id) {

      let forms = "";
      pokemon.forms.forEach(form => forms += `${form}\n`);

      const embed = new EmbedBuilder()
      .setTitle(`${pokemon.name} Forms`)
      .setURL(`${this.returnUrl}${pokemon.id}`)
      .addFields(
        {
          name: 'Forms',
          value: forms
        }
      )
      .setThumbnail(
        "https://farfetchr-pokemon-images.s3.us-west-1.amazonaws.com/" +
        pokemon.id +
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

  embed() {
    return new Promise((resolve, reject) => {
      this.makeRequest().then((response) => {
        let embed = this.createFormEmbed(response);
        this.middleware.length > 0 &&
          this.middleware.forEach((mw) => {
            embed = mw(this.client, embed);
          });
        resolve(embed);
      });
    });
  }
}

module.exports = FormResponse;