import React = require('react');
import { groupBy } from '../data';

export const itemCtx = React.createContext([{}, ''] as [any, string]);

type CardProps = { variant?: string; side?: 'front' | 'back' };
export interface LayoutRenderer<T extends CardProps> {
  (props: { item: ItemRenderer<T>; content: T[] }): JSX.Element;
}

export interface ItemRenderer<T extends CardProps> {
  (props: { item: T }): JSX.Element;
}

export function Pages<T>(props: {
  layout: LayoutRenderer<T>;
  item: ItemRenderer<T>;
  content: T[];
  group: number;
}) {
  const { layout: Layout, item: Item, content, group } = props;

  const groups = groupBy(content, group);
  return (
    <React.Fragment>
      {groups.map((g, i) => (
        <Layout content={g} key={i} item={Item} />
      ))}
    </React.Fragment>
  );
}
