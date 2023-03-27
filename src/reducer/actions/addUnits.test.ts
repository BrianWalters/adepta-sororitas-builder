import { BuilderState } from '../state/BuilderState';
import { addUnit } from './addUnit';
import { makeTestUnit } from '@/testHelpers';

describe('addUnits action', () => {
  it('should copy the unit to the selected units array', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit()],
      selectedUnits: [],
    };

    const newState = addUnit(state, {
      type: 'AddUnitAction',
      id: 'unit-1',
    });

    expect(newState.selectedUnits).toHaveLength(1);
    expect(newState.selectedUnits[0].baseUnitId).toEqual('unit-1');
    expect(newState.selectedUnits[0].id).toBeDefined();
    expect(newState.selectedUnits[0].addedModels).toEqual([]);
    expect(newState.selectedUnits[0].wargearOptions).toEqual([]);
  });

  it('should append the unit to the end of the array', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit(), makeTestUnit({ _id: 'unit-2' })],
      selectedUnits: [
        {
          id: '1234567890',
          wargearOptions: [],
          baseUnitId: 'unit-1',
          addedModels: [],
        },
      ],
    };

    const newState = addUnit(state, {
      type: 'AddUnitAction',
      id: 'unit-2',
    });

    expect(newState.selectedUnits).toHaveLength(2);
    expect(newState.selectedUnits[1].baseUnitId).toEqual('unit-2');
  });
});
