import { BuilderState } from '@/reducer/state/BuilderState';
import { makeTestUnit, makeTestWargearOption } from '@/testHelpers';
import { setWargearOption } from '@/reducer/actions/setWargearOption';

describe('setWargearOption action', () => {
  it('should add the wargear option with a choice', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit()],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [],
          baseUnitId: 'unit-1',
          addedModels: [],
        },
      ],
    };

    const newState = setWargearOption(state, {
      type: 'SetWargearOptionAction',
      selectedUnitId: 'selected-unit-1',
      wargearOptionId: 'wargear-option-1',
      wargearChoiceId: 'wargear-choice-1',
    });

    expect(newState.selectedUnits[0].wargearOptions).toHaveLength(1);
    expect(newState.selectedUnits[0].wargearOptions[0]).toEqual({
      optionId: 'wargear-option-1',
      choiceId: 'wargear-choice-1',
      count: 1,
    });
  });

  it('should add multiple wargear choices', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          wargearOptions: [
            {
              id: 'wargear-option-1',
              limit: 1,
              modelId: 'model-1',
              wargearRemoved: ['weapon-1'],
              wargearChoices: [
                {
                  id: 'wargear-choice-1',
                  wargearAdded: [
                    {
                      _id: 'wargear-1',
                      name: 'Wargear',
                      abilities: [],
                    },
                  ],
                },
              ],
            },
            {
              id: 'wargear-option-2',
              limit: 2,
              modelId: 'model-1',
              wargearRemoved: ['weapon-1'],
              wargearChoices: [
                {
                  id: 'wargear-choice-2',
                  wargearAdded: [
                    {
                      _id: 'weapon-2',
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
            },
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
        },
      ],
    };

    const newState = setWargearOption(state, {
      type: 'SetWargearOptionAction',
      selectedUnitId: 'selected-unit-1',
      wargearOptionId: 'wargear-option-2',
      wargearChoiceId: 'wargear-choice-2',
    });

    expect(newState.selectedUnits[0].wargearOptions).toHaveLength(2);
    expect(newState.selectedUnits[0].wargearOptions[1]).toEqual({
      optionId: 'wargear-option-2',
      choiceId: 'wargear-choice-2',
      count: 1,
    });
  });

  it('should allow a choice to be selected a number of times up to its limit', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          wargearOptions: [
            makeTestWargearOption({
              limit: 3,
            }),
          ],
        }),
      ],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [],
          baseUnitId: 'unit-1',
          addedModels: [],
        },
      ],
    };

    const state1 = setWargearOption(state, {
      type: 'SetWargearOptionAction',
      selectedUnitId: 'selected-unit-1',
      wargearOptionId: 'wargear-option-1',
      wargearChoiceId: 'wargear-choice-1',
      count: 4,
    });

    expect(state1.selectedUnits[0].wargearOptions[0].count).toEqual(3);
  });

  it('should update the count and choice if this option has already been set', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          wargearOptions: [
            {
              id: 'wargear-option-1',
              limit: 2,
              modelId: 'model-1',
              wargearRemoved: ['weapon-1'],
              wargearChoices: [
                {
                  id: 'wargear-choice-1',
                  wargearAdded: [
                    {
                      _id: 'wargear-1',
                      name: 'Wargear',
                      abilities: [],
                    },
                  ],
                },
                {
                  id: 'wargear-choice-2',
                  wargearAdded: [
                    {
                      _id: 'weapon-2',
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
            },
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
        },
      ],
    };

    const newState = setWargearOption(state, {
      type: 'SetWargearOptionAction',
      selectedUnitId: 'selected-unit-1',
      wargearOptionId: 'wargear-option-1',
      wargearChoiceId: 'wargear-choice-2',
      count: 2,
    });

    expect(newState.selectedUnits[0].wargearOptions).toHaveLength(1);
    expect(newState.selectedUnits[0].wargearOptions[0]).toEqual({
      optionId: 'wargear-option-1',
      choiceId: 'wargear-choice-2',
      count: 2,
    });
  });

  it('should remove the option if setting to a count of 0', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          wargearOptions: [
            {
              id: 'wargear-option-1',
              limit: 2,
              modelId: 'model-1',
              wargearRemoved: ['weapon-1'],
              wargearChoices: [
                {
                  id: 'wargear-choice-1',
                  wargearAdded: [
                    {
                      _id: 'wargear-1',
                      name: 'Wargear',
                      abilities: [],
                    },
                  ],
                },
                {
                  id: 'wargear-choice-2',
                  wargearAdded: [
                    {
                      _id: 'weapon-2',
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
            },
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
        },
      ],
    };

    const newState = setWargearOption(state, {
      type: 'SetWargearOptionAction',
      selectedUnitId: 'selected-unit-1',
      wargearOptionId: 'wargear-option-1',
      wargearChoiceId: 'wargear-choice-1',
      count: 0,
    });

    expect(newState.selectedUnits[0].wargearOptions).toHaveLength(0);
  });
});
