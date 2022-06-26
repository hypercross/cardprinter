import React = require('react');
import { suspend } from 'suspend-react';
import { loadCSV, loadNotionDB } from '../data';
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
  // return suspend(
  //   async function () {
  //     let data: any[] = await loadNotionDB(
  //       'https://www.notion.so/925100d0fbd344a7bedfde10b26df87a'
  //     );
  //     return data;
  //   },
  //   ['noodlerealm']
  // );
  return suspend(
    async function () {
      let data: any[] = await loadCSV(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuzbtPBap-36-EE9lHVTiX00CdPRR8sw8KIRIM-NSRO_b-ILcTePEAUlQbevbDENjc-0GWqn-Gv84q/pub?gid=1441192833&single=true&output=csv'
      );
      data.forEach((item) => {
        item.类型 = item.主类型;
        item.子类型 = item.副类型;
        item.加分 = item.加成分;
        item.加成条件 = [item.加成, item.加成2, item.加成3]
          .map((one) => one.trim())
          .filter((one) => !!one);
      });
      return data;
    },
    ['noodlerealms']
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
      <div className="backname">下面给你吃🍜</div>
    </div>
  );
}
