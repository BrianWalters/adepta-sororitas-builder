import { BuilderState } from '@/reducer/state/BuilderState';
import { makeTestModel, makeTestUnit } from '@/testHelpers';
import { addModels } from '@/reducer/actions/addModels';
import { addUnit } from '@/reducer/actions/addUnit';

describe('addModels action', () => {
  it('should add the given model to the active models list', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          models: [
            {
              id: 'model-spec-1',
              count: 1,
              additionalPowerCost: 0,
              model: makeTestModel(),
            },
            {
              id: 'model-spec-2',
              count: 1,
              additionalPowerCost: 1,
              model: makeTestModel(),
            },
          ],
        }),
      ],
      selectedUnits: [],
    };

    const stateWithUnitAdded = addUnit(state, {
      type: 'AddUnitAction',
      id: 'unit-1',
    });

    const addedUnitID = stateWithUnitAdded.selectedUnits[0].id;

    const newState = addModels(stateWithUnitAdded, {
      type: 'AddModelsAction',
      selectedUnitId: addedUnitID,
      modelSetId: 'model-spec-2',
    });

    expect(newState.selectedUnits[0].addedModels).toHaveLength(1);
    expect(newState.selectedUnits[0].addedModels[0]).toEqual('model-spec-2');
  });

  it('should ignore the add if the model set is intrinsically part of the unit', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          models: [
            {
              id: 'model-spec-1',
              count: 1,
              additionalPowerCost: 0,
              model: makeTestModel(),
            },
            {
              id: 'model-spec-2',
              count: 1,
              additionalPowerCost: 1,
              model: makeTestModel(),
            },
          ],
        }),
      ],
      selectedUnits: [],
    };

    const stateWithUnitAdded = addUnit(state, {
      type: 'AddUnitAction',
      id: 'unit-1',
    });

    const addedUnitID = stateWithUnitAdded.selectedUnits[0].id;

    const newState = addModels(stateWithUnitAdded, {
      type: 'AddModelsAction',
      selectedUnitId: addedUnitID,
      modelSetId: 'model-spec-1',
    });

    expect(newState.selectedUnits[0].addedModels).toEqual([]);
  });

  it('should not be able to add a model set that has already been added', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          models: [
            {
              id: 'model-spec-1',
              count: 1,
              additionalPowerCost: 0,
              model: makeTestModel(),
            },
            {
              id: 'model-spec-2',
              count: 1,
              additionalPowerCost: 1,
              model: makeTestModel(),
            },
          ],
        }),
      ],
      selectedUnits: [
        {
          id: '1234567890',
          wargearOptions: [],
          baseUnitId: 'unit-1',
          addedModels: ['model-spec-2'],
        },
      ],
    };

    const newState = addModels(state, {
      type: 'AddModelsAction',
      selectedUnitId: '1234567890',
      modelSetId: 'model-spec-2',
    });

    expect(newState.selectedUnits[0].addedModels).toEqual(['model-spec-2']);
  });

  it('should handle adding more than one model set', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit({
          models: [
            {
              id: 'model-spec-1',
              count: 1,
              additionalPowerCost: 0,
              model: makeTestModel(),
            },
            {
              id: 'model-spec-2',
              count: 1,
              additionalPowerCost: 1,
              model: makeTestModel(),
            },
            {
              id: 'model-spec-3',
              count: 1,
              additionalPowerCost: 1,
              model: makeTestModel(),
            },
          ],
        }),
      ],
      selectedUnits: [
        {
          id: '1234567890',
          wargearOptions: [],
          baseUnitId: 'unit-1',
          addedModels: ['model-spec-2'],
        },
      ],
    };

    const newState = addModels(state, {
      type: 'AddModelsAction',
      selectedUnitId: '1234567890',
      modelSetId: 'model-spec-3',
    });

    expect(newState.selectedUnits[0].addedModels).toEqual([
      'model-spec-2',
      'model-spec-3',
    ]);
  });
});
