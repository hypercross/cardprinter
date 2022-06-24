import * as React from 'react';
import { Link, Route, Switch } from 'wouter';
import { createTTSLayout, PnP8654 } from './layout';
import { BeastybarCabbages } from './pages/beastybar-cabbages';
import { GroupBuy } from './pages/groupbuy';
import { MindbugCatdogs } from './pages/mindbug-catdogs';
import { NoodleRealmCards, NoodleRealmPnP } from './pages/noddle-realms';

export default function App() {
  return (
    <React.Suspense fallback={<pre>loading...</pre>}>
      <Switch>
        <Route path="/mfgc/pnp">
          <MindbugCatdogs group={5} layout={PnP8654} />
        </Route>

        <Route path="/mfgc/tts">
          <MindbugCatdogs
            group={50}
            layout={createTTSLayout(10, 5, 56, 88)}
            withBacks
          />
        </Route>

        <Route path="/bbcb/pnp">
          <BeastybarCabbages group={5} layout={PnP8654} />
        </Route>

        <Route path="/bbcb/tts">
          <BeastybarCabbages
            group={56}
            layout={createTTSLayout(8, 7, 56, 88)}
            withBacks
          />
        </Route>

        <Route path="/gbuy/pnp">
          <GroupBuy group={5} layout={PnP8654} />
        </Route>

        <Route path="/ndrm/tts">
          <NoodleRealmCards />
        </Route>
        <Route path="/ndrm/pnp">
          <NoodleRealmPnP />
        </Route>

        <Route>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to="/mfgc/pnp">猫妃狗臣pnp</Link>
            <Link to="/mfgc/tts">猫妃狗臣tts</Link>
            <Link to="/bbcb/pnp">抢菜难pnp</Link>
            <Link to="/bbcb/tts">抢菜难tts</Link>
            <Link to="/gbuy/pnp">我的团长pnp</Link>
            <Link to="/ndrm/tts">小面国度tts</Link>
            <Link to="/ndrm/pnp">小面国度pnp</Link>
          </div>
        </Route>
      </Switch>
    </React.Suspense>
  );
}
