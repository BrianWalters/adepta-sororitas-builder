export const unitDetails = `
*[_type == "unit"] {
  _id,
  name,
  abilities[]->,
  power,
  keywords,
  "imageAsset": image.asset,
  defaultWeapons[]->,
  models[] {
    count,
    additionalPowerCost,
    model-> {
      _id,
      "imageAsset": image.asset,
      name,
      movement,
      weaponsSkill,
      ballisticsSkill,
      strength,
      toughness,
      wounds,
      attacks,
      leadership,
      save
    }
  },
  wargearOptions[] {
    limit,
    model-> {
      _id
    },
    wargearRemoved[]-> {
      _id
    },
    wargearRequirements[]->{
      _id
    },
    wargearChoices[] {
      wargearAdded[]->
    }
  }
}`;
