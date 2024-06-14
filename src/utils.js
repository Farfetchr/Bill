function getVersionId(versionText) {
  switch (versionText.toUpperCase()) {
    case "RBY":
      return 1;
    case "GSC":
      return 3;
    case "RSE":
      return 5;
    case "FRLG":
      return 7;
    case "DPP":
      return 8;
    case "HGSS":
      return 10;
    case "BW":
      return 11;
    case "B2W2":
      return 14;
    case "XY":
      return 15;
    case "OSRS":
      return 16;
    case "SM":
      return 17;
    case "USUM":
      return 18;
    case "LGPE":
      return 19;
    case "SWSH":
      return 20;
    case "BDSP":
      return 23;
    case "LA":
      return 24;
    case "SV":
      return 25;
  }
}

function getTypeColor(type) {
  switch (type) {
    case "fire":
      return 0x00f08030;
    case "grass":
      return 0x0078c850;
    case "poison":
      return 0x00a040a0;
    case "normal":
      return 0x00a8a878;
    case "fighting":
      return 0x00c03028;
    case "water":
      return 0x006890f0;
    case "flying":
      return 0x00a890f0;
    case "electric":
      return 0x00f8d030;
    case "ground":
      return 0x00e0c068;
    case "psychic":
      return 0x00f85888;
    case "rock":
      return 0x00b8a038;
    case "ice":
      return 0x0098d8d8;
    case "bug":
      return 0x00a8b820;
    case "dragon":
      return 0x007038f8;
    case "ghost":
      return 0x00705898;
    case "dark":
      return 0x00705848;
    case "steel":
      return 0x00b8b8d0;
    case "fairy":
      return 0x00ee99ac;
  }
}

module.exports = { getTypeColor, getVersionId };
