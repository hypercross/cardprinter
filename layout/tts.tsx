import React = require('react');
import { groupBy } from '../data/group';
import { ItemRenderer } from './pager';

export function createTTSLayout(
  cols: number,
  rows: number,
  width: number,
  height: number
) {
  return function ttsLayout<T>(props: { content: T[]; item: ItemRenderer<T> }) {
    const Item = props.item;
    return (
      <React.Fragment>
        {/* <button onClick={download}>下载svg</button>
        <br /> */}
        <svg width={width * cols + 'mm'} height={height * rows + 'mm'}>
          {groupBy(props.content, cols).map((row, y) => {
            return row.map((item, x) => {
              return (
                <foreignObject
                  key={`${x}-${y}`}
                  width={width + 'mm'}
                  height={height + 'mm'}
                  x={x * width + 'mm'}
                  y={y * height + 'mm'}
                >
                  <Item item={item} />
                </foreignObject>
              );
            });
          })}
        </svg>
      </React.Fragment>
    );
  };
}
