import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import type { Asset } from '../types/asset';

import {
  deleteAsset as deleteDb,
  getAllAssets,
  initializeDatabase,
  insertAsset
} from '../database/database';

type Value = {
  assets: Asset[];
  loading: boolean;
  refresh: () => Promise<void>;
  addAsset: (asset: Asset) => Promise<void>;
  removeAsset: (id: string) => Promise<void>;
};

const Context = createContext<Value | null>(null);

export function AssetProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setAssets(await getAllAssets());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await initializeDatabase();
        await refresh();
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh]);

  const addAsset = useCallback(
    async (asset: Asset) => {
      await insertAsset(asset);
      await refresh();
    },
    [refresh]
  );

  const removeAsset = useCallback(
    async (id: string) => {
      await deleteDb(id);
      await refresh();
    },
    [refresh]
  );

  const value = useMemo(
    () => ({
      assets,
      loading,
      refresh,
      addAsset,
      removeAsset
    }),
    [assets, loading, refresh, addAsset, removeAsset]
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

export function useAssets() {
  const value = useContext(Context);

  if (!value) {
    throw new Error(
      'useAssets harus berada di dalam AssetProvider'
    );
  }

  return value;
}