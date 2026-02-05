import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';

// 1. Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer, 
  // Add other reducers here in the future (e.g., cart: cartReducer)
});

const persistConfig = {
  key: 'root_v2', // ⚡ CHANGE THIS (e.g. from 'root' to 'root_v1' or 'root_v2')
  version: 1,     // Best practice to version your state
  storage,
  blacklist: ['auth'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Export the Store Creator
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Required for redux-persist to avoid warnings
      }),
  });
};

// 4. Export singleton for Axios & Provider to use
export const store = makeStore(); 
export const persistor = persistStore(store);