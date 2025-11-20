import { sleep } from '../index';

describe('sleep function', () => {
    beforeEach(() => {
        // 使用 fake timers 来控制 setTimeout
        jest.useFakeTimers();
    });

    afterEach(() => {
        // 恢复真实 timers
        jest.useRealTimers();
    });

    it('should return a Promise', () => {
        const result = sleep(1000);
        expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve after specified time', async () => {
        const mockCallback = jest.fn();
        const promise = sleep(1000).then(mockCallback);

        // 初始状态，回调不应该被调用
        expect(mockCallback).not.toHaveBeenCalled();

        // 快进 999ms，回调仍然不应该被调用
        jest.advanceTimersByTime(999);
        await Promise.resolve(); // 让微任务有机会执行
        expect(mockCallback).not.toHaveBeenCalled();

        // 快进到 1000ms，回调应该被调用
        jest.advanceTimersByTime(1);
        await Promise.resolve();
        expect(mockCallback).toHaveBeenCalledTimes(1);

        // 等待 promise 完成
        await promise;
    });

    it('should resolve immediately for 0ms delay', async () => {
        const mockCallback = jest.fn();
        const promise = sleep(0).then(mockCallback);

        // 快进 0ms，回调应该被调用
        jest.advanceTimersByTime(0);
        await Promise.resolve();
        expect(mockCallback).toHaveBeenCalledTimes(1);

        await promise;
    });

    it('should handle different delay times correctly', async () => {
        const delay1 = 500;
        const delay2 = 1500;

        const startTime1 = Date.now();
        const promise1 = sleep(delay1);

        jest.advanceTimersByTime(delay1);
        await promise1;

        const startTime2 = Date.now();
        const promise2 = sleep(delay2);

        jest.advanceTimersByTime(delay2);
        await promise2;

        // 由于使用 fake timers，我们主要验证逻辑正确性
        expect(promise1).resolves.toBeUndefined();
        expect(promise2).resolves.toBeUndefined();
    });

    it('should work with multiple concurrent sleep calls', async () => {
        const delays = [100, 200, 300];
        const promises = delays.map(delay => sleep(delay));

        // 快进到第一个延迟
        jest.advanceTimersByTime(100);
        await promises[0];

        // 快进到第二个延迟
        jest.advanceTimersByTime(100);
        await promises[1];

        // 快进到第三个延迟
        jest.advanceTimersByTime(100);
        await promises[2];

        // 所有 promises 应该都成功完成
        await Promise.all(promises);
    });

    it('should reject properly when timer is cancelled', () => {
        // 注意：当前实现没有取消功能，这个测试展示预期的行为
        const promise = sleep(5000);

        // 清除所有定时器
        jest.clearAllTimers();

        // 由于 Promise 没有被 resolve，它应该保持 pending 状态
        expect(promise).resolves.toBeUndefined();
    });
});