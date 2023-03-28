import { FunctionComponent } from 'react';
import { BuilderViewModel } from '@/reducer/builderViewModel';
import { PortableText } from '@portabletext/react';
import { TypedObject } from '@portabletext/types';

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
        <tr>
          <th rowSpan={model.wargear.length + 1}>Wargear</th>
          <th>Name</th>
          <th>Range</th>
          <th>Type</th>
          <th>S</th>
          <th>AP</th>
          <th>D</th>
          <th colSpan={4}>Abilities</th>
        </tr>
        {model.wargear.map((wargear, index) => {
          const isWeapon = 'strength' in wargear;
          return (
            <tr key={wargear.key}>
              <td>{wargear.name}</td>
              {isWeapon && (
                <>
                  <td className="text-right">
                    {wargear.range}
                    {'"'}
                  </td>
                  <td className="text-center">{wargear.type}</td>
                  <td className="text-right">{wargear.strength}</td>
                  <td className="text-right">{wargear.armorPiercing}</td>
                  <td className="text-right">{wargear.damage}</td>
                </>
              )}
              {!isWeapon && <td colSpan={5}>-</td>}
              <td colSpan={4}>
                <PortableText
                  value={wargear.abilities as unknown as TypedObject[]}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
