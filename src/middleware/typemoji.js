const emojiMap = {
  'Bug' : 'typebug',
  'Dark' : 'typedark',
  'Dragon' : 'typedragon',
  'Electric' : 'typeelectric',
  'Fairy' : 'typefairy',
  'Fighting' : 'typefighting',
  'Fire' : 'typefire',
  'Flying' : 'typeflying',
  'Ghost' : 'typeghost',
  'Grass' : 'typegrass',
  'Ground' : 'typeground',
  'Ice' : 'typeice',
  'Normal' : 'typenormal',
  'Poison' : 'typepoison',
  'Psychic' : 'typepsychic',
  'Rock' : 'typerock',
  'Steel' : 'typesteel',
  'Water' : 'typewater',
};
module.exports = (client, embed) => {
  function typemoji(str) {
    Object.keys(emojiMap)
      .forEach(t => {
        const emoji = client.emojis.cache.find(e => e.name === emojiMap[t]);
        str = str.replace(t, emoji ? `<:${emoji.name}:${emoji.id}>` : t);
      }
    );
    return str;
  }

  if (embed.data.title) {
    embed.data.title = typemoji(embed.data.title);
  }
  if (embed.data.description) {
    embed.data.description = typemoji(embed.data.description);
  }
  return embed;
}