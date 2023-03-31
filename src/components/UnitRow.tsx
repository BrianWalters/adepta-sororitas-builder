import styles from '@/styles/Builder.module.css';
import { SimpleList } from '@/components/SimpleList';
import { ModelTable } from '@/components/ModelTable';
import { Dispatch, FunctionComponent } from 'react';
import { UnitDetail } from '@/domain/UnitDetail';
import { UnitViewModel } from '@/reducer/BuilderViewModel';
import { SelectedUnitState } from '@/reducer/state/BuilderState';
import { BuilderAction } from '@/reducer/builderReducer';

interface UnitRowProps {
  baseUnit: UnitDetail;
  selectedUnit: SelectedUnitState;
  unitViewModel: UnitViewModel;
  dispatch: Dispatch<BuilderAction>;
}

export const UnitRow: FunctionComponent<UnitRowProps> = ({
  baseUnit,
  selectedUnit,
  unitViewModel,
  dispatch,
}) => {
  return (
    <div className={styles.unitRow}>
      <img src={unitViewModel.imageUrl} alt={unitViewModel.name} />
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
    </div>
  );
};
