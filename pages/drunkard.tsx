import { suspend } from 'suspend-react';
import { loadCSV } from '../data/csv';

import React = require('react');
import { Pages, PnP8654 } from '../layout';

export function DrunkardPNP() {
  return (
    <Pages
      layout={PnP8654}
      group={5}
      content={useDrunkardCards()}
      item={DrunkardCard}
    />
  );
}

function DrunkardCard(props: { item: any; variant: string }) {
  if (props.variant === 'back') {
    return <CardBack {...props.item} />;
  } else if (props.variant === 'ttsback') {
    return <CardBack {...props.item} />;
  } else {
    return <CardFront {...props.item} />;
  }
}

function CardBack() {
  return (
    <div className="als-frame back">
      <AlcoholVal val={200} />
      <div
        className="layer logo"
        style={{ fontFamily: 'Xiquezhaopaiti', paddingLeft: '27mm' }}
      >
        干杯！
      </div>
    </div>
  );
}

function CardFront(props: any) {
  return (
    <div
      className={`als-frame front ${props.酒种}`}
      style={{ fontFamily: 'Xiquezhaopaiti' }}
    >
      <div className="layer titlefill"></div>
      <AlcoholVal val={props.酒量} />
      <div className="layer title">{props.名称}</div>
      <div className="layer rules">{JSON.parse('"' + props.效果 + '"')}</div>
      <div className="layer icons">
        {[...range(props.酒量 / 100)].map((i) => (
          <img key={i} src={props.图标} />
        ))}
      </div>
    </div>
  );
}

function AlcoholVal(props: { val: number }) {
  const { val } = props;
  if (!val) return null;

  const str = `${val}ml`;
  const first = str[0];
  const rest = str.slice(1);
  return (
    <div className="layer rank" style={{ top: '-2mm', fontSize: '15mm' }}>
      <span>{first}</span>
      <span style={{ fontSize: '0.3em', position: 'relative', top: '-1.4em' }}>
        {rest}
      </span>
    </div>
  );
}

function* range(n: number) {
  n = n || 0;
  for (let i = 0; i < n; i++) yield i;
}

function useDrunkardCards() {
  return suspend(
    async function () {
      return await loadCSV(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlWpHSGcaizsc7AuzoJJ0PeYtP6xrFz9cfP6kpm8vIsY01ZvRCZ94JPIjqwwLYxFkmjCxr63YK7JcW/pub?gid=1927493025&single=true&output=csv'
      );
    },
    ['drunkard']
  );
}
