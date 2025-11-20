import { renderHook, act } from '@testing-library/react';
import { useBoolean } from '../use-boolean';

describe('useBoolean', () => {
  it('应该返回初始状态 false 作为默认值', () => {
    const { result } = renderHook(() => useBoolean());

    expect(result.current[0]).toBe(false);
    expect(typeof result.current[1].on).toBe('function');
    expect(typeof result.current[1].off).toBe('function');
    expect(typeof result.current[1].toggle).toBe('function');
  });

  it('应该接受布尔值作为初始状态', () => {
    const { result: resultTrue } = renderHook(() => useBoolean(true));
    const { result: resultFalse } = renderHook(() => useBoolean(false));

    expect(resultTrue.current[0]).toBe(true);
    expect(resultFalse.current[0]).toBe(false);
  });

  it('应该接受函数作为初始状态', () => {
    const { result } = renderHook(() => useBoolean(() => true));

    expect(result.current[0]).toBe(true);
  });

  it('on 方法应该将状态设为 true', () => {
    const { result } = renderHook(() => useBoolean(false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1].on();
    });

    expect(result.current[0]).toBe(true);
  });

  it('off 方法应该将状态设为 false', () => {
    const { result } = renderHook(() => useBoolean(true));

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].off();
    });

    expect(result.current[0]).toBe(false);
  });

  it('toggle 方法应该切换状态', () => {
    const { result } = renderHook(() => useBoolean(false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(false);
  });

  it('操作对象应该在重新渲染时保持稳定', () => {
    const { result, rerender } = renderHook(() => useBoolean(false));

    const firstActions = result.current[1];

    rerender();

    const secondActions = result.current[1];

    expect(firstActions).toBe(secondActions);
    expect(firstActions.on).toBe(secondActions.on);
    expect(firstActions.off).toBe(secondActions.off);
    expect(firstActions.toggle).toBe(secondActions.toggle);
  });

  it('应该支持连续调用不同的操作', () => {
    const { result } = renderHook(() => useBoolean(false));

    act(() => {
      result.current[1].on();
      result.current[1].toggle();
      result.current[1].off();
      result.current[1].on();
    });

    expect(result.current[0]).toBe(true);
  });

  it('应该支持多次调用同一操作', () => {
    const { result } = renderHook(() => useBoolean(false));

    act(() => {
      result.current[1].on();
      result.current[1].on();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].off();
      result.current[1].off();
    });

    expect(result.current[0]).toBe(false);
  });

  it('应该能处理复杂的状态变化场景', () => {
    const { result } = renderHook(() => useBoolean(() => Math.random() > 0.5));

    const initialState = result.current[0];

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(!initialState);

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(initialState);
  });
});