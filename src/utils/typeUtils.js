/**
 * Enum of types
 * @readonly
 * @enum
 */
const Types = Object.freeze({
  NORMAL: "Normal",
  FIRE: "Fire",
  WATER: "Water",
  ELECTRIC: "Electric",
  GRASS: "Grass",
  ICE: "Ice",
  FIGHTING: "Fighting",
  POISON: "Poison",
  GROUND: "Ground",
  FLYING: "Flying",
  PSYCHIC: "Psychic",
  BUG: "Bug",
  ROCK: "Rock",
  GHOST: "Ghost",
  DRAGON: "Dragon",
  DARK: "Dark",
  STEEL: "Steel",
  FAIRY: "Fairy"
});

const TypeWeaknesses = new Map();
TypeWeaknesses.set(Types.NORMAL, [Types.FIGHTING]);
TypeWeaknesses.set(Types.FIRE, [Types.WATER, Types.GROUND, Types.ROCK]);
TypeWeaknesses.set(Types.WATER, [Types.ELECTRIC, Types.GRASS]);
TypeWeaknesses.set(Types.ELECTRIC, [Types.GROUND]);
TypeWeaknesses.set(Types.GRASS, [Types.FIRE, Types.ICE, Types.POISON, Types.FLYING, Types.BUG]);
TypeWeaknesses.set(Types.ICE, [Types.FIRE, Types.FIGHTING, Types.ROCK, Types.STEEL]);
TypeWeaknesses.set(Types.FIGHTING, [Types.FLYING, Types.PSYCHIC, Types.STEEL]);
TypeWeaknesses.set(Types.POISON, [Types.GROUND, Types.PSYCHIC]);
TypeWeaknesses.set(Types.GROUND, [Types.WATER, Types.GRASS, Types.ICE]);
TypeWeaknesses.set(Types.FLYING, [Types.ELECTRIC, Types.ICE, Types.ROCK]);
TypeWeaknesses.set(Types.PSYCHIC, [Types.BUG, Types.GHOST, Types.DARK]);
TypeWeaknesses.set(Types.BUG, [Types.FIRE, Types.FLYING, Types.ROCK]);
TypeWeaknesses.set(Types.ROCK, [Types.WATER, Types.GRASS, Types.FIGHTING, Types.GROUND, Types.STEEL]);
TypeWeaknesses.set(Types.GHOST, [Types.GHOST, Types.DARK]);
TypeWeaknesses.set(Types.DRAGON, [Types.ICE, Types.DRAGON, Types.FAIRY]);
TypeWeaknesses.set(Types.DARK, [Types.FIGHTING, Types.BUG, Types.FAIRY]);
TypeWeaknesses.set(Types.STEEL, [Types.FIRE, Types.FIGHTING, Types.GROUND]);
TypeWeaknesses.set(Types.FAIRY, [Types.POISON, Types.STEEL]);

const TypeResistances = new Map();
TypeResistances.set(Types.NORMAL, []);
TypeResistances.set(Types.FIRE, [Types.FIRE, Types.GRASS, Types.ICE, Types.STEEL, Types.FAIRY]);
TypeResistances.set(Types.WATER, [Types.FIRE, Types.WATER, Types.ICE, Types.STEEL]);
TypeResistances.set(Types.ELECTRIC, [Types.ELECTRIC, Types.STEEL]);
TypeResistances.set(Types.GRASS, [Types.WATER, Types.ELECTRIC, Types.GRASS, Types.GROUND]);
TypeResistances.set(Types.FIGHTING, [Types.BUG, Types.ROCK, Types.DARK]);
TypeResistances.set(Types.POISON, [Types.GRASS, Types.FIGHTING, Types.POISON, Types.BUG, Types.FAIRY]);
TypeResistances.set(Types.GROUND, [Types.POISON, Types.ROCK]);
TypeResistances.set(Types.FLYING, [Types.GRASS, Types.FIGHTING, Types.BUG]);
TypeResistances.set(Types.PSYCHIC, [Types.FIGHTING, Types.PSYCHIC]);
TypeResistances.set(Types.BUG, [Types.GRASS, Types.FIGHTING, Types.GROUND]);
TypeResistances.set(Types.ROCK, [Types.NORMAL, Types.FIRE, Types.POISON, Types.FLYING]);
TypeResistances.set(Types.GHOST, [Types.POISON, Types.BUG]);
TypeResistances.set(Types.DRAGON, [Types.FIRE, Types.WATER, Types.ELECTRIC, Types.GRASS]);
TypeResistances.set(Types.DARK, [Types.GHOST, Types.DARK]);
TypeResistances.set(Types.STEEL, [Types.NORMAL, Types.GRASS, Types.ICE, Types.FLYING, Types.PSYCHIC, Types.BUG, Types.ROCK, Types.DRAGON, Types.STEEL, Types.FAIRY]);
TypeResistances.set(Types.FAIRY, [Types.FIGHTING, Types.BUG, Types.DARK]);

