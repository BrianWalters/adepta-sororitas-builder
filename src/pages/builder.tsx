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
  console.log(`STATE`, state, 'VM', viewModel);

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
          const baseUnit = state.availableUnits.find(
            (au) => au._id === unit.baseUnitId,
          );
          const selectedUnit = state.selectedUnits.find(
            (su) => su.id === unit.id,
          );
          return (
            <div key={unit.id}>
              <div className={styles.unitRow}>
                <img src={unit.imageUrl} alt={unit.name} />
                <div className={styles.modelStack}>
                  <div className="flex-row">
                    <h2>{unit.name}</h2>
                    <div className="power-badge">{unit.power}</div>
                    <SimpleList items={unit.keywords} />
                  </div>
                  {unit.models.map((model) => (
                    <ModelTable key={model.key} model={model} />
                  ))}
                </div>
                <div className="flex-stack">
                  {baseUnit?.models
                    .filter((modelSet) => modelSet.additionalPowerCost > 0)
                    .map((modelSet) => {
                      return (
                        <label className="flex-row" key={modelSet.id}>
                          <input
                            type="checkbox"
                            defaultChecked={selectedUnit?.addedModels.includes(
                              modelSet.id,
                            )}
                            onChange={(event) =>
                              dispatch({
                                type: event.target.checked
                                  ? 'AddModelsAction'
                                  : 'RemoveModelsAction',
                                selectedUnitId: selectedUnit?.id || '',
                                modelSetId: modelSet.id,
                              })
                            }
                          />
                          {modelSet.count} {modelSet.model.name} for{' '}
                          {modelSet.additionalPowerCost} power
                        </label>
                      );
                    })}
                  {baseUnit?.wargearOptions.map((wargearOption) => {
                    const model = baseUnit.models.find(
                      (modelSet) =>
                        modelSet.model._id === wargearOption.modelId,
                    );
                    return (
                      <div className={styles.controlRow} key={wargearOption.id}>
                        Equip
                        <input
                          type="number"
                          max={wargearOption.limit}
                          min={0}
                          size={2}
                          value={
                            selectedUnit?.wargearOptions.find(
                              (option) => option.optionId === wargearOption.id,
                            )?.count || 0
                          }
                          onChange={(evt) =>
                            dispatch({
                              type: 'SetWargearOptionAction',
                              count: parseInt(evt.currentTarget.value, 10),
                              selectedUnitId: selectedUnit?.id || '',
                              wargearOptionId: wargearOption.id,
                            })
                          }
                        />
                        <span>{`${model?.model.name || ''} with`}</span>
                        <select
                          value={
                            selectedUnit?.wargearOptions.find(
                              (option) => option.optionId === wargearOption.id,
                            )?.choiceId
                          }
                          onChange={(evt) =>
                            dispatch({
                              type: 'SetWargearOptionAction',
                              selectedUnitId: selectedUnit?.id || '',
                              wargearOptionId: wargearOption.id,
                              wargearChoiceId: evt.currentTarget.value,
                            })
                          }
                        >
                          {wargearOption.wargearChoices.map((choice) => {
                            return (
                              <option key={choice.id} value={choice.id}>
                                {choice.wargearAdded
                                  .map((wg) => wg.name)
                                  .join(', ')}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}
