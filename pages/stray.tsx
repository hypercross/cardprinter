import React = require('react');
import { suspend } from 'suspend-react';
import { loadCSV, loadNotionDB } from '../data';
import { createTTSLayout, el, Pages } from '../layout';
import './stray.less';

const Layout = createTTSLayout(7, 11, 88, 56);
export function StrayTTS() {
  const cards = suspend(loadStray, ['stray']);

  return <Pages layout={Layout} content={cards} group={77} item={StrayCard} />;
}

function StrayCard(props: { item: StrayCardData; side: string }) {
  console.log(props);
  return (
    <Frame className={props.item.variant}>
      <Layer className="name">
        <Text>{props.item.Name || `（${props.item.variant}）`}</Text>
      </Layer>
      <Layer className="var">
        <Text>{props.item.variant}</Text>
      </Layer>
      <Layer className="loc">
        <Illust src={props.item.images[props.item.Location]} />
      </Layer>
      <Layer className="act">
        <Text>{props.item.Action}</Text>
      </Layer>
    </Frame>
  );
}
const Frame = el('div', 'stray');
const Layer = el('div', 'layer');
const Text = el('p', 'text');
const Illust = el('img', 'illust');

interface StrayCardData {
  Name: string;
  variant: string;
  side: string;
  Count: string;
  Action: string;
  Location: string;
  images: { [key: string]: string };
}

async function loadStray() {
  const sheetData: StrayCardData[] = (
    await loadCSV(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3efOrCMC4iDKjkdi4HzsiqktSPcTR7ztbeeRxznaYL7fGfFNztqntW0esZP7-tMrij3PWDcOmSZqy/pub?gid=0&single=true&output=csv'
    )
  )
    .map((one) => {
      const items = [] as typeof one[];
      for (let i = parseInt(one.Count); i > 0; i--) {
        items.push(one);
      }
      return items;
    })
    .flat();

  const imageItems = await loadNotionDB<{ Name: string; Image: string }>(
    'https://nine-newsprint-c9d.notion.site/6bc0a78bcc39488c99cc94ee64fa8d19?v=9ccddb1cbfb047868c04f300306199fe'
  );

  const imageMap = {};
  imageItems.forEach((item) => {
    imageMap[item.Name] = item.Image;
  });

  sheetData.forEach((item) => {
    item.images = imageMap;
  });

  return sheetData;
}
