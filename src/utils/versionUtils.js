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

module.exports = { getVersionId };
