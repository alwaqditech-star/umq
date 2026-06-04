"use client";

import { useCallback, useEffect, useState } from "react";

/** Load admin list data with instant skeleton-friendly loading state. */
export function useAdminList<T>(loader: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loader();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, setItems, loading, reload };
}
