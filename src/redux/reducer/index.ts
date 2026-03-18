import { combineReducers } from '@reduxjs/toolkit';
import { all } from 'redux-saga/effects';

import authReducer, { watchAuthSaga } from './auth';
import niftyReducer, { watchNiftySaga } from './nifty';


const rootReducer = combineReducers({
  auth: authReducer,
  nifty: niftyReducer,

});

function* rootSaga() {
  yield all([watchAuthSaga(), watchNiftySaga()]);
}

export { rootReducer, rootSaga };
