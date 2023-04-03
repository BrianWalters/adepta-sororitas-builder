import styles from '@/styles/UnitRow.module.css';
import { SimpleList } from '@/components/SimpleList';
import { ModelTable } from '@/components/ModelTable';
import { Dispatch, FunctionComponent } from 'react';
import { UnitViewModel } from '@/reducer/BuilderViewModel';
import { BuilderState } from '@/reducer/state/BuilderState';
import { BuilderAction } from '@/reducer/builderReducer';

interface UnitRowProps {
  state: BuilderState;
  selectedUnitId: string;
  unitViewModel: UnitViewModel;
  dispatch: Dispatch<BuilderAction>;
  attachedTo?: UnitViewModel;
}

export const UnitRow: FunctionComponent<UnitRowProps> = ({
  state,
  selectedUnitId,
  unitViewModel,
  dispatch,
  attachedTo = null,
}) => {
  const selectedUnit = state.selectedUnits.find(
    (su) => su.id === selectedUnitId,
  );
  if (!selectedUnit) return <div>error</div>;

  const baseUnit = state.availableUnits.find(
    (au) => au._id === selectedUnit.baseUnitId,
  );
  if (!baseUnit) return <div>error</div>;

  return (
    <>
      <div>
        {!!attachedTo && (
          <div className="flex-row">
            <div>Attached to {attachedTo.name}</div>
            <img
              src={attachedTo.imageUrl}
              alt={attachedTo.name}
              width={80}
              height={80}
            />
          </div>
        )}
        <img src={unitViewModel.imageUrl} alt={unitViewModel.name} />
      </div>
      <div className={styles.modelStack}>
        <div className="flex-row">
          <h2>{unitViewModel.name}</h2>
          <div className="power-badge">{unitViewModel.power}</div>
          <SimpleList items={unitViewModel.keywords} />
        </div>
        {unitViewModel.models.map((model) => (
          <ModelTable key={model.key} model={model} />
        ))}
      </div>
      <div className="flex-stack">
        {baseUnit.keywords.includes('Character') && (
          <label className="flex-row">
            Attach unit to
            <select
              value={attachedTo?.id}
              onChange={(evt) => {
                if (evt.currentTarget.value === 'none')
                  dispatch({
                    type: 'DetachUnitAction',
                    attachedUnitId: unitViewModel.id,
                  });
                else
                  dispatch({
                    type: 'AttachUnitAction',
                    hostUnitId: evt.currentTarget.value,
                    unitToAttachId: unitViewModel.id,
                  });
              }}
            >
              <option value="none">None</option>
              {unitViewModel.canAttachTo.map((option) => {
                return (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                );
              })}
            </select>
          </label>
        )}
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
            (modelSet) => modelSet.model._id === wargearOption.modelId,
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
                      {choice.wargearAdded.map((wg) => wg.name).join(', ')}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
      </div>
      {unitViewModel.attachedUnits.map((attachedUnit) => {
        return (
          <UnitRow
            key={attachedUnit.id}
            state={state}
            selectedUnitId={attachedUnit.id}
            unitViewModel={attachedUnit}
            dispatch={dispatch}
            attachedTo={unitViewModel}
          />
        );
      })}
    </>
  );
};
