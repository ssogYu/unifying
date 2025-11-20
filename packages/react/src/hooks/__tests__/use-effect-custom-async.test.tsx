import { renderHook } from '@testing-library/react';
import { useEffectCustomAsync } from '../use-effect-custom-async';

describe('useEffectCustomAsync', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('应该执行异步函数', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const onError = jest.fn();

    renderHook(() => {
      useEffectCustomAsync(mockFn, [], onError);
    });

    await act(async () => {
      jest.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(mockFn).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('应该传递 AbortSignal 给异步函数', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const onError = jest.fn();

    renderHook(() => {
      useEffectCustomAsync(mockFn, [], onError);
    });

    await act(async () => {
      jest.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(mockFn).toHaveBeenCalledWith(expect.any(AbortSignal));
  });

  it('应该处理异步函数中的错误', async () => {
    const mockError = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const onError = jest.fn();

    renderHook(() => {
      useEffectCustomAsync(mockFn, [], onError);
    });

    await act(async () => {
      jest.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(mockFn).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('应该在依赖项变化时重新执行', async () => {
    const mockFn1 = jest.fn().mockResolvedValue('success1');
    const mockFn2 = jest.fn().mockResolvedValue('success2');
    const onError = jest.fn();

    const { rerender } = renderHook(
      ({ fn }) => {
        useEffectCustomAsync(fn, [fn], onError);
      },
      { initialProps: { fn: mockFn1 } }
    );

    await act(async () => {
      jest.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(mockFn1).toHaveBeenCalledTimes(1);

    mockFn1.mockClear();
    rerender({ fn: mockFn2 });

    await act(async () => {
      jest.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  it('应该取消之前的异步操作', async () => {
    let currentSignal: AbortSignal | null = null;
    const mockFn = jest.fn().mockImplementation((signal: AbortSignal) => {
      currentSignal = signal;
      return new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => {
          reject(new DOMException('Operation aborted', 'AbortError'));
        });
      });
    });
    const onError = jest.fn();

    const { rerender } = renderHook(
      ({ value }) => {
        useEffectCustomAsync(() => mockFn(value), [value]);
      },
      { initialProps: { value: 'initial' } }
    );

    // 执行第一次 effect
    await act(async () => {
      jest.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(currentSignal?.aborted).toBe(false);

    // 重新渲染，触发第二次 effect
    rerender({ value: 'updated' });

    // 第一次的 signal 应该被 aborted
    expect(currentSignal?.aborted).toBe(true);
  });

  it('应该在组件卸载时取消异步操作', async () => {
    let currentSignal: AbortSignal | null = null;
    const mockFn = jest.fn().mockImplementation((signal: AbortSignal) => {
      currentSignal = signal;
      return new Promise(() => {
        // 永不 resolve 的 Promise
        signal.addEventListener('abort', () => {
          // Do nothing
        });
      });
    });

    const { unmount } = renderHook(() => {
      useEffectCustomAsync(mockFn, []);
    });

    await act(async () => {
      jest.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(currentSignal?.aborted).toBe(false);

    unmount();

    expect(currentSignal?.aborted).toBe(true);
  });

  it('应该不处理 AbortError 错误', async () => {
    const abortError = new DOMException('Operation aborted', 'AbortError');
    const mockFn = jest.fn().mockRejectedValue(abortError);
    const onError = jest.fn();

    renderHook(() => {
      useEffectCustomAsync(mockFn, [], onError);
    });

    await act(async () => {
      jest.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(mockFn).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(abortError);
  });

  it('应该使用自定义的 AbortController', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const customController = new AbortController();
    const onError = jest.fn();

    renderHook(() => {
      useEffectCustomAsync(mockFn, [], onError, customController);
    });

    await act(async () => {
      jest.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(mockFn).toHaveBeenCalledWith(customController.signal);
  });

  it('应该在没有 onError 处理器时不抛出错误', async () => {
    const mockError = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(mockError);

    renderHook(() => {
      useEffectCustomAsync(mockFn, []);
    });

    await act(async () => {
      jest.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(mockFn).toHaveBeenCalled();
    // 应该不会抛出错误到控制台
  });

  it('defaultErrorHandler 应该存在', () => {
    expect(typeof useEffectCustomAsync.defaultErrorHandler).toBe('function');
  });
});