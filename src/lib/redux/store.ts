import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 
// combined writing on RTK and Redux persist
// get rid of createStore and also drop seralizableCheck to supress serialization error
// any webrequest please consider use fetch in SSR but not in Redux Thunk of RTK

const persistConfig = {
  key: 'root',
  storage,
}
const reducers = {
  counter:counterReducer
}
const rootReducer = combineReducers(reducers)
 
export const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer:persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {
      serializableCheck: false
    }
  ),
})
export const persistor = persistStore(store)

export const makeStore = () => {
  return store
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']