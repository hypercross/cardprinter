import * as React from 'react';
import { Link, Route, Switch } from 'wouter';
import { MindbugCatdogs } from './pages/mindbug-catdogs';

export default function App() {
  return (
    <React.Suspense fallback={<pre>loading...</pre>}>
      <Switch>
        <Route path="/mfgc" component={MindbugCatdogs} />
        <Route>
          <Link to="/mfgc">猫妃狗臣</Link>
        </Route>
      </Switch>
    </React.Suspense>
  );
}
