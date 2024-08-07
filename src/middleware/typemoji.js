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
  '½x' : 'effectresistance',
  '¼x' : 'effectdoubleresistance',
  '2x' : 'effectweakness',
  '4x' : 'effectdoubleweakness',
};
module.exports = (client, embed) => {
  function typemoji(str) {
    // Cornercase for exactly Gouging Fire
    if (str.trim() == 'Gouging Fire') {
      return str;
    }

    const words = str.split(' ');
    let retStr = [];
    words.forEach(word => {
      Object.keys(emojiMap)
        .forEach(t => {
          const emoji = client.emojis.cache.find(e => e.name === emojiMap[t]);
          if (t.endsWith('x')) {
            word = word.replaceAll(t, emoji ? `<:${emoji.name}:${emoji.id}>` : t);
          } else {
            if (word.toLowerCase() == t.toLowerCase()){
              word = word.replace(t, emoji ? `${t} <:${emoji.name}:${emoji.id}>` : t);
            }
          }
        }
      );
      retStr.push(word);
    })
    
    return retStr.join(' ');
  }

  function isTypeField(name) {
    return name == "Neutral" || name == "Weaknesses" || name == "Resistances" || name == "Immunities";
  }

  if (embed.data.title) {
    embed.data.title = typemoji(embed.data.title);
  }

  if (embed.data.description) {
    embed.data.description = typemoji(embed.data.description);
  }

  if(embed.data.fields) {
    embed.data.fields.forEach(field => {
      if(isTypeField(field.name)) {
        field.value = typemoji(field.value)

      }
    });
  }
  return embed;
}