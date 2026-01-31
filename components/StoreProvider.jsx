"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export default function StoreProvider({ children }) {
  const storeRef = useRef();
  const persistorRef = useRef();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      {/* We use PersistGate to ensure hydration (even though we blacklisted auth, it helps other slices) */}
      <PersistGate loading={null} persistor={persistorRef.current}>
        {children}
      </PersistGate>
    </Provider>
  );
}