import { FunctionComponent } from 'react';
import { BuilderViewModel } from '@/reducer/builderViewModel';

interface ModelTableProps {
  model: BuilderViewModel['units'][0]['models'][0];
}

export const ModelTable: FunctionComponent<ModelTableProps> = ({ model }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td rowSpan={2}>
            <img src={model.imageUrl} alt={model.name} />
          </td>
          <th>Name</th>
          <th>M</th>
          <th>WS</th>
          <th>BS</th>
          <th>S</th>
          <th>T</th>
          <th>W</th>
          <th>A</th>
          <th>Ld</th>
          <th>Sv</th>
        </tr>
        <tr>
          <td>{model.name}</td>
          <td className="text-right">
            {model.movement}
            {'"'}
          </td>
          <td className="text-right">
            {model.weaponsSkill}
            {'+'}
          </td>
          <td className="text-right">
            {model.ballisticsSkill}
            {'+'}
          </td>
          <td className="text-right">{model.strength}</td>
          <td className="text-right">{model.toughness}</td>
          <td className="text-right">{model.wounds}</td>
          <td className="text-right">{model.attacks}</td>
          <td className="text-right">{model.leadership}</td>
          <td className="text-right">
            {model.save}
            {'+'}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
