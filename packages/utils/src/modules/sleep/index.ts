/**
 * 延迟函数
 * @param time 毫秒
 * @returns
 */
export const sleep = (time: number): Promise<void> =>
    new Promise((resolve) => {
        setTimeout(resolve, time);
    });