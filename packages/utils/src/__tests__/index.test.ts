import * as utils from '../index';

describe('utils/index', () => {
  it('应该导出所有模块', () => {
    // 检查是否导出了 object 模块
    expect(typeof utils.isEmpty).toBe('function');
    expect(typeof utils.deepClone).toBe('function');
    expect(typeof utils.isComplexDataType).toBe('function');

    // 检查是否导出了 sleep 模块
    expect(typeof utils.sleep).toBe('function');

    // 检查是否导出了 browser 模块
    // 这里需要根据实际的 browser 模块导出内容来调整
    expect(utils.isBrowser).toBeDefined();
  });

  it('导出的函数应该正常工作', async () => {
    // 测试 isEmpty
    expect(utils.isEmpty(null)).toBe(true);
    expect(utils.isEmpty({})).toBe(true);
    expect(utils.isEmpty({ a: 1 })).toBe(false);

    // 测试 deepClone
    const obj = { a: 1, b: { c: 2 } };
    const cloned = utils.deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);

    // 测试 isComplexDataType
    expect(utils.isComplexDataType({})).toBe(true);
    expect(utils.isComplexDataType(42)).toBe(false);

    // 测试 sleep
    jest.useFakeTimers();
    const sleepPromise = utils.sleep(100);
    jest.advanceTimersByTime(100);
    await expect(sleepPromise).resolves.toBeUndefined();
    jest.useRealTimers();
  });
});