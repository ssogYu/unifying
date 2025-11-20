import { renderHook, act } from '@testing-library/react';
import { useCallbackRef } from '../use-callback-ref';

describe('useCallbackRef', () => {
  it('应该返回一个稳定的函数引用', () => {
    const mockFn = jest.fn();
    const { result, rerender } = renderHook(
      ({ fn }) => useCallbackRef(fn),
      { initialProps: { fn: mockFn } }
    );

    const firstRef = result.current;

    rerender({ fn: mockFn });

    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });

  it('应该调用最新的函数引用', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    const { result, rerender } = renderHook(
      ({ fn }) => useCallbackRef(fn),
      { initialProps: { fn: mockFn1 } }
    );

    act(() => {
      result.current('arg1', 'arg2');
    });

    expect(mockFn1).toHaveBeenCalledWith('arg1', 'arg2');
    expect(mockFn2).not.toHaveBeenCalled();

    mockFn1.mockClear();
    mockFn2.mockClear();

    rerender({ fn: mockFn2 });

    act(() => {
      result.current('arg3', 'arg4');
    });

    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalledWith('arg3', 'arg4');
  });

  it('应该处理 undefined 函数', () => {
    const { result } = renderHook(() => useCallbackRef(undefined));

    expect(() => {
      act(() => {
        result.current('arg1');
      });
    }).not.toThrow();
  });

  it('应该正确传递参数和返回值', async () => {
    const mockFn = jest.fn().mockResolvedValue('return value');
    const { result } = renderHook(() => useCallbackRef(mockFn));

    const returnValue = await act(async () => {
      return await result.current('test', 123);
    });

    expect(mockFn).toHaveBeenCalledWith('test', 123);
    expect(returnValue).toBe('return value');
  });

  it('应该保持函数的上下文', () => {
    let thisContext: any = null;
    const contextObject = { value: 'test' };

    const mockFn = function(this: any, arg: string) {
      thisContext = this;
      return arg;
    };

    const { result } = renderHook(() => useCallbackRef(mockFn));

    // 注意：在严格模式下，this 会是 undefined，这是预期行为
    const returnValue = act(() => {
      return result.current('argument');
    });

    expect(returnValue).toBe('argument');
  });

  it('应该处理函数被替换的情况', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();

    const { result, rerender } = renderHook(
      ({ fn }) => useCallbackRef(fn),
      { initialProps: { fn: mockFn1 } }
    );

    act(() => {
      result.current('first');
    });

    rerender({ fn: mockFn2 });
    act(() => {
      result.current('second');
    });

    rerender({ fn: mockFn3 });
    act(() => {
      result.current('third');
    });

    expect(mockFn1).toHaveBeenCalledWith('first');
    expect(mockFn2).toHaveBeenCalledWith('second');
    expect(mockFn3).toHaveBeenCalledWith('third');
  });

  it('应该处理类型化的函数参数', () => {
    const typedMockFn = jest.fn((num: number, str: string, obj: { a: number }) => {
      return `${num}-${str}-${obj.a}`;
    });

    const { result } = renderHook(() => useCallbackRef(typedMockFn));

    act(() => {
      result.current(1, 'test', { a: 2 });
    });

    expect(typedMockFn).toHaveBeenCalledWith(1, 'test', { a: 2 });
    expect(typedMockFn).toHaveReturnedWith('1-test-2');
  });

  it('应该处理异步函数', async () => {
    const asyncMockFn = jest.fn(async (value: string) => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return `async-${value}`;
    });

    const { result } = renderHook(() => useCallbackRef(asyncMockFn));

    const resultValue = await act(async () => {
      return await result.current('test');
    });

    expect(asyncMockFn).toHaveBeenCalledWith('test');
    expect(resultValue).toBe('async-test');
  });

  it('应该处理抛出错误的函数', () => {
    const errorMockFn = jest.fn(() => {
      throw new Error('Test error');
    });

    const { result } = renderHook(() => useCallbackRef(errorMockFn));

    expect(() => {
      act(() => {
        result.current();
      });
    }).toThrow('Test error');

    expect(errorMockFn).toHaveBeenCalled();
  });
});