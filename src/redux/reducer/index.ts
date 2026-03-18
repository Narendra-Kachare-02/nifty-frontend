import { combineReducers } from '@reduxjs/toolkit';
import { all } from 'redux-saga/effects';

import authReducer, { watchAuthSaga } from './auth';
import niftyReducer, { watchNiftySaga } from './nifty';
import optionChainReducer, { watchOptionChainSaga } from './optionChain';


const rootReducer = combineReducers({
  auth: authReducer,
  nifty: niftyReducer,
  optionChain: optionChainReducer,

});

function* rootSaga() {
  yield all([watchAuthSaga(), watchNiftySaga(), watchOptionChainSaga()]);
}

export { rootReducer, rootSaga };
