import { combineReducers } from '@reduxjs/toolkit';
import { all } from 'redux-saga/effects';

import authReducer, { watchAuthSaga } from './auth';
import niftyReducer, { watchNiftySaga } from './nifty';
import optionChainReducer, { watchOptionChainSaga } from './optionChain';
import niftySeriesReducer, { watchNiftySeriesSaga } from './niftySeries';


const rootReducer = combineReducers({
  auth: authReducer,
  nifty: niftyReducer,
  optionChain: optionChainReducer,
  niftySeries: niftySeriesReducer,

});

function* rootSaga() {
  yield all([watchAuthSaga(), watchNiftySaga(), watchOptionChainSaga(), watchNiftySeriesSaga()]);
}

export { rootReducer, rootSaga };
