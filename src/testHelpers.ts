import { UnitDetail } from '@/domain/UnitDetail';
import { Model } from '@/domain/Model';
import { Weapon } from '@/domain/Weapon';
import { WargearOption } from '@/domain/WargearOption';

export const makeTestModel = (partialModel: Partial<Model> = {}) => {
  return {
    _id: 'model-1',
    imageUrl: 'https://placehold.co/600x400',
    name: 'Model',
    strength: 3,
    attacks: 1,
    ballisticsSkill: 3,
    leadership: 7,
    save: 3,
    movement: 6,
    toughness: 3,
    weaponsSkill: 4,
    wounds: 1,
    ...partialModel,
  };
};

export const makeTestWargearOption = (
  partialWargearOption: Partial<WargearOption> = {},
) => {
  return {
    id: 'wargear-option-1',
    limit: 1,
    modelId: 'model-1',
    wargearRemoved: ['weapon-1'],
    wargearRequirements: [],
    wargearChoices: [
      {
        id: 'wargear-choice-1',
        wargearAdded: [
          {
            _id: 'wargear-1',
            key: 'wargear-key-1',
            name: 'Wargear',
            abilities: [],
          },
        ],
      },
    ],
    ...partialWargearOption,
  };
};

export function makeTestWeapon(partialWeapon: Partial<Weapon> = {}): Weapon {
  return {
    _id: 'weapon-1',
    key: '123',
    name: 'Weapon',
    type: 'Rapid Fire 1',
    armorPiercing: 0,
    damage: '1',
    range: 24,
    strength: '4',
    ...partialWeapon,
  };
}

export const makeTestUnit = (
  partialUnit: Partial<UnitDetail> = {},
): UnitDetail => {
  return {
    _id: 'unit-1',
    imageUrl: 'https://placehold.co/600x400',
    abilities: [
      {
        name: 'Ability',
        rules: [],
      },
    ],
    name: 'Unit',
    defaultWeapons: [makeTestWeapon()],
    keywords: ['Infantry'],
    models: [
      {
        id: 'model-spec-1',
        model: makeTestModel(),
        count: 4,
        additionalPowerCost: 0,
      },
    ],
    power: 4,
    wargearOptions: [makeTestWargearOption()],
    ...partialUnit,
  };
};
