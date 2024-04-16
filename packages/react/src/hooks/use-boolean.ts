import { useCallback, useState } from 'react';

type InitialState = boolean | (() => boolean);

/**
 * 控制 boolean state
 * @param initialState state 初始值
 * @returns
 */
export const useBoolean = (initialState: InitialState = false) => {
  const [value, setValue] = useState(initialState);

  const on = useCallback(() => {
    setValue(true);
  }, []);

  const off = useCallback(() => {
    setValue(false);
  }, []);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, { on, off, toggle }] as const;
};
