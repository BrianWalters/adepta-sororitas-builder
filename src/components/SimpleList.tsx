import { FunctionComponent } from 'react';

interface SimpleListProps {
  items: string[];
}

export const SimpleList: FunctionComponent<SimpleListProps> = ({ items }) => {
  return (
    <span>
      {items.map((item, index) => (
        <span key={item}>
          {item}
          {index < items.length - 1 && ', '}
        </span>
      ))}
    </span>
  );
};
