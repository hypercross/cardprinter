import React = require('react');
import { suspend } from 'suspend-react';
import { loadNotionDB } from '../data';
import './noodle-realms.less';
import { createTTSLayout, Pages, PnP8654 } from '../layout';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

export function NoodleRealmCards() {
  return (
    <Pages
      layout={createTTSLayout(8, 7, 56, 88)}
      item={NoodleRealmCard}
      content={useNoodleRealmCards()}
      group={56}
    />
  );
}

export function NoodleRealmPnP() {
  return (
    <Pages
      layout={PnP8654}
      group={5}
      content={useNoodleRealmCards()}
      item={NoodleRealmCard}
    />
  );
}

function useNoodleRealmCards() {
  return suspend(
    async function () {
      let data: any[] = await loadNotionDB(
        'https://www.notion.so/925100d0fbd344a7bedfde10b26df87a'
      );
      return data;
    },
    ['noodlerealm']
  );
}

function NoodleRealmCard(props: { item: any; variant: string }) {
  if (props.variant === 'back') {
    return <CardBack {...props} />;
  } else {
    return <CardFront {...props} />;
  }
}
function CardFront(props: { item: any }) {
  let template = '';
  if (props.item.类型 === '面条') {
    template = '你的$1牌，每张点数+$2。只有一张面条有效。';
  } else if (props.item.类型 === '调味') {
    template = '你的$1牌，每张点数+$2。';
  } else {
    template = '如果你有其他$1牌，则点数+$2。';
  }
  const explain = template
    .replace('$1', '**' + props.item.加成条件.join(', ') + '**')
    .replace('$2', props.item.加分);
  return (
    <div
      className={`noodle-realm-frame ${props.item.类型} ${props.item.子类型}`}
    >
      <div className="name">{props.item.名称}</div>
      <div className="type">{props.item.类型}</div>
      <div className="subtype">{props.item.子类型}</div>
      <div className="score">{props.item.基本分}</div>
      <div className="explain">
        <ReactMarkdown>{explain}</ReactMarkdown>
      </div>
    </div>
  );
}
function CardBack(props: { item: any }) {
  return (
    <div className="noodle-realm-frame back">
      <div className="backname">小面国度</div>
    </div>
  );
}