const TypeImmunities = new Map();
TypeImmunities.set(Types.NORMAL, [Types.GHOST]);
TypeImmunities.set(Types.FIRE, []);
TypeImmunities.set(Types.WATER, []);
TypeImmunities.set(Types.ELECTRIC, []);
TypeImmunities.set(Types.GRASS, []);
TypeImmunities.set(Types.ICE, []);
TypeImmunities.set(Types.FIGHTING, []);
TypeImmunities.set(Types.POISON, []);
TypeImmunities.set(Types.GROUND, [Types.ELECTRIC]);
TypeImmunities.set(Types.FLYING, [Types.GROUND]);
TypeImmunities.set(Types.PSYCHIC, []);
TypeImmunities.set(Types.BUG, []);
TypeImmunities.set(Types.ROCK, []);
TypeImmunities.set(Types.GHOST, [Types.NORMAL, Types.FIGHTING]);
TypeImmunities.set(Types.DRAGON, []);
TypeImmunities.set(Types.DARK, [Types.PSYCHIC]);
TypeImmunities.set(Types.STEEL, [Types.POISON]);
TypeImmunities.set(Types.FAIRY, [Types.DRAGON]);


function getTypeEffectiveness(type1, type2) {
  const typeMap = new Map();
  typeMap.set(Types.BUG, 1.0);
  typeMap.set(Types.DARK, 1.0);
  typeMap.set(Types.DRAGON, 1.0);
  typeMap.set(Types.ELECTRIC, 1.0);
  typeMap.set(Types.FAIRY, 1.0);
  typeMap.set(Types.FIGHTING, 1.0);
  typeMap.set(Types.FIRE, 1.0);
  typeMap.set(Types.FLYING, 1.0);
  typeMap.set(Types.GHOST, 1.0);
  typeMap.set(Types.GRASS, 1.0);
  typeMap.set(Types.GROUND, 1.0);
  typeMap.set(Types.ICE, 1.0);
  typeMap.set(Types.NORMAL, 1.0);
  typeMap.set(Types.POISON, 1.0);
  typeMap.set(Types.PSYCHIC, 1.0);
  typeMap.set(Types.ROCK, 1.0);
  typeMap.set(Types.STEEL, 1.0);
  typeMap.set(Types.WATER, 1.0);

  // Type 1 Scores
  type1 = type1.toUpperCase();
  TypeWeaknesses.get(Types[type1]).forEach(t => typeMap.set(t, typeMap.get(t) * 2.0));
  TypeResistances.get(Types[type1]).forEach(t => typeMap.set(t, typeMap.get(t) / 2.0));

  // Type 2 Scores
  if(type2) {
    type2 = type2.toUpperCase();
    TypeWeaknesses.get(Types[type2]).forEach(t => typeMap.set(t, typeMap.get(t) * 2.0));
    TypeResistances.get(Types[type2]).forEach(t => typeMap.set(t, typeMap.get(t) / 2.0));
    TypeImmunities.get(Types[type2]).forEach(t => typeMap.set(t, typeMap.get(t) * 0));
  }

  // Factor in Immunity
  TypeImmunities.get(Types[type1]).forEach(t => typeMap.set(t, typeMap.get(t) * 0));

  return typeMap;
}

function getTypeColor(type) {
  switch (type) {
    case "fire":
      return 15761456;
    case "grass":
      return 7915600;
    case "poison":
      return 10502304;
    case "normal":
      return 11053176;
    case "fighting":
      return 12595240;
    case "water":
      return 6852848;
    case "flying":
      return 11047152;
    case "electric":
      return 16306224;
    case "ground":
      return 14729320;
    case "psychic":
      return 16275592;
    case "rock":
      return 12099640;
    case "ice":
      return 10016984;
    case "bug":
      return 11057184;
    case "dragon":
      return 7354616;
    case "ghost":
      return 7362712;
    case "dark":
      return 7362632;
    case "steel":
      return 12105936;
    case "fairy":
      return 15636908;
  }
}

module.exports = {getTypeEffectiveness, getTypeColor};
