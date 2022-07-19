import * as React from 'react';
import { Link, Route, Switch } from 'wouter';
import { createTTSLayout, PnP8654 } from './layout';
import { ALSPnP } from './pages/air-land-sea';
import { BeastybarCabbages } from './pages/beastybar-cabbages';
import { DrunkardPNP } from './pages/drunkard';
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

        <Route path="/als/pnp">
          <ALSPnP />
        </Route>
        <Route path="/drunkard/pnp">
          <DrunkardPNP />
        </Route>

        <Route>
          <link
            rel="stylesheet"
            href="https://unpkg.com/bulmaswatch@0.8.1/lumen/bulmaswatch.min.css"
          />
          <div className="section">
            <div className="container content">
              <div className="menu">
                <ul className="menu-list">
                  <li>
                    <Link to="/mfgc/pnp">猫妃狗臣pnp</Link>
                  </li>
                  <li>
                    <Link to="/mfgc/tts">猫妃狗臣tts</Link>
                  </li>
                  <li>
                    <Link to="/bbcb/pnp">抢菜难pnp</Link>
                  </li>
                  <li>
                    <Link to="/bbcb/tts">抢菜难tts</Link>
                  </li>
                  <li>
                    <Link to="/gbuy/pnp">我的团长pnp</Link>
                  </li>
                  <li>
                    <Link to="/ndrm/tts">煮面给你吃tts</Link>
                  </li>
                  <li>
                    <Link to="/ndrm/pnp">煮面给你吃pnp</Link>
                  </li>
                  <li>
                    <Link to="/als/pnp">海陆空pnp</Link>
                  </li>
                  <li>
                    <Link to="/drunkard/pnp">喝酒海陆空pnp</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Route>
      </Switch>
    </React.Suspense>
  );
}
