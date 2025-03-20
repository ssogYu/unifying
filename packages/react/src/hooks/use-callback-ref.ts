import { useCallback, useRef } from 'react';
import { useSafeLayoutEffect } from './use-safe-layout-effect';

/**
 * react hook 保证每次回调函数fn都是最新的
 * @param fn
 * @returns
 */
export const useCallbackRef = <T extends (...args: never[]) => unknown>(fn: T | undefined): T => {
  const ref = useRef(fn);

  useSafeLayoutEffect(() => {
    ref.current = fn;
  });

  return useCallback(((...args: Parameters<T>) => ref.current?.(...args)) as T, []);
};
