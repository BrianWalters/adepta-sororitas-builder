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
      type: 'AddUnit',
      id: 'unit-1',
    });

    expect(newState.selectedUnits).toHaveLength(1);
    expect(newState.selectedUnits[0]._id).toEqual('unit-1');
    expect(newState.selectedUnits[0]).not.toBe(newState.availableUnits[0]);
  });

  it('should append the unit to the end of the array', () => {
    const state: BuilderState = {
      availableUnits: [makeTestUnit(), makeTestUnit({ _id: 'unit-2' })],
      selectedUnits: [makeTestUnit()],
    };

    const newState = addUnit(state, {
      type: 'AddUnit',
      id: 'unit-2',
    });

    expect(newState.selectedUnits).toHaveLength(2);
    expect(newState.selectedUnits[1]._id).toEqual('unit-2');
  });
});
