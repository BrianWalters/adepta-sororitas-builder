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
          addedWargearChoices: [],
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
          addedWargearChoices: [],
        },
        {
          id: '2',
          baseUnitId: 'unit-1',
          addedModels: [],
          addedWargearChoices: [],
        },
        {
          id: '3',
          baseUnitId: 'unit-1',
          addedModels: [],
          addedWargearChoices: [],
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
          addedWargearChoices: [],
        },
        {
          id: '2',
          baseUnitId: 'unit-2',
          addedModels: [],
          addedWargearChoices: [],
        },
        {
          id: '3',
          baseUnitId: 'unit-2',
          addedModels: [],
          addedWargearChoices: [],
        },
        {
          id: '4',
          baseUnitId: 'unit-1',
          addedModels: [],
          addedWargearChoices: [],
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
          addedWargearChoices: [],
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
          addedWargearChoices: [],
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
});
