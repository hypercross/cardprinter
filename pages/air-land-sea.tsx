import React = require('react');
import { suspend } from 'suspend-react';
import { loadCSV } from '../data/csv';
import { createTTSLayout, Pages, PnP8654 } from '../layout';
import './air-land-sea.less';

export function ALSPnP() {
  return (
    <Pages layout={PnP8654} group={5} content={useALSData()} item={ALSCard} />
  );
}

export function ALSTTS() {
  return (
    <Pages
      layout={createTTSLayout(7, 3, 54, 86)}
      group={21}
      content={useALSData(true)}
      item={ALSCard}
    />
  );
}

function useALSData(back?: boolean) {
  return suspend(
    async function () {
      let data = await loadCSV(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlWpHSGcaizsc7AuzoJJ0PeYtP6xrFz9cfP6kpm8vIsY01ZvRCZ94JPIjqwwLYxFkmjCxr63YK7JcW/pub?gid=0&single=true&output=csv'
      );

      if (back) {
        data.push({ variant: 'ttsback' });
      }

      return data;
    },
    ['als', back]
  );
}

function ALSCard(props: { item: any; variant: string }) {
  if (props.variant === 'back') {
    return <CardBack {...props.item} />;
  } else if (props.variant === 'ttsback') {
    return <CardBack {...props.item} straight />;
  } else {
    return <CardFront {...props.item} />;
  }
}

function CardBack(props: { straight?: boolean }) {
  return (
    <div className={`als-frame back ${props.straight ? 'straight' : ''}`}>
      <div className="layer rank">2</div>
      <div className="layer logo">海陆空</div>
    </div>
  );
}

function CardFront(props: any) {
  return (
    <div className={`als-frame front ${props.战区}`}>
      <div className="layer titlefill"></div>
      <div className="layer rank">{props.战斗力}</div>
      <div className="layer title">{props.名称}</div>
      <div className="layer rules">{JSON.parse('"' + props.效果 + '"')}</div>
      <div className="layer icons">
        {[...range(props.战斗力)].map((i) => (
          <img key={i} src={props.图标} />
        ))}
      </div>
    </div>
  );
}

function* range(n: number) {
  n = n || 0;
  for (let i = 0; i < n; i++) yield i;
}
