import { useCallback, useEffect, useRef, useState } from "react";

/** Small fetch hook with stale-response protection for route level data. */
export function useAsyncData<T>(loader: () => Promise<T>, onError?: (error: unknown) => void) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const reload = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    try {
      const result = await loader();
      if (currentRequest === requestId.current) setData(result);
    } catch (error) {
      if (currentRequest === requestId.current) onErrorRef.current?.(error);
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    void reload();
    return () => {
      requestId.current += 1;
    };
  }, [reload]);

  return { data, loading, reload };
}
