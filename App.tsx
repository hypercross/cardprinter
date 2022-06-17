import * as React from 'react';
import { Link, Route, Switch } from 'wouter';
import { createTTSLayout, PnP8654 } from './layout';
import { BeastybarCabbages } from './pages/beastybar-cabbages';
import { MindbugCatdogs } from './pages/mindbug-catdogs';

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
        <Route>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to="/mfgc/pnp">猫妃狗臣pnp</Link>
            <Link to="/mfgc/tts">猫妃狗臣tts</Link>
            <Link to="/bbcb/pnp">抢菜难pnp</Link>
          </div>
        </Route>
      </Switch>
    </React.Suspense>
  );
}
