'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore, persistor } from '../lib/redux/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
    // if need to initialize some state, this will be the place to add
  }

  return <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
}