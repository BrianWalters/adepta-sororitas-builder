import { BuilderState } from '@/reducer/state/BuilderState';
import { makeTestModel, makeTestUnit } from '@/testHelpers';
import { makeBuilderViewModel } from '@/reducer/builderViewModel';

describe('Builder view model', () => {
  it('should add up the power of the selected units', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit()],
      selectedUnits: [
        {
          id: '1234567890',
          baseUnitId: 'unit-1',
          addedModels: [],
          addedWargearChoices: [],
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
          addedWargearChoices: [],
        },
      ],
    };

    const viewModel = makeBuilderViewModel(state);

    expect(viewModel.totalPower).toEqual(6);
  });
});
