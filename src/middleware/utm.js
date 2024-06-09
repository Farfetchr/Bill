const Url = require('urijs');

module.exports = (client, embed) => {
  if (embed.url) {
    embed.url = Url(embed.url).query({ utm_source: 'discord' }).toString();
  }
  return embed;
}
