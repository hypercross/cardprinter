import React = require('react');
import { suspend } from 'suspend-react';
import { loadCSV, loadNotionDB } from '../data';
import { createTTSLayout, el, Pages } from '../layout';
import './stray.less';

const Layout = createTTSLayout(15, 6, 56, 88);
export function StrayTTS() {
  const cards = suspend(loadStray, ['stray']);
  const withBack = React.useMemo(() => {
    return [{ ...cards[0], side: 'back' }, ...cards];
  }, [cards]);

  return (
    <Pages layout={Layout} content={withBack} group={90} item={StrayCard} />
  );
}

function StrayCard(props: { item: StrayCardData }) {
  const { item } = props;
  const {
    Name,
    variant,
    side,
    images,
    Location,
    Action,
    Hearts,
    Scores,
    Food,
    Rules,
  } = item;
  return (
    <Frame className={`${variant} ${side || 'front'}`}>
      <Layer className="name front-only">
        <Text>{Name || `（${variant}）`}</Text>
      </Layer>
      <Layer className="var front-only">
        <Text>{variant}</Text>
      </Layer>
      <Layer className="loc front-only">
        <Illust src={images[Location]} />
      </Layer>
      <Layer className="act front-only 遭遇-only">
        <Illust src={images[Action]} />
      </Layer>
      <Layer className="rules front-only 遭遇-only">
        <Text>{rules}</Text>
      </Layer>
      <Layer className="back back-only">
        <Illust src={images.卡背概念} />
      </Layer>
      <Layer className="stats front-only 居民-only">
        <div>
          <Clone num={Hearts}>💕</Clone>
        </div>
        <div>
          <Clone num={Scores}>⭐️</Clone>
        </div>
        <div>
          <Clone num={Food}>🐟</Clone>
        </div>
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
  Hearts: string;
  Scores: string;
  Food: string;
  Rules: string;
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

  const imageItems = await loadNotionDB<{
    Name: string;
    Image: string | null;
    Candidate1: string;
  }>(
    'https://nine-newsprint-c9d.notion.site/6bc0a78bcc39488c99cc94ee64fa8d19?v=9ccddb1cbfb047868c04f300306199fe'
  );

  const imageMap = {};
  imageItems.forEach((item) => {
    imageMap[item.Name] = item.Image || item.Candidate1;
  });

  sheetData.forEach((item) => {
    item.images = imageMap;
  });

  return sheetData;
}

function Clone(props: { children: React.ReactNode; num: string }) {
  const { children, num } = props;
  const count = parseInt(num) || 0;
  const elems = [] as React.ReactNode[];
  for (let i = 0; i < count; i++) {
    elems.push(<React.Fragment key={i}>{children}</React.Fragment>);
  }
  return <React.Fragment children={elems} />;
}
