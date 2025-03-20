import { useCallback, useMemo, useState } from 'react';

type InitialState = boolean | (() => boolean);
type BooleanActions = {
  readonly on: () => void;
  readonly off: () => void;
  readonly toggle: () => void;
};

/**
 * 用于管理 boolean 状态的自定义 Hook
 * @param initialState 初始状态值，可以是 boolean 或返回 boolean 的函数（默认 false）
 * @returns 返回元组 [当前状态值, 操作对象]
 *
 * @example
 * const [isOpen, { on, off, toggle }] = useBoolean(false);
 *
 * 操作对象包含：
 * - on: 将状态设为 true
 * - off: 将状态设为 false
 * - toggle: 切换当前状态
 */
export const useBoolean = (initialState: InitialState = false): readonly [boolean, BooleanActions] => {
  const [value, setValue] = useState(initialState);

  const on = useCallback(() => setValue(true), []);
  const off = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((prev) => !prev), []);

  const actions = useMemo(
    () => ({
      on,
      off,
      toggle,
    }),
    [on, off, toggle],
  );

  return [value, actions] as const;
};
