import { BuilderState } from '@/reducer/state/BuilderState';
import {
  makeTestCanoness,
  makeTestModel,
  makeTestMortifier,
  makeTestUnit,
  makeTestWargearOption,
  makeTestWeapon,
} from '@/testHelpers';
import { makeBuilderViewModel } from '@/reducer/makeBuilderViewModel';

describe('Builder view model', () => {
  it('should add up the power of the selected units', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit()],
      selectedUnits: [
        {
          id: '1234567890',
          baseUnitId: 'unit-1',
          addedModels: [],
          wargearOptions: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.totalPower).toEqual(4);
  });

  it('should also add up the power of models added to those selected units', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          models: [
            {
              id: 'model-spec-1',
              model: makeTestModel(),
              count: 1,
              additionalPowerCost: 0,
            },
            {
              id: 'model-spec-2',
              model: makeTestModel(),
              count: 1,
              additionalPowerCost: 1,
            },
            {
              id: 'model-spec-3',
              model: makeTestModel(),
              count: 1,
              additionalPowerCost: 1,
            },
          ],
        }),
      ],
      selectedUnits: [
        {
          id: '1234567890',
          baseUnitId: 'unit-1',
          addedModels: ['model-spec-2', 'model-spec-3'],
          wargearOptions: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.totalPower).toEqual(6);
  });

  it('should have an entry for each selected unit', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          models: [
            {
              id: 'model-spec-1',
              model: makeTestModel(),
              count: 4,
              additionalPowerCost: 0,
            },
            {
              id: 'model-spec-2',
              model: makeTestModel(),
              count: 1,
              additionalPowerCost: 1,
            },
          ],
        }),
      ],
      selectedUnits: [
        {
          id: '1234567890',
          baseUnitId: 'unit-1',
          addedModels: ['model-spec-2'],
          wargearOptions: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units).toHaveLength(1);
    expect(viewModel.units[0].id).toEqual('1234567890');
    expect(viewModel.units[0].name).toEqual('Unit #1');
    expect(viewModel.units[0].imageUrl).toEqual('https://placehold.co/600x400');
    expect(viewModel.units[0].power).toEqual(5);
    expect(viewModel.units[0].keywords).toEqual(['Infantry']);
  });

  it('should number each unit of the same type', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit()],
      selectedUnits: [
        {
          id: '1',
          baseUnitId: 'unit-1',
          addedModels: [],
          wargearOptions: [],
          attachedUnits: [],
        },
        {
          id: '2',
          baseUnitId: 'unit-1',
          addedModels: [],
          wargearOptions: [],
          attachedUnits: [],
        },
        {
          id: '3',
          baseUnitId: 'unit-1',
          addedModels: [],
          wargearOptions: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units).toHaveLength(3);
    expect(viewModel.units[0].name).toEqual('Unit #1');
    expect(viewModel.units[1].name).toEqual('Unit #2');
    expect(viewModel.units[2].name).toEqual('Unit #3');
  });

  it('should list the selected units in alphabetical order', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit(),
        makeTestUnit({
          name: 'A',
          _id: 'unit-2',
        }),
      ],
      selectedUnits: [
        {
          id: '1',
          baseUnitId: 'unit-1',
          addedModels: [],
          wargearOptions: [],
          attachedUnits: [],
        },
        {
          id: '2',
          baseUnitId: 'unit-2',
          addedModels: [],
          wargearOptions: [],
          attachedUnits: [],
        },
        {
          id: '3',
          baseUnitId: 'unit-2',
          addedModels: [],
          wargearOptions: [],
          attachedUnits: [],
        },
        {
          id: '4',
          baseUnitId: 'unit-1',
          addedModels: [],
          wargearOptions: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units).toHaveLength(4);
    expect(viewModel.units[0].name).toEqual('A #1');
    expect(viewModel.units[1].name).toEqual('A #2');
    expect(viewModel.units[2].name).toEqual('Unit #1');
    expect(viewModel.units[3].name).toEqual('Unit #2');
  });

  it('should include the intrinsic models for each unit', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit()],
      selectedUnits: [
        {
          id: '1',
          baseUnitId: 'unit-1',
          addedModels: [],
          wargearOptions: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units[0].models).toHaveLength(4);
    expect(viewModel.units[0].models[0]._id).toEqual('model-1');
    expect(viewModel.units[0].models[0].key).toBeDefined();
    expect(viewModel.units[0].models[0].name).toEqual('Model');
    expect(viewModel.units[0].models[0].imageUrl).toEqual(
      'https://placehold.co/600x400',
    );
    expect(viewModel.units[0].models[0].strength).toEqual(3);
    expect(viewModel.units[0].models[0].attacks).toEqual(1);
    expect(viewModel.units[0].models[0].ballisticsSkill).toEqual(3);
    expect(viewModel.units[0].models[0].leadership).toEqual(7);
    expect(viewModel.units[0].models[0].save).toEqual(3);
    expect(viewModel.units[0].models[0].movement).toEqual(6);
    expect(viewModel.units[0].models[0].toughness).toEqual(3);
    expect(viewModel.units[0].models[0].weaponsSkill).toEqual(4);
    expect(viewModel.units[0].models[0].wounds).toEqual(1);
  });

  it('should include the added models for each unit', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          models: [
            {
              id: 'model-spec-1',
              model: makeTestModel(),
              count: 4,
              additionalPowerCost: 0,
            },
            {
              id: 'model-spec-2',
              model: makeTestModel({
                name: 'Model Superior',
              }),
              count: 1,
              additionalPowerCost: 1,
            },
          ],
        }),
      ],
      selectedUnits: [
        {
          id: '1',
          baseUnitId: 'unit-1',
          addedModels: ['model-spec-2'],
          wargearOptions: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units[0].models).toHaveLength(5);
    expect(viewModel.units[0].models[0].name).toEqual('Model');
    expect(viewModel.units[0].models[1].name).toEqual('Model');
    expect(viewModel.units[0].models[2].name).toEqual('Model');
    expect(viewModel.units[0].models[3].name).toEqual('Model');
    expect(viewModel.units[0].models[4].name).toEqual('Model Superior');
  });

  it('should show the default weapons if there are no wargear options set', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit()],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [],
          baseUnitId: 'unit-1',
          addedModels: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units[0].models[0].wargear).toHaveLength(1);
    expect(viewModel.units[0].models[0].wargear[0]._id).toEqual('weapon-1');
    expect(viewModel.units[0].models[0].wargear[0].name).toEqual('Weapon');
  });

  it('should adjust the wargear if any wargear options have been set', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit()],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [
            {
              optionId: 'wargear-option-1',
              choiceId: 'wargear-choice-1',
              count: 2,
            },
          ],
          baseUnitId: 'unit-1',
          addedModels: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units[0].models[0].wargear[0]._id).toEqual('wargear-1');
    expect(viewModel.units[0].models[1].wargear[0]._id).toEqual('wargear-1');
    expect(viewModel.units[0].models[2].wargear[0]._id).toEqual('weapon-1');
    expect(viewModel.units[0].models[3].wargear[0]._id).toEqual('weapon-1');
  });

  it('should only apply the wargear option to the matching model', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          models: [
            {
              id: 'model-spec-1',
              model: makeTestModel(),
              count: 4,
              additionalPowerCost: 0,
            },
            {
              id: 'model-spec-2',
              model: makeTestModel({
                _id: 'model-2',
                name: 'Other model',
              }),
              count: 1,
              additionalPowerCost: 2,
            },
          ],
          wargearOptions: [
            makeTestWargearOption(),
            makeTestWargearOption({
              id: 'wargear-option-2',
              limit: 1,
              modelId: 'model-2',
              wargearChoices: [
                {
                  id: 'wargear-choice-2',
                  wargearAdded: [
                    {
                      _id: 'weapon-2',
                      key: 'key-1',
                      name: 'Weapon',
                      type: 'Assault 2',
                      armorPiercing: -1,
                      damage: '1',
                      range: 12,
                      strength: '6',
                    },
                  ],
                },
              ],
            }),
          ],
        }),
      ],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [
            {
              optionId: 'wargear-option-1',
              choiceId: 'wargear-choice-1',
              count: 2,
            },
            {
              optionId: 'wargear-option-2',
              choiceId: 'wargear-choice-2',
              count: 1,
            },
          ],
          baseUnitId: 'unit-1',
          addedModels: ['model-spec-2'],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units[0].models).toHaveLength(5);
    expect(viewModel.units[0].models[0].wargear[0]._id).toEqual('wargear-1');
    expect(viewModel.units[0].models[1].wargear[0]._id).toEqual('wargear-1');
    expect(viewModel.units[0].models[2].wargear[0]._id).toEqual('weapon-1');
    expect(viewModel.units[0].models[3].wargear[0]._id).toEqual('weapon-1');
    expect(viewModel.units[0].models[4].wargear[0]._id).toEqual('weapon-2');
  });

  it('should only remove a single weapon if there are more than one in the default weapons', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          defaultWeapons: [
            {
              _id: 'weapon-1',
              key: '123',
              name: 'Bolt Pistol',
              type: 'Pistol 1',
              armorPiercing: 0,
              damage: '1',
              range: 12,
              strength: '4',
            },
            {
              _id: 'weapon-1',
              key: '456',
              name: 'Bolt Pistol',
              type: 'Pistol 1',
              armorPiercing: 0,
              damage: '1',
              range: 12,
              strength: '4',
            },
          ],
          wargearOptions: [
            makeTestWargearOption({
              wargearRemoved: ['weapon-1'],
              wargearChoices: [
                {
                  id: 'wargear-choice-1',
                  wargearAdded: [
                    {
                      _id: 'weapon-2',
                      key: '456',
                      name: 'Plasma Pistol',
                      type: 'Pistol 1',
                      armorPiercing: -3,
                      damage: '1',
                      range: 12,
                      strength: '7',
                    },
                  ],
                },
              ],
            }),
          ],
        }),
      ],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [
            {
              optionId: 'wargear-option-1',
              choiceId: 'wargear-choice-1',
              count: 1,
            },
          ],
          baseUnitId: 'unit-1',
          addedModels: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units[0].models[0].wargear[0].name).toEqual('Bolt Pistol');
    expect(viewModel.units[0].models[0].wargear[1].name).toEqual(
      'Plasma Pistol',
    );
    expect(viewModel.units[0].models[1].wargear[0].name).toEqual('Bolt Pistol');
    expect(viewModel.units[0].models[1].wargear[1].name).toEqual('Bolt Pistol');
  });

  it('should apply more than one wargear option to a model if it can', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          defaultWeapons: [
            {
              _id: 'weapon-1',
              key: '123',
              name: 'Bolt Pistol',
              type: 'Pistol 1',
              armorPiercing: 0,
              damage: '1',
              range: 12,
              strength: '4',
            },
            {
              _id: 'weapon-1',
              key: '456',
              name: 'Bolt Pistol',
              type: 'Pistol 1',
              armorPiercing: 0,
              damage: '1',
              range: 12,
              strength: '4',
            },
          ],
          wargearOptions: [
            makeTestWargearOption({
              id: 'wargear-option-1',
              wargearRemoved: ['weapon-1'],
              wargearChoices: [
                {
                  id: 'wargear-choice-1',
                  wargearAdded: [
                    {
                      _id: 'weapon-2',
                      key: '456',
                      name: 'Plasma Pistol',
                      type: 'Pistol 1',
                      armorPiercing: -3,
                      damage: '1',
                      range: 12,
                      strength: '7',
                    },
                  ],
                },
              ],
            }),
            makeTestWargearOption({
              id: 'wargear-option-2',
              wargearRemoved: ['weapon-1'],
              wargearChoices: [
                {
                  id: 'wargear-choice-2',
                  wargearAdded: [
                    {
                      _id: 'weapon-3',
                      key: '789',
                      name: 'Power Sword',
                      type: 'Melee',
                      armorPiercing: -3,
                      damage: '1',
                      range: 0,
                      strength: 'User',
                    },
                  ],
                },
              ],
            }),
          ],
        }),
      ],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [
            {
              optionId: 'wargear-option-1',
              choiceId: 'wargear-choice-1',
              count: 1,
            },
            {
              optionId: 'wargear-option-2',
              choiceId: 'wargear-choice-2',
              count: 1,
            },
          ],
          baseUnitId: 'unit-1',
          addedModels: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units[0].models[0].wargear[0].name).toEqual(
      'Plasma Pistol',
    );
    expect(viewModel.units[0].models[0].wargear[1].name).toEqual('Power Sword');
    expect(viewModel.units[0].models[1].wargear[0].name).toEqual('Bolt Pistol');
    expect(viewModel.units[0].models[1].wargear[1].name).toEqual('Bolt Pistol');
  });

  it('should flag wargear that was added via a wargear option', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          defaultWeapons: [
            {
              _id: 'weapon-1',
              key: '123',
              name: 'Bolt Pistol',
              type: 'Pistol 1',
              armorPiercing: 0,
              damage: '1',
              range: 12,
              strength: '4',
            },
            {
              _id: 'weapon-1',
              key: '456',
              name: 'Bolt Pistol',
              type: 'Pistol 1',
              armorPiercing: 0,
              damage: '1',
              range: 12,
              strength: '4',
            },
          ],
          wargearOptions: [
            makeTestWargearOption({
              id: 'wargear-option-1',
              wargearRemoved: ['weapon-1'],
              wargearChoices: [
                {
                  id: 'wargear-choice-1',
                  wargearAdded: [
                    {
                      _id: 'weapon-2',
                      key: '456',
                      name: 'Plasma Pistol',
                      type: 'Pistol 1',
                      armorPiercing: -3,
                      damage: '1',
                      range: 12,
                      strength: '7',
                    },
                  ],
                },
              ],
            }),
            makeTestWargearOption({
              id: 'wargear-option-2',
              wargearRemoved: ['weapon-1'],
              wargearChoices: [
                {
                  id: 'wargear-choice-2',
                  wargearAdded: [
                    {
                      _id: 'weapon-3',
                      key: '789',
                      name: 'Power Sword',
                      type: 'Melee',
                      armorPiercing: -3,
                      damage: '1',
                      range: 0,
                      strength: 'User',
                    },
                  ],
                },
              ],
            }),
          ],
        }),
      ],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [
            {
              optionId: 'wargear-option-1',
              choiceId: 'wargear-choice-1',
              count: 1,
            },
            {
              optionId: 'wargear-option-2',
              choiceId: 'wargear-choice-2',
              count: 1,
            },
          ],
          baseUnitId: 'unit-1',
          addedModels: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units[0].models[0].wargear[0].addedFromOption).toEqual(
      true,
    );
    expect(viewModel.units[0].models[0].wargear[1].addedFromOption).toEqual(
      true,
    );
    expect(
      viewModel.units[0].models[1].wargear[0].addedFromOption,
    ).toBeUndefined();
    expect(
      viewModel.units[0].models[1].wargear[1].addedFromOption,
    ).toBeUndefined();
  });

  it('should allow wargear options to skip models and apply to those that fit the requirements', () => {
    const state: BuilderState = {
      availableUnits: [makeTestMortifier()],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          addedModels: [],
          baseUnitId: 'unit-mortifier',
          attachedUnits: [],
          wargearOptions: [
            {
              optionId: 'double-buzz-blade-option',
              count: 1,
              choiceId: 'double-buzz-blades',
            },
            {
              optionId: 'single-buzz-blade-option',
              count: 1,
              choiceId: 'one-buzz-blade',
            },
          ],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units[0].models[0].wargear[0].name).toEqual(
      'Penitent buzz-blade',
    );
    expect(viewModel.units[0].models[0].wargear[1].name).toEqual(
      'Penitent buzz-blade',
    );
    expect(viewModel.units[0].models[1].wargear[0].name).toEqual(
      'Penitent flail',
    );
    expect(viewModel.units[0].models[1].wargear[1].name).toEqual(
      'Penitent buzz-blade',
    );
  });

  it('should only apply a wargear option if the requirements are met', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          wargearOptions: [
            makeTestWargearOption({
              wargearRemoved: [],
              wargearRequirements: ['weapon-1'],
            }),
            makeTestWargearOption({
              id: 'wargear-option-2',
              wargearRemoved: ['weapon-1'],
              wargearChoices: [
                {
                  id: 'wargear-choice-2',
                  wargearAdded: [
                    makeTestWeapon({
                      _id: 'meltagun',
                      name: 'Meltagun',
                      key: 'meltagun-key-1',
                      damage: 'D6',
                      armorPiercing: -4,
                      strength: '8',
                      range: 12,
                      type: 'Assault 1',
                    }),
                  ],
                },
              ],
            }),
          ],
        }),
      ],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          baseUnitId: 'unit-1',
          addedModels: [],
          attachedUnits: [],
          wargearOptions: [
            {
              optionId: 'wargear-option-1',
              choiceId: 'wargear-choice-1',
              count: 1,
            },
            {
              optionId: 'wargear-option-2',
              count: 1,
              choiceId: 'wargear-choice-2',
            },
          ],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units[0].models[0].wargear).toHaveLength(2);
    expect(viewModel.units[0].models[0].wargear[0].name).toEqual('Weapon');
    expect(viewModel.units[0].models[0].wargear[1].name).toEqual('Wargear');
    expect(viewModel.units[0].models[1].wargear).toHaveLength(1);
    expect(viewModel.units[0].models[1].wargear[0].name).toEqual('Meltagun');
    expect(viewModel.units[0].models[2].wargear).toHaveLength(1);
    expect(viewModel.units[0].models[2].wargear[0].name).toEqual('Weapon');
    expect(viewModel.units[0].models[3].wargear).toHaveLength(1);
    expect(viewModel.units[0].models[3].wargear[0].name).toEqual('Weapon');
  });

  it('should attach units to their host units', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit(), makeTestCanoness()],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [],
          attachedUnits: ['selected-canoness'],
          baseUnitId: 'unit-1',
          addedModels: [],
        },
        {
          id: 'selected-canoness',
          wargearOptions: [],
          baseUnitId: 'unit-canoness',
          addedModels: [],
          attachedUnits: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units).toHaveLength(1);
    expect(viewModel.units[0].attachedUnits).toHaveLength(1);
    expect(viewModel.units[0].attachedUnits[0].id).toEqual('selected-canoness');
  });

  it('should list the available attachments on character units to infantry (non-character) units', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit(), makeTestCanoness(), makeTestMortifier()],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [],
          attachedUnits: [],
          baseUnitId: 'unit-1',
          addedModels: [],
        },
        {
          id: 'selected-canoness',
          wargearOptions: [],
          baseUnitId: 'unit-canoness',
          addedModels: [],
          attachedUnits: [],
        },
        {
          id: 'selected-unit-2',
          wargearOptions: [],
          attachedUnits: [],
          baseUnitId: 'unit-1',
          addedModels: [],
        },
        {
          id: 'selected-mortifier-1',
          wargearOptions: [],
          attachedUnits: [],
          baseUnitId: 'unit-mortifier',
          addedModels: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.units[0].canAttachTo).toHaveLength(2);
    expect(viewModel.units[0].canAttachTo).toEqual([
      {
        id: 'selected-unit-1',
        name: 'Unit #1',
      },
      {
        id: 'selected-unit-2',
        name: 'Unit #2',
      },
    ]);
    expect(viewModel.units[1].canAttachTo).toHaveLength(0);
    expect(viewModel.units[2].canAttachTo).toHaveLength(0);
    expect(viewModel.units[3].canAttachTo).toHaveLength(0);
  });
});
