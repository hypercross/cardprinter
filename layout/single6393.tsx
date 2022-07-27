import React = require('react');
import { ItemRenderer } from './pager';
import './single6393.less';

export function Single6393<T>(props: { content: T[]; item: ItemRenderer<T> }) {
  const { content, item: Item } = props;
  return (
    <div className="single single-6393">
      <Item item={content[0]} variant={(content[0] as any).variant} />
    </div>
  );
}
