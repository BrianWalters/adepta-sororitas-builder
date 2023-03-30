import { BuilderState } from '@/reducer/state/BuilderState';
import { makeTestModel, makeTestUnit } from '@/testHelpers';
import { detachUnit } from '@/reducer/actions/detachUnit';

describe('detachUnit action', () => {
  it('should remove the attached unit from the host unit', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit(),
        makeTestUnit({
          _id: 'unit-canoness',
          name: 'Canoness',
          keywords: ['Character'],
          models: [
            {
              id: 'model-spec-canoness',
              count: 1,
              additionalPowerCost: 0,
              model: makeTestModel({
                _id: 'canoness-model',
                name: 'Canoness',
              }),
            },
          ],
        }),
      ],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [],
          baseUnitId: 'unit-1',
          addedModels: [],
          attachedUnits: ['selected-canoness'],
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

    const newState = detachUnit(state, {
      type: 'DetachUnitAction',
      attachedUnitId: 'selected-canoness',
    });

    expect(newState.selectedUnits[0].attachedUnits).toEqual([]);
    expect(newState.selectedUnits[1].attachedUnits).toEqual([]);
  });

  it('should only detach the given unit instead of all attached units', () => {
    const state: BuilderState = {
      availableUnits: [
        makeTestUnit(),
        makeTestUnit({
          _id: 'unit-canoness',
          name: 'Canoness',
          keywords: ['Character'],
          models: [
            {
              id: 'model-spec-canoness',
              count: 1,
              additionalPowerCost: 0,
              model: makeTestModel({
                _id: 'canoness-model',
                name: 'Canoness',
              }),
            },
          ],
        }),
      ],
      selectedUnits: [
        {
          id: 'selected-unit-1',
          wargearOptions: [],
          baseUnitId: 'unit-1',
          addedModels: [],
          attachedUnits: ['selected-canoness', 'another-selected-canoness'],
        },
        {
          id: 'selected-canoness',
          wargearOptions: [],
          baseUnitId: 'unit-canoness',
          addedModels: [],
          attachedUnits: [],
        },
        {
          id: 'another-selected-canoness',
          attachedUnits: [],
          baseUnitId: 'unit-canoness',
          addedModels: [],
          wargearOptions: [],
        },
      ],
    };

    const newState = detachUnit(state, {
      type: 'DetachUnitAction',
      attachedUnitId: 'selected-canoness',
    });

    expect(newState.selectedUnits[0].attachedUnits).toEqual([
      'another-selected-canoness',
    ]);
    expect(newState.selectedUnits[1].attachedUnits).toEqual([]);
    expect(newState.selectedUnits[2].attachedUnits).toEqual([]);
  });
});
