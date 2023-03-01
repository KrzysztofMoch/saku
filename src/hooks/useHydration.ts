import { Mutate, StoreApi } from 'zustand';
import { useEffect, useState } from 'react';

type PersistedStore = Mutate<StoreApi<any>, [['zustand/persist', unknown]]>;

export const useHydration = (store: PersistedStore) => {
  const [hydrated, setHydrated] = useState(store.persist.hasHydrated);

  useEffect(() => {
    const unsubHydrate = store.persist.onHydrate(() => setHydrated(false));

    const unsubFinishHydration = store.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    setHydrated(store.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, [store.persist]);

  return hydrated;
};
