const BaseResponse = require("./baseResponse");
const { EmbedBuilder } = require("discord.js");

class ErrorResponse extends BaseResponse {

  constructor(errorText) {
    super("","","");
    this.errorText = errorText;
  }

  embed() {
    return new Promise((resolve, reject) => {
      const embed = new EmbedBuilder()
        .setURL("https://farfetchr.io")
        .setAuthor({
          name: "Farfetchr",
          iconURL: this.iconURL,
          url: "https://farfetchr.io",
        })
        .setDescription(this.errorText);
      resolve(embed);
    });
  }
}

module.exports = ErrorResponse;
