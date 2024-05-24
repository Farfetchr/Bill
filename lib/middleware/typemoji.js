
module.exports = (client, embed) => {
  function typemoji(str) {
    const re = new RegExp('\{(.*?)\}');
    return str.replace(re, matched => {
      const emoji = client.emojis.find('name');
      return emoji ? emoji.toString() : matched;
    })
  }
  
  if (embed.title) {
    embed.title = manamoji(embed.title);
  }
  if (embed.description) {
    embed.description = manamoji(embed.description);
  }
  return embed;
}