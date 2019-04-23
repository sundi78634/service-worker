import * as HealthServices from '../services/health';

export default {
  
  namespace: 'health',
  
  state: {
    weather: {},
  },
  
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/health') {
          dispatch({
            type: 'getWeather',
            payload: {
            
            }
          });
        }
      });
    },
  },
  
  effects: {
    * getWeather({ payload }, { call, put, select }) {
      const data = yield call(HealthServices.getWeather, payload);
      console.log(data);
      if (data && data.code === 200) {
        yield put({
          type: 'updateState',
          payload: {
            weather: data
          }
        })
      } else {
      
      }
    },
  },
  
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
  },
  
};
