import { BuilderState } from '@/reducer/state/BuilderState';
import { makeTestModel, makeTestUnit } from '@/testHelpers';
import { attachUnit } from '@/reducer/actions/attachUnit';

describe('attachUnit', () => {
  it('should set the attached unit to the host unit', () => {
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
          attachedUnits: [],
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

    const newState = attachUnit(state, {
      type: 'AttachUnitAction',
      hostUnitId: 'selected-unit-1',
      unitToAttachId: 'selected-canoness',
    });

    expect(newState.selectedUnits[0].attachedUnits).toHaveLength(1);
    expect(newState.selectedUnits[1].attachedUnits).toHaveLength(0);
    expect(newState.selectedUnits[0].attachedUnits[0]).toEqual(
      'selected-canoness',
    );
  });

  it('should be able to attach multiple units to a unit when a unit is already attached', () => {
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
        {
          id: 'another-selected-canoness',
          attachedUnits: [],
          baseUnitId: 'unit-canoness',
          addedModels: [],
          wargearOptions: [],
        },
      ],
    };

    const newState = attachUnit(state, {
      type: 'AttachUnitAction',
      hostUnitId: 'selected-unit-1',
      unitToAttachId: 'another-selected-canoness',
    });

    expect(newState.selectedUnits[0].attachedUnits).toHaveLength(2);
    expect(newState.selectedUnits[0].attachedUnits).toEqual([
      'selected-canoness',
      'another-selected-canoness',
    ]);
  });

  it('should only attach units that have the Character keyword', () => {
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
          attachedUnits: [],
        },
        {
          id: 'selected-unit-2',
          wargearOptions: [],
          baseUnitId: 'unit-1',
          addedModels: [],
          attachedUnits: [],
        },
      ],
    };

    const newState = attachUnit(state, {
      type: 'AttachUnitAction',
      hostUnitId: 'selected-unit-1',
      unitToAttachId: 'selected-unit-2',
    });

    expect(newState.selectedUnits[0].attachedUnits).toHaveLength(0);
    expect(newState.selectedUnits[1].attachedUnits).toHaveLength(0);
  });

  it('should not attach a unit that has already been attached', () => {
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
          id: 'selected-unit-2',
          wargearOptions: [],
          baseUnitId: 'unit-1',
          addedModels: [],
          attachedUnits: [],
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

    const newState = attachUnit(state, {
      type: 'AttachUnitAction',
      hostUnitId: 'selected-unit-2',
      unitToAttachId: 'selected-canoness',
    });

    expect(newState.selectedUnits[0].attachedUnits).toEqual([
      'selected-canoness',
    ]);
    expect(newState.selectedUnits[1].attachedUnits).toEqual([]);
    expect(newState.selectedUnits[2].attachedUnits).toEqual([]);
  });
});
