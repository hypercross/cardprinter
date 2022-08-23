import React = require('react');
import { suspend } from 'suspend-react';
import { loadNotionDB } from '../data';
import { Pages, PnP8654 } from '../layout';
import './volleyball.less';

export function VolleyballPnp() {
  const cards = useVolleyballCards();

  return (
    <Pages layout={PnP8654} item={VolleyballCard} group={5} content={cards} />
  );
}

function VolleyballCard(props: { item: any }) {
  const { item } = props;
  if (item.variant?.startsWith('concept')) {
    return <ConceptCard {...item} />;
  }
  return null;
}

function ConceptCard(props: any) {
  console.log(props);
  return (
    <Frame
      className={`concept ${props.variant?.indexOf('back') >= 0 ? 'back' : ''}`}
    >
      <img src={props.image} />
    </Frame>
  );
}

function Frame(props: { className?: string; children?: any }) {
  return (
    <div className={`volleyball-card ${props.className || ''}`}>
      {props.children}
    </div>
  );
}

function useVolleyballCards() {
  return suspend(loadVolleyballCards, []);
}

async function loadVolleyballCards() {
  const imgs = await loadNotionDB(
    'https://nine-newsprint-c9d.notion.site/5a92364d146242f98e34df408a3dc513?v=752f634cb5da4c26acd3b3623b0bd347'
  );
  const data = imgs.filter((img) => img.variant);
  return data;
}
