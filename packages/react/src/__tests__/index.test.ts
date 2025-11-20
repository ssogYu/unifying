import * as reactHooks from '../index';

describe('react/index', () => {
  it('应该导出所有 hooks', () => {
    // 检查是否导出了所有的 hooks
    expect(typeof reactHooks.useBoolean).toBe('function');
    expect(typeof reactHooks.useCallbackRef).toBe('function');
    expect(typeof reactHooks.useSafeLayoutEffect).toBe('function');
    expect(typeof reactHooks.useEffectCustomAsync).toBe('function');
  });

  it('导出的 hooks 应该正常工作', () => {
    // 基本类型检查
    const exportedFunctions = Object.entries(reactHooks).filter(([_, value]) => typeof value === 'function');

    expect(exportedFunctions.length).toBeGreaterThan(0);
    exportedFunctions.forEach(([name, hook]) => {
      expect(hook).toBeDefined();
      expect(typeof hook).toBe('function');
    });
  });
});