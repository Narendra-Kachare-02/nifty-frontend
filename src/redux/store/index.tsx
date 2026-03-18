import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistReducer } from 'redux-persist';
import { rootReducer, rootSaga } from '../reducer';
import localstorage from 'redux-persist/lib/storage';
import { useDispatch, useSelector } from 'react-redux';

const isDevToolsEnabled = import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS === 'true';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
  key: 'root',
  storage: localstorage,
  // whitelist: [],
  // blacklist: ['appLoader'],

};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      thunk: false, // Disable thunk as we're using saga
    }).concat(sagaMiddleware),
  devTools: isDevToolsEnabled,
});

// Run saga middleware
sagaMiddleware.run(rootSaga);

// Create persistor
export const persistor = persistStore(store);

// Infer types from store
export type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

// Typed versions of useDispatch and useSelector for TypeScript
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()