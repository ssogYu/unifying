import { DependencyList, useEffect } from 'react';

/**
 * 支持异步函数的 useEffect，增加错误处理和取消机制
 * @param fn 异步函数（可接收 AbortSignal）
 * @param deps 依赖项数组
 * @param onError 错误处理回调（可选）
 * @param abortController 取消控制器（可选，默认新建）
 * 基础用法：获取用户数据
 * useEffectCustomAsync(
  async (signal) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`, { signal });
      const data = await response.json();
      setUserData(data);
    } finally {
      setLoading(false);
    }
  },
  [userId], // 依赖项变化时重新执行
  (error) => {
    if (error.name !== 'AbortError') {
      console.error('用户数据加载失败:', error);
      alert('加载用户数据失败');
    }
  },
);
 */

export const useEffectCustomAsync = (
  fn: (signal?: AbortSignal) => Promise<void>,
  deps: DependencyList,
  onError?: (error: unknown) => void,
  abortController = new AbortController(),
) => {
  useEffect(() => {
    (async () => {
      try {
        await fn(abortController.signal);
      } catch (error) {
        onError?.(error);
      }
    })();

    // 清理函数：取消未完成的异步操作
    return () => {
      abortController.abort();
    };
  }, [...deps, onError]); // 将 onError 加入依赖数组确保最新引用
};

// 默认错误处理函数
useEffectCustomAsync.defaultErrorHandler = (error: unknown) => {
  console.error('Unhandled error in useEffectCustomAsync:', error);
};
