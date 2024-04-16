import { DependencyList, useEffect } from 'react';
/**
 * 可以使用async异步函数的useEffect
 * @param fn 异步函数
 * @param deps 依赖
 */
export const useEffectCustomAsync = (fn: () => Promise<void>, deps: DependencyList) => {
  useEffect(() => {
    async function asyncFunction() {
      await fn();
    }
    void asyncFunction();
  }, deps);
};
