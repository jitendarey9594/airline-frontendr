import { useEffect } from 'react';

export const useFetch = (callback: () => void, deps: any[] = []) => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
