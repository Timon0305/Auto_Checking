/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import AuthPage from './containers/AuthPage';
import TaskPage from './containers/TaskPage';
import AccountPage from './containers/AccountPage';
import SettingPage from './containers/SettingPage';
import EntryPage from './components/Entry';
import ProfilePage from './containers/ProfilePage';
import ProxyPage from './containers/ProxyPage';

// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.AUTH} component={AuthPage} />
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.TASK} component={TaskPage} />
        <Route path={routes.ACCOUNT} component={AccountPage} />
        <Route path={routes.SETTING} component={SettingPage} />
        <Route path={routes.ENTRY} component={EntryPage} />
        <Route path={routes.PROFILE} component={ProfilePage} />
        <Route path={routes.PROXY} component={ProxyPage} />
        <Route path={routes.HOME} component={TaskPage} />
      </Switch>
    </App>
  );
}
