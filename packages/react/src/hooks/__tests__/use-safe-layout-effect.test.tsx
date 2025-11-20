import { renderHook } from '@testing-library/react';
import { useSafeLayoutEffect } from '../use-safe-layout-effect';

// Mock isBrowser from utils
jest.mock('@unifying/utils', () => ({
  isBrowser: true
}));

describe('useSafeLayoutEffect', () => {
  it('应该导出一个函数', () => {
    expect(typeof useSafeLayoutEffect).toBe('function');
  });

  it('在浏览器环境中应该使用 useLayoutEffect', () => {
    const mockEffect = jest.fn();
    const mockCleanup = jest.fn();

    renderHook(() => {
      useSafeLayoutEffect(() => {
        mockEffect();
        return mockCleanup;
      }, []);
    });

    // 在测试环境中，useLayoutEffect 是同步执行的
    expect(mockEffect).toHaveBeenCalled();
  });

  it('应该支持依赖项数组', () => {
    const mockEffect = jest.fn();
    const { rerender } = renderHook(
      ({ deps }) => {
        useSafeLayoutEffect(mockEffect, deps);
      },
      { initialProps: { deps: [1] } }
    );

    expect(mockEffect).toHaveBeenCalledTimes(1);

    rerender({ deps: [1] });
    expect(mockEffect).toHaveBeenCalledTimes(1);

    rerender({ deps: [2] });
    expect(mockEffect).toHaveBeenCalledTimes(2);
  });

  it('应该正确处理清理函数', () => {
    const mockCleanup = jest.fn();

    const { unmount } = renderHook(() => {
      useSafeLayoutEffect(() => {
        return mockCleanup;
      }, []);
    });

    expect(mockCleanup).not.toHaveBeenCalled();

    unmount();

    expect(mockCleanup).toHaveBeenCalledTimes(1);
  });

  it('应该支持依赖项变化时重新运行 effect', () => {
    const mockEffect = jest.fn();
    const { rerender } = renderHook(
      ({ value }) => {
        useSafeLayoutEffect(() => {
          mockEffect(value);
        }, [value]);
      },
      { initialProps: { value: 'initial' } }
    );

    expect(mockEffect).toHaveBeenCalledWith('initial');

    mockEffect.mockClear();
    rerender({ value: 'updated' });

    expect(mockEffect).toHaveBeenCalledWith('updated');
  });

  it('应该在没有依赖项时只运行一次', () => {
    const mockEffect = jest.fn();
    const { rerender } = renderHook(() => {
      useSafeLayoutEffect(mockEffect);
    });

    expect(mockEffect).toHaveBeenCalledTimes(1);

    rerender();
    expect(mockEffect).toHaveBeenCalledTimes(1);
  });
});