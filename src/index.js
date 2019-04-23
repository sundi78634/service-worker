import dva from 'dva';
// import { browserHistory } from 'dva/router';
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import './index.css';

// 1. Initialize
const app = dva({
  history: createHistory({
    basename: '/service-worker'
  })
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/health').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
