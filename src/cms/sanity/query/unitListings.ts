export const unitListings = `
*[_type == "unit"] {
  name,
  "abilities": abilities[]->name,
  power,
  keywords,
  "imageAsset": image.asset
}`;
