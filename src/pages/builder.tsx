import Head from 'next/head';
import { useEffect, useReducer, useRef } from 'react';
import { builderReducer, makeInitialState } from '@/reducer/builderReducer';
import { cmsProvider } from '@/cms/CmsProvider';
import styles from '../styles/Builder.module.css';
import { makeBuilderViewModel } from '@/reducer/builderViewModel';
import { SimpleList } from '@/components/SimpleList';
import { ModelTable } from '@/components/ModelTable';

export default function Builder() {
  const [state, dispatch] = useReducer(builderReducer, makeInitialState());
  const unitPickerRef = useRef<HTMLSelectElement>(null);
  const viewModel = makeBuilderViewModel(state);

  useEffect(() => {
    cmsProvider
      .getUnitDetails()
      .then((units) => dispatch({ type: 'SetAvailableUnitsAction', units }));
  }, []);

  return (
    <>
      <Head>
        <title>Builder | Adepta Sororitas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex-stack">
        <h1>Army Builder</h1>
        <p className={styles.pickerRow}>
          <label htmlFor="unit-picker">Available units:</label>
          <select id="unit-picker" ref={unitPickerRef}>
            {state.availableUnits.map((unit) => (
              <option key={unit._id} value={unit._id}>
                {unit.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: 'AddUnitAction',
                id: unitPickerRef.current?.value,
              })
            }
          >
            Add
          </button>
        </p>

        <hr />

        <p>
          <span className="large-text">Total power:</span>{' '}
          <span className="power-badge">{viewModel.totalPower}</span>
        </p>

        {viewModel.units.map((unit) => {
          return (
            <div key={unit.id}>
              <div className={styles.unitRow}>
                <img src={unit.imageUrl} alt={unit.name} />
                <div>
                  <div className="flex-row mb">
                    <h2>{unit.name}</h2>
                    <div className="power-badge">{unit.power}</div>
                    <SimpleList items={unit.keywords} />
                  </div>
                  {unit.models.map((model) => (
                    <ModelTable key={model.key} model={model} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}
