import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const result = matchMedia(query);
      result.addEventListener("change", callback);
      return () => {
        result.removeEventListener("change", callback);
      };
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    return matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
